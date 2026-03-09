'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { Package, Clock, CheckCircle, ChevronRight, User, Settings, LogOut } from 'lucide-react'

type Order = {
    id: string
    created_at: string
    status: string
    total_amount: number
    reservation_fee: number
}

export default function UserDashboard() {
    const { user, signOut } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return

        const fetchUserOrders = async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('customer_email', user.email)
                .order('created_at', { ascending: false })

            if (data) setOrders(data)
            setLoading(false)
        }

        fetchUserOrders()
    }, [user])

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-black text-gray-900 mb-4">NOT SIGNED IN</h1>
                    <Link href="/login" className="btn-primary">LOGIN TO ACCESS DASHBOARD</Link>
                </div>
            </div>
        )
    }

    const StatusBadge = ({ status }: { status: string }) => {
        if (status === 'pending_payment') return <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100 uppercase tracking-tighter"><Clock size={10} /> Pending</span>
        if (status === 'reserved') return <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-tighter"><CheckCircle size={10} /> Reserved</span>
        if (status === 'completed') return <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 uppercase tracking-tighter"><CheckCircle size={10} /> Completed</span>
        return <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100 uppercase tracking-tighter">{status}</span>
    }

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20 pt-24">
            <div className="max-w-5xl mx-auto px-6">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar */}
                    <aside className="w-full md:w-64 flex flex-col gap-6">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-200">
                                <User size={32} />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 truncate">{user.email?.split('@')[0].toUpperCase()}</h2>
                            <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mt-1">{user.email}</p>

                            <div className="mt-8 flex flex-col gap-2">
                                <button className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm border border-blue-100 transition-all">
                                    <Package size={18} />
                                    My Reservations
                                </button>
                                <button className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-500 font-bold text-sm transition-all">
                                    <Settings size={18} />
                                    Account Settings
                                </button>
                                <button
                                    onClick={() => signOut()}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-500 font-bold text-sm transition-all mt-4"
                                >
                                    <LogOut size={18} />
                                    Sign Out
                                </button>
                            </div>
                        </div>

                        <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200 relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-lg font-black mb-2 uppercase tracking-tight">Need Help?</h3>
                                <p className="text-sm text-blue-100 font-medium mb-4 opacity-80">Our support team is available Monday–Saturday.</p>
                                <Link href="/contact" className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform">
                                    Contact Us
                                </Link>
                            </div>
                            <MessageCircle size={100} className="absolute -bottom-10 -right-10 text-blue-500/20 group-hover:scale-110 transition-transform" />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="mb-8">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">MY RESERVATIONS</h1>
                            <p className="text-sm font-medium text-gray-500 mt-1 uppercase tracking-widest">Track your truck parts and equipment orders</p>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-24 bg-gray-100 rounded-3xl animate-pulse" />
                                ))}
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                                    <Package size={32} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">No Reservations Found</h3>
                                <p className="text-sm text-gray-500 mb-6">You haven't made any truck part reservations yet.</p>
                                <Link href="/shop" className="btn-primary inline-flex">Explore Catalog</Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <div key={order.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-blue-600 font-black border border-gray-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                #{order.id.slice(0, 4).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <p className="font-black text-gray-900 tracking-tight">ORDER #{order.id.slice(0, 8).toUpperCase()}</p>
                                                    <StatusBadge status={order.status} />
                                                </div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                                    {new Date(order.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                                                <p className="text-lg font-black text-gray-900">${order.total_amount.toLocaleString()}</p>
                                            </div>
                                            <ChevronRight className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" size={20} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
