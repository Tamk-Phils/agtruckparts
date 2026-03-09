'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, MessageSquare, Star, LogOut, Menu, X, Settings, Bell, Users } from 'lucide-react'
import { adminSupabase } from '@/lib/supabase'

const ADMIN_NAV = [
    { label: 'Dashboard', href: '/admin', Icon: LayoutDashboard },
    { label: 'Live Chat', href: '/admin/chat', Icon: MessageSquare },
    { label: 'Orders', href: '/admin/orders', Icon: Package },
    { label: 'Products', href: '/admin/products', Icon: Package },
    { label: 'Inquiries', href: '/admin/inquiries', Icon: MessageSquare },
    { label: 'Reviews', href: '/admin/reviews', Icon: Star },
    { label: 'Users', href: '/admin/users', Icon: Users },
    { label: 'Settings', href: '/admin/settings', Icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sideOpen, setSideOpen] = useState(true)
    const [toast, setToast] = useState<{ message: string, href: string, id: number } | null>(null)
    const pathname = usePathname()
    const [loading, setLoading] = useState(true)
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        let ordersChannel: any;
        let inquiriesChannel: any;
        let chatChannel: any;

        const checkAuth = async () => {
            const { data: { session } } = await adminSupabase.auth.getSession()
            const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'agtruckbedsandparts@gmail.com').trim().toLowerCase()

            if (!session || session.user.email?.toLowerCase() !== adminEmail) {
                window.location.href = '/login'
            } else {
                setIsAuthorized(true)
                setLoading(false)

                // Initialize channels only after authorization
                ordersChannel = adminSupabase.channel('admin_order_alerts')
                    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (payload) => {
                        const id = Date.now()
                        setToast({ message: `New Order Received from ${payload.new.customer_name}!`, href: '/admin/orders', id })
                        setTimeout(() => {
                            setToast(current => current?.id === id ? null : current)
                        }, 8000)
                    })
                    .subscribe()

                inquiriesChannel = adminSupabase.channel('admin_inquiry_alerts')
                    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'inquiries' }, (payload) => {
                        const id = Date.now()
                        setToast({ message: `New Request from ${payload.new.name}!`, href: '/admin/inquiries', id })
                        setTimeout(() => {
                            setToast(current => current?.id === id ? null : current)
                        }, 8000)
                    })
                    .subscribe()

                chatChannel = adminSupabase.channel('admin_chat_alerts')
                    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
                        if (payload.new.sender === 'user') {
                            const id = Date.now()
                            const match = payload.new.message.match(/^\[(.*?)\]/)
                            const sender = match ? match[1] : 'A customer'
                            const text = payload.new.message.replace(/^\[.*?\]\s*/, '')
                            const targetEmail = payload.new.user_email

                            setToast({
                                message: `${sender}: ${text.substring(0, 30)}${text.length > 30 ? '...' : ''}`,
                                href: targetEmail ? `/admin/chat?email=${targetEmail}` : '/admin/chat',
                                id
                            })
                            setTimeout(() => {
                                setToast(current => current?.id === id ? null : current)
                            }, 8000)
                        }
                    })
                    .subscribe()
            }
        }
        checkAuth()

        return () => {
            if (ordersChannel) adminSupabase.removeChannel(ordersChannel)
            if (inquiriesChannel) adminSupabase.removeChannel(inquiriesChannel)
            if (chatChannel) adminSupabase.removeChannel(chatChannel)
        }
    }, [])

    if (loading || !isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Verifying Admin Access...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex bg-gray-50" style={{ paddingTop: 0 }}>
            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-6 right-6 z-[100] animate-fade-up">
                    <div className="bg-white border-l-4 border-blue-600 shadow-xl rounded-r-xl p-4 flex items-start gap-4 max-w-sm">
                        <div className="mt-0.5 rounded-full bg-blue-100 p-2 text-blue-600">
                            <Bell size={16} className="animate-pulse" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-black text-gray-900 mb-1">New Alert</p>
                            <p className="text-xs font-medium text-gray-600">{toast.message}</p>
                            <Link href={toast.href} onClick={() => setToast(null)} className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-2 inline-block hover:underline">
                                View
                            </Link>
                        </div>
                        <button onClick={() => setToast(null)} className="text-gray-400 hover:text-gray-900 p-1">
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}

            {/* Sidebar */}
            <aside className={`${sideOpen ? 'w-56' : 'w-16'} transition-all duration-300 flex flex-col border-r border-gray-200 bg-white h-screen sticky top-0 shadow-sm z-50`}>
                <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200">
                    {sideOpen && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-black text-white shadow-sm">AG</div>
                            <div>
                                <p className="text-sm font-bold text-gray-900 leading-none">AG ADMIN</p>
                                <p className="text-[10px] text-gray-500 font-medium">Control Panel</p>
                            </div>
                        </div>
                    )}
                    <button onClick={() => setSideOpen(!sideOpen)} className="text-gray-400 hover:text-gray-800 transition p-1 rounded-md hover:bg-gray-100">
                        {sideOpen ? <X size={16} /> : <Menu size={16} />}
                    </button>
                </div>

                <nav className="flex flex-col gap-1 p-3 flex-1">
                    {ADMIN_NAV.map(({ label, href, Icon }) => {
                        const active = pathname === href
                        return (
                            <Link
                                key={label}
                                href={href}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${active
                                    ? 'bg-blue-50 text-blue-600 border border-blue-200 shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
                                    }`}
                            >
                                <Icon size={16} className="flex-shrink-0" />
                                {sideOpen && <span>{label}</span>}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-3 border-t border-gray-200">
                    <Link href="/" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100`}>
                        <LogOut size={16} className="flex-shrink-0" />
                        {sideOpen && <span>Exit Admin</span>}
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-6 md:p-8">
                    {children}
                </div>
            </div>
        </div>
    )
}
