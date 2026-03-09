'use client'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Phone, Mail } from 'lucide-react'
import { supabase, ChatMessage } from '@/lib/supabase'
import { useAuth } from './AuthProvider'

const getSessionId = () => {
    if (typeof window === 'undefined') return 'demo-session'
    let sid = localStorage.getItem('ag_chat_session')
    if (!sid) {
        sid = 'sess_' + Math.random().toString(36).substring(2, 9)
        localStorage.setItem('ag_chat_session', sid)
    }
    return sid
}



export default function LiveChat() {
    const [open, setOpen] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState('')
    const [hasUnread, setHasUnread] = useState(false)
    const [sessionId, setSessionId] = useState('')
    const [notification, setNotification] = useState<string | null>(null)
    const { user } = useAuth()
    const endRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setSessionId(getSessionId())
    }, [])

    useEffect(() => {
        const handleOpen = () => setOpen(true)
        window.addEventListener('custom:open-chat', handleOpen)
        return () => window.removeEventListener('custom:open-chat', handleOpen)
    }, [])

    useEffect(() => {
        if (!sessionId) return

        // Fetch existing
        const fetchMessages = async () => {
            const { data } = await supabase.from('chat_messages').select('*').eq('session_id', sessionId).order('created_at', { ascending: true })
            if (data && data.length > 0) {
                setMessages(data as ChatMessage[])
            } else {
                // Add welcome message if empty
                setMessages([{
                    id: 'welcome',
                    session_id: sessionId,
                    sender: 'agent',
                    message: '👋 Hello! Welcome to AG Truck Beds and Parts. How can we help you today?',
                    created_at: new Date().toISOString()
                }])
            }
        }
        fetchMessages()

        // Subscribe to new
        const channel = supabase
            .channel('chat_messages_changes')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}` }, (payload) => {
                setMessages(prev => {
                    if (prev.some(m => m.id === payload.new.id)) return prev
                    const isFromAgent = payload.new.sender === 'agent'
                    if (!open && isFromAgent) {
                        setHasUnread(true)
                        setNotification(payload.new.message)
                        setTimeout(() => setNotification(null), 8000)
                    }
                    return [...prev, payload.new as ChatMessage]
                })
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [sessionId, open]) // Added open so unread isn't wiped immediately if closed

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        if (open) setHasUnread(false)
    }, [open])



    const sendMessage = async () => {
        if (!input.trim() || !sessionId || !user) return

        const userMsg = input.trim()
        setInput('')

        const userName = user.user_metadata?.full_name || user.user_metadata?.name;
        const senderIdentity = userName ? `${userName} (${user.email})` : (user.email || 'Authenticated User')

        // Optimistic UI update
        const tempId = 'temp_' + Date.now()
        setMessages(prev => [...prev, {
            id: tempId,
            session_id: sessionId,
            sender: 'user',
            message: userMsg,
            created_at: new Date().toISOString()
        }])

        await supabase.from('chat_messages').insert([{
            session_id: sessionId,
            sender: 'user',
            message: `[${senderIdentity}] ${userMsg}`,
            user_email: user.email
        }])
    }

    const formatTime = (iso: string) => {
        try {
            return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        } catch {
            return ''
        }
    }



    return (
        <>
            {/* Chat window */}
            {open && (
                <div className="chat-window animate-fade-up flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white border-b border-blue-700 shadow-sm rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-9 h-9 rounded-full bg-white text-blue-600 flex items-center justify-center text-xs font-black shadow-sm">AG</div>
                                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">AG Truck Beds</p>
                                <p className="text-[10px] text-blue-100 font-medium">Online • Typically replies in minutes</p>
                            </div>
                        </div>
                        <button onClick={() => setOpen(false)} className="text-blue-100 hover:text-white transition p-1">
                            <X size={18} />
                        </button>
                    </div>

                    {user ? (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3 min-h-[260px] max-h-[260px] bg-white">
                                {messages.map((msg) => {
                                    // Strip the identity prefix for display
                                    const displayMessage = msg.sender === 'user' ? msg.message.replace(/^\[.*?\]\s*/, '') : msg.message;
                                    return (
                                        <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} gap-2`}>
                                            {msg.sender === 'agent' && (
                                                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 mt-auto shadow-sm">AG</div>
                                            )}
                                            <div
                                                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${msg.sender === 'user'
                                                    ? 'bg-blue-600 text-white rounded-br-sm shadow-sm'
                                                    : 'bg-gray-100 text-gray-800 rounded-bl-sm border border-gray-200 shadow-sm'
                                                    }`}
                                            >
                                                <p>{displayMessage}</p>
                                                <p className={`text-[9px] opacity-70 mt-1 text-right ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>{formatTime(msg.created_at)}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div ref={endRef} />
                            </div>

                            {/* Quick Actions */}
                            <div className="px-4 py-2 border-t border-gray-100 flex gap-2 overflow-x-auto bg-white">
                                {['Get a quote', 'Truck bed availability', 'Location'].map((q) => (
                                    <button
                                        key={q}
                                        className="whitespace-nowrap text-[11px] px-3 py-1.5 rounded-full border border-gray-200 bg-white text-blue-600 hover:text-white hover:border-blue-600 hover:bg-blue-600 transition-all flex-shrink-0 font-bold shadow-sm"
                                        onClick={() => { setInput(q); }}
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>

                            {/* Input */}
                            <div className="px-4 py-3 flex gap-2 bg-white pb-4 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] rounded-b-2xl relative z-10">
                                <input
                                    className="input-dark flex-1 text-sm py-2 !bg-gray-50 border-gray-200 shadow-inner focus:bg-white"
                                    placeholder="Type a message..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim()}
                                    className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all shadow-md flex-shrink-0"
                                >
                                    <Send size={16} className="-ml-0.5" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white min-h-[380px] text-center">
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
                                <MessageCircle size={32} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-3 tracking-tight uppercase">Chat with Admin</h3>
                            <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium">Please sign in to your account to start a live conversation with our support team.</p>

                            <a href="/login" className="btn-primary w-full justify-center py-3 shadow-md uppercase tracking-widest text-xs font-black">
                                Log In to Chat
                            </a>
                            <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Don't have an account? <a href="/login" className="text-blue-600 hover:underline">Sign up</a>
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Toggle button - High Visibility */}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">
                {notification && !open && (
                    <div
                        className="bg-white border-2 border-blue-600 rounded-2xl px-4 py-3 shadow-2xl max-w-[240px] animate-fade-left cursor-pointer hover:scale-105 transition-transform"
                        onClick={() => { setOpen(true); setNotification(null); }}
                    >
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                            New Message
                        </p>
                        <p className="text-sm text-gray-800 line-clamp-2 font-medium leading-tight">
                            {notification}
                        </p>
                    </div>
                )}
                <button
                    className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl shadow-blue-600/30 border-2 border-white flex items-center justify-center hover:scale-110 transition-all duration-300 relative group"
                    onClick={() => { setOpen(!open); setHasUnread(false); setNotification(null); }}
                    aria-label="Toggle chat"
                >
                    {open ? <X size={26} /> : <MessageCircle size={26} />}
                    {hasUnread && !open && (
                        <span className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-black border-2 border-white shadow-lg animate-bounce">1</span>
                    )}
                    <span className="absolute right-full mr-4 px-3 py-1.5 bg-gray-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-white/10">
                        Chat with us
                    </span>
                </button>
            </div>
        </>
    )
}
