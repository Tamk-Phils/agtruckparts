'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { MessageCircle, Search, Clock, Check, Send, User, X } from 'lucide-react'
import { adminSupabase, ChatMessage } from '@/lib/supabase'

type ChatSession = {
    session_id: string
    last_message: ChatMessage
    unread: number
    identity: string
}

function ChatContent() {
    const searchParams = useSearchParams()
    const targetEmail = searchParams.get('email')
    const [sessions, setSessions] = useState<ChatSession[]>([])
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [activeSession, setActiveSession] = useState<string | null>(null)
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(true)
    const endRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchInitialData = async () => {
            // Get all messages to build sessions
            const { data } = await adminSupabase
                .from('chat_messages')
                .select('*')
                .order('created_at', { ascending: false })

            if (data) {
                const msgs = data as ChatMessage[]
                const sessionMap = new Map<string, ChatSession>()
                const sortedMsgs = [...msgs].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

                msgs.forEach(msg => {
                    if (!sessionMap.has(msg.session_id)) {
                        const firstWithIdentity = sortedMsgs.find(m => m.session_id === msg.session_id && m.message.startsWith('['))
                        let identity = "Anonymous Visitor"
                        if (firstWithIdentity) {
                            const match = firstWithIdentity.message.match(/^\[(.*?)\]/)
                            if (match) identity = match[1]
                        }
                        sessionMap.set(msg.session_id, { session_id: msg.session_id, last_message: msg, unread: 0, identity })
                    }

                    if (msg.sender === 'user' && msg.read === false) {
                        const session = sessionMap.get(msg.session_id)
                        if (session) session.unread += 1
                    }
                })

                const sessionsList = Array.from(sessionMap.values())
                setSessions(sessionsList)

                // AUTO-SELECT session if targetEmail exists
                if (targetEmail) {
                    const matchedSession = sessionsList.find(s => s.identity.toLowerCase().includes(targetEmail.toLowerCase()))
                    if (matchedSession) {
                        setActiveSession(matchedSession.session_id)
                    }
                }
            }
            setLoading(false)
        }

        fetchInitialData()

        // Subscribe to all new messages
        const channel = adminSupabase.channel('admin_global_chat')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
                const newMsg = payload.new as ChatMessage

                // Update active messages if it belongs to current session
                setMessages(prev => {
                    // Check if active session matches
                    const isForActive = activeSession && newMsg.session_id === activeSession;
                    if (isForActive) {
                        return prev.some(m => m.id === newMsg.id) ? prev : [...prev, newMsg]
                    }
                    return prev
                })

                // Update session list
                setSessions(prev => {
                    const existing = prev.find(s => s.session_id === newMsg.session_id)
                    let identity = existing?.identity || "Anonymous Visitor"

                    // If we don't have an identity yet, or it's anonymous, try to get it from the new message
                    if (identity === "Anonymous Visitor" && newMsg.message.startsWith('[')) {
                        const match = newMsg.message.match(/^\[(.*?)\]/)
                        if (match) identity = match[1]
                    }

                    const updatedSession = {
                        session_id: newMsg.session_id,
                        last_message: newMsg,
                        unread: (existing?.unread || 0) + (newMsg.sender === 'user' && newMsg.session_id !== activeSession ? 1 : 0),
                        identity
                    }

                    const filtered = prev.filter(s => s.session_id !== newMsg.session_id)
                    return [updatedSession, ...filtered]
                })
            })
            .subscribe()

        return () => { adminSupabase.removeChannel(channel) }
    }, [activeSession]) // Added activeSession dependency so the closure has the latest active session

    // Fetch messages when active session changes
    useEffect(() => {
        if (!activeSession) return
        const fetchActiveMessages = async () => {
            const { data } = await adminSupabase
                .from('chat_messages')
                .select('*')
                .eq('session_id', activeSession)
                .order('created_at', { ascending: true })
            if (data) setMessages(data as ChatMessage[])

            // Clear unread
            setSessions(prev => prev.map(s => s.session_id === activeSession ? { ...s, unread: 0 } : s))

            // Mark as read in DB
            await adminSupabase
                .from('chat_messages')
                .update({ read: true })
                .eq('session_id', activeSession)
                .eq('sender', 'user')
                .eq('read', false)
        }
        fetchActiveMessages()
    }, [activeSession])

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const deleteSession = async () => {
        if (!activeSession) return
        if (!confirm('Are you sure you want to permanently delete this conversation and all its history?')) return

        const { error } = await adminSupabase
            .from('chat_messages')
            .delete()
            .eq('session_id', activeSession)

        if (!error) {
            setSessions(prev => prev.filter(s => s.session_id !== activeSession))
            setMessages([])
            setActiveSession(null)
        } else {
            console.error('Error deleting session:', error)
            alert('Failed to delete conversation.')
        }
    }

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || !activeSession) return

        const msgText = input.trim()
        setInput('')

        // Optimistic UI
        const tempMsg: ChatMessage = {
            id: 'temp_' + Date.now(),
            session_id: activeSession,
            sender: 'agent',
            message: msgText,
            created_at: new Date().toISOString()
        }
        setMessages(prev => [...prev, tempMsg])

        await adminSupabase.from('chat_messages').insert([{
            session_id: activeSession,
            sender: 'agent',
            message: msgText
        }])
    }

    const formatTime = (iso: string) => {
        try { return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
        catch { return '' }
    }

    const [showSidebar, setShowSidebar] = useState(true)

    useEffect(() => {
        if (activeSession) setShowSidebar(false)
        else setShowSidebar(true)
    }, [activeSession])

    if (loading) return <div className="p-8"><div className="animate-pulse bg-gray-200 h-10 w-48 rounded mb-6"></div></div>

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col min-h-[500px]">
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight mb-4 md:mb-8 px-4 md:px-0">Live Chat Queue</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-1 min-h-0">
                {/* Sessions List (Sidebar) */}
                <div className={`${showSidebar ? 'flex' : 'hidden md:flex'} w-full md:w-1/3 border-r border-gray-200 bg-gray-50 flex-col`}>
                    <div className="p-4 border-b border-gray-200 bg-white">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold" size={16} />
                            <input type="text" placeholder="Search conversations..." className="input-dark bg-gray-50 border-gray-200 w-full pl-9 py-2 text-sm" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {sessions.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 font-medium text-sm">No active conversations.</div>
                        ) : (
                            sessions.map(session => {
                                const active = session.session_id === activeSession
                                // Strip identity tag for preview
                                const previewMsg = session.last_message.message.replace(/^\[.*?\]\s*/, '')

                                return (
                                    <button
                                        key={session.session_id}
                                        onClick={() => {
                                            setActiveSession(session.session_id)
                                            setShowSidebar(false)
                                        }}
                                        className={`w-full text-left p-4 border-b border-gray-200 transition-colors ${active ? 'bg-blue-50 border-l-4 border-l-blue-600' : 'hover:bg-gray-100 border-l-4 border-l-transparent'}`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <p className={`text-sm font-bold truncate pr-2 ${active ? 'text-blue-900' : 'text-gray-900'}`}>
                                                {session.identity}
                                            </p>
                                            <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
                                                {formatTime(session.last_message.created_at)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className={`text-xs truncate ${session.unread > 0 ? 'text-gray-900 font-bold' : 'text-gray-500 font-medium'} max-w-[80%]`}>
                                                {session.last_message.sender === 'agent' ? 'You: ' : ''}{previewMsg}
                                            </p>
                                            {session.unread > 0 && (
                                                <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                    {session.unread}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                )
                            })
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`${!showSidebar ? 'flex' : 'hidden md:flex'} flex-1 flex flex-col bg-white min-w-0`}>
                    {activeSession ? (
                        <>
                            {/* Chat Header */}
                            <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white text-gray-900">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setShowSidebar(true)}
                                        className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-900"
                                    >
                                        <X size={20} />
                                    </button>
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                                        <User size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-gray-900 text-sm md:text-base truncate">{sessions.find(s => s.session_id === activeSession)?.identity || 'Visitor'}</h3>
                                        <p className="text-[10px] md:text-xs text-green-600 font-medium flex items-center gap-1">
                                            <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-green-500"></span> Online
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 md:gap-2">
                                    <button
                                        onClick={deleteSession}
                                        className="text-[10px] md:text-xs font-bold text-red-500 hover:bg-red-50 px-2 md:px-3 py-1.5 rounded-lg transition-colors border border-transparent hover:border-red-100 flex items-center gap-1"
                                    >
                                        <span className="hidden sm:inline">Delete Chat</span>
                                        <span className="sm:hidden">Delete</span>
                                    </button>
                                    <button onClick={() => setActiveSession(null)} className="hidden sm:block text-xs font-bold text-gray-500 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors border border-gray-200">
                                        Close
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 bg-gray-50">
                                {messages.map(msg => {
                                    const isAgent = msg.sender === 'agent'
                                    const displayMsg = msg.message.replace(/^\[.*?\]\s*/, '')

                                    return (
                                        <div key={msg.id} className={`flex max-w-[85%] md:max-w-[70%] ${isAgent ? 'ml-auto' : 'mr-auto'}`}>
                                            <div className={`p-3 md:p-4 text-sm rounded-2xl shadow-sm ${isAgent ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'}`}>
                                                <p className="leading-relaxed whitespace-pre-wrap">{displayMsg}</p>
                                                <p className={`text-[10px] mt-2 text-right ${isAgent ? 'text-blue-200' : 'text-gray-400 font-medium'}`}>
                                                    {formatTime(msg.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div ref={endRef} />
                            </div>

                            {/* Input Form */}
                            <div className="p-3 md:p-4 bg-white border-t border-gray-200">
                                <form onSubmit={sendMessage} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        placeholder="Type your reply..."
                                        className="input-dark bg-gray-50 border-gray-200 flex-1 px-3 md:px-4 py-2.5 md:py-3 text-sm"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim()}
                                        className="btn-primary w-10 h-10 md:w-12 md:h-12 flex items-center justify-center p-0 disabled:opacity-50 disabled:cursor-not-allowed text-white flex-shrink-0"
                                    >
                                        <Send size={16} className="md:size-18 -ml-0.5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8 text-center">
                            <MessageCircle size={48} className="text-gray-200 mb-4" />
                            <h3 className="text-lg font-bold text-gray-900 mb-1">No Chat Selected</h3>
                            <p className="text-sm">Select a conversation from the left to start replying.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default function AdminChatPage() {
    return (
        <Suspense fallback={<div className="p-8"><div className="animate-pulse bg-gray-200 h-10 w-48 rounded mb-6"></div></div>}>
            <ChatContent />
        </Suspense>
    )
}
