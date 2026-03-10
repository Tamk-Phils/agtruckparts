'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import {
    Package,
    Clock,
    CheckCircle,
    ChevronRight,
    User,
    Settings,
    LogOut,
    MessageSquare,
    Search,
    XCircle,
    ShoppingBag,
    ShieldCheck,
    ArrowRight,
    CreditCard
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

type Order = {
    id: string
    created_at: string
    status: string
    total_amount: number
    reservation_fee: number
    user_read: boolean
}

export default function UserDashboard() {
    const { user, signOut } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [chats, setChats] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'reservations' | 'chats'>('reservations')

    useEffect(() => {
        if (!user) return

        const fetchData = async () => {
            setLoading(true)
            // Fetch Orders
            const { data: orderData } = await supabase
                .from('orders')
                .select('*')
                .eq('customer_email', user.email)
                .order('created_at', { ascending: false })

            if (orderData) {
                setOrders(orderData)
                // Mark orders as read by user
                const unreadIds = orderData.filter(o => !o.user_read).map(o => o.id)
                if (unreadIds.length > 0) {
                    await supabase.from('orders').update({ user_read: true }).in('id', unreadIds)
                }
            }

            // Fetch Chat Sessions
            const { data: chatData } = await supabase
                .from('chat_messages')
                .select('*')
                .eq('user_email', user.email)
                .order('created_at', { ascending: false })

            if (chatData) {
                const sessions: any = {}
                chatData.forEach((msg: any) => {
                    if (!sessions[msg.session_id]) {
                        sessions[msg.session_id] = {
                            id: msg.session_id,
                            lastMessage: msg.message,
                            date: msg.created_at,
                            unread: msg.sender === 'agent' && !msg.read
                        }
                    }
                })
                setChats(Object.values(sessions))
            }

            setLoading(false)
        }

        fetchData()
    }, [user])

    if (!user) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-white font-['Inter']">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full text-center space-y-6"
                >
                    <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/20">
                        <ShieldCheck size={40} />
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">Access Denied</h1>
                    <p className="text-slate-400 font-medium leading-relaxed">Please sign in to your AG Truck Beds account to access your personal dashboard and order history.</p>
                    <Link href="/login" className="btn-primary w-full py-4 text-sm tracking-widest uppercase font-black">
                        Return to Login
                    </Link>
                </motion.div>
            </div>
        )
    }

    const StatusBadge = ({ status }: { status: string }) => {
        const styles: Record<string, string> = {
            pending_payment: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
            pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
            reserved: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            completed: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            cancelled: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        }
        const labels: Record<string, string> = {
            pending_payment: 'Pending Pay',
            pending: 'Searching Stock',
            reserved: 'Reserved',
            completed: 'Completed',
            cancelled: 'Cancelled',
        }
        const Icons: Record<string, any> = {
            pending_payment: Clock,
            pending: Search,
            reserved: CheckCircle,
            completed: CheckCircle,
            cancelled: XCircle,
        }
        const Icon = Icons[status] || Clock

        return (
            <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${styles[status] || 'bg-slate-500/10 text-slate-500 border-slate-500/20'}`}>
                <Icon size={10} strokeWidth={3} />
                {labels[status] || status}
            </span>
        )
    }

    const userInitial = user.email?.charAt(0).toUpperCase() || 'U'
    const userName = user.email?.split('@')[0].toUpperCase()

    return (
        <div className="min-h-screen bg-[#fafbfc] pb-32 pt-24 font-['Inter']">
            {/* Header Hero */}
            <div className="relative h-64 w-full bg-[#0f172a] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 to-black/80 z-10" />
                <div className="absolute inset-0 grid-bg opacity-30" />
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="max-w-7xl mx-auto px-6 md:px-12 h-full flex flex-col justify-end pb-12 relative z-20"
                >
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-blue-500/40 border-4 border-[#0f172a]">
                                {userInitial}
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                                    {userName}
                                </h1>
                                <p className="text-blue-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    Account Dashboard
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link href="/shop" className="btn-glass !bg-white/10 !text-white !border-white/20 hover:!bg-white/20 text-[10px] px-6 py-3 font-black uppercase tracking-widest">
                                Continue Shopping
                            </Link>
                            <button onClick={() => signOut()} className="p-3 bg-white/5 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/20 text-white/50 hover:text-rose-500 rounded-xl transition-all">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-10 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Sidebar - Stats & Actions */}
                    <aside className="lg:col-span-3 space-y-6">
                        {/* Status Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-400/5 transition-transform hover:-translate-y-1">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                                    <ShoppingBag size={20} />
                                </div>
                                <p className="text-3xl font-black text-slate-900 tracking-tight">{orders.length}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Found Orders</p>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-400/5 transition-transform hover:-translate-y-1">
                                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                                    <MessageSquare size={20} />
                                </div>
                                <p className="text-3xl font-black text-slate-900 tracking-tight">{chats.length}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Support Chats</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="bg-white p-3 rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-400/5">
                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => setActiveTab('reservations')}
                                    className={`flex items-center justify-between px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'reservations' ? 'bg-[#0f172a] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    <span className="flex items-center gap-3">
                                        <Package size={16} /> My Reservations
                                    </span>
                                    {activeTab === 'reservations' && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                                </button>
                                <button
                                    onClick={() => setActiveTab('chats')}
                                    className={`flex items-center justify-between px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'chats' ? 'bg-[#0f172a] text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    <span className="flex items-center gap-3">
                                        <MessageSquare size={16} /> Messages
                                    </span>
                                    {chats.some(c => c.unread) && <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />}
                                </button>
                                <Link
                                    href="/contact"
                                    className="flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all"
                                >
                                    <Settings size={16} /> Settings
                                </Link>
                            </div>
                        </div>

                        {/* Help Desk */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-xl font-black mb-3 leading-tight uppercase tracking-tight">Need Support?</h3>
                                <p className="text-xs text-blue-100/70 font-bold uppercase tracking-widest mb-6 leading-relaxed">Fast response for parts inquiry and order updates.</p>
                                <button
                                    onClick={() => { window.dispatchEvent(new CustomEvent('custom:open-chat')); }}
                                    className="w-full flex items-center justify-center gap-2 bg-white text-blue-700 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-transform"
                                >
                                    Open Chat <ArrowRight size={14} />
                                </button>
                            </div>
                            <div className="absolute -bottom-8 -right-8 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700">
                                <Package size={160} />
                            </div>
                        </div>
                    </aside>

                    {/* Main Feed */}
                    <main className="lg:col-span-9 space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {loading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="h-28 bg-white border border-slate-200/60 rounded-3xl animate-pulse" />
                                        ))}
                                    </div>
                                ) : activeTab === 'reservations' ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between px-2 mb-4">
                                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Purchase History</h2>
                                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{orders.length} ITEMS</span>
                                        </div>

                                        {orders.length === 0 ? (
                                            <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-200/60 shadow-xl shadow-slate-400/5">
                                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                                                    <Package size={40} />
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">No Orders Found</h3>
                                                <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed">Your reservation history is empty. Start browsing our premium truck beds and parts inventory.</p>
                                                <Link href="/shop" className="btn-primary inline-flex px-10">Start Discovering</Link>
                                            </div>
                                        ) : (
                                            <div className="grid gap-4">
                                                {orders.map(order => (
                                                    <motion.div
                                                        key={order.id}
                                                        layout
                                                        className="group bg-white rounded-3xl p-6 border border-slate-200/60 shadow-xl shadow-slate-400/5 hover:border-blue-200 hover:shadow-blue-500/5 transition-all"
                                                    >
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                            <div className="flex items-center gap-6">
                                                                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-blue-400 font-black text-xs shadow-lg group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                                                                    #{order.id.slice(0, 4).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                                                        <p className="text-lg font-black text-slate-900 tracking-tight">ORDER REF: {order.id.slice(0, 8).toUpperCase()}</p>
                                                                        <StatusBadge status={order.status} />
                                                                    </div>
                                                                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                                        <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date(order.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                                                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                                                        <span className="flex items-center gap-1.5"><CreditCard size={12} /> Reservation Secured</span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center justify-between md:justify-end gap-10 pt-6 md:pt-0 border-t md:border-0 border-slate-50">
                                                                <div className="text-left md:text-right">
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Valuation</p>
                                                                    <p className="text-2xl font-black text-slate-900 tracking-tight">${order.total_amount.toLocaleString()}</p>
                                                                </div>
                                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                                                                    <ChevronRight size={20} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between px-2 mb-4">
                                            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Communication Logs</h2>
                                            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-3 py-1 rounded-full">{chats.length} ACTIVE SESSIONS</span>
                                        </div>

                                        {chats.length === 0 ? (
                                            <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-200/60 shadow-xl shadow-slate-400/5">
                                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                                                    <MessageSquare size={40} />
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Secure Message Desk</h3>
                                                <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed">No active support threads. Our team is ready to assist you with any questions.</p>
                                                <button onClick={() => { window.dispatchEvent(new CustomEvent('custom:open-chat')); }} className="btn-primary inline-flex px-10">Start Consultation</button>
                                            </div>
                                        ) : (
                                            <div className="grid gap-4">
                                                {chats.map(chat => (
                                                    <motion.div
                                                        key={chat.id}
                                                        layout
                                                        onClick={() => { window.dispatchEvent(new CustomEvent('custom:open-chat')); }}
                                                        className="group bg-white rounded-3xl p-6 border border-slate-200/60 shadow-xl shadow-slate-400/5 hover:border-blue-200 cursor-pointer transition-all"
                                                    >
                                                        <div className="flex items-center justify-between gap-6">
                                                            <div className="flex items-center gap-6 min-w-0">
                                                                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-blue-400 relative">
                                                                    <MessageSquare size={22} />
                                                                    {chat.unread && (
                                                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-4 border-white animate-bounce" />
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="flex items-center gap-3 mb-1">
                                                                        <p className="text-lg font-black text-slate-900 tracking-tight uppercase">Support Thread</p>
                                                                        {chat.unread && <span className="text-[8px] font-black text-white bg-rose-500 px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg shadow-rose-500/20">New Message</span>}
                                                                    </div>
                                                                    <p className="text-sm font-medium text-slate-500 truncate max-w-md italic">
                                                                        &ldquo;{chat.lastMessage.replace(/\[.*?\]/, '').trim()}&rdquo;
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center gap-10 shrink-0">
                                                                <div className="text-right hidden sm:block">
                                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Recent Link</p>
                                                                    <p className="text-xs font-black text-slate-600">
                                                                        {new Date(chat.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                                    </p>
                                                                </div>
                                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                                                                    <ChevronRight size={20} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    )
}

function MessageCircle({ size, className }: { size: number, className: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
    )
}
