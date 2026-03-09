'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { adminSupabase } from '@/lib/supabase'
import { Users as UsersIcon, Mail, Calendar, Search, MessageCircle } from 'lucide-react'

type CustomerProfile = {
    email: string
    name: string
    source: 'Order' | 'Inquiry' | 'Chat'
    last_active: string
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<CustomerProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const fetchUsers = async () => {
            const profilesMap = new Map<string, CustomerProfile>()

            // 1. Fetch from Orders
            const { data: orders } = await adminSupabase.from('orders').select('customer_name, customer_email, created_at').order('created_at', { ascending: false })
            if (orders) {
                orders.forEach(o => {
                    const email = o.customer_email?.toLowerCase().trim()
                    if (email && !profilesMap.has(email)) {
                        profilesMap.set(email, { name: o.customer_name, email, source: 'Order', last_active: o.created_at })
                    }
                })
            }

            // 2. Fetch from Inquiries
            const { data: inquiries } = await adminSupabase.from('inquiries').select('name, email, created_at').order('created_at', { ascending: false })
            if (inquiries) {
                inquiries.forEach(i => {
                    const email = i.email?.toLowerCase().trim()
                    if (email && !profilesMap.has(email)) {
                        profilesMap.set(email, { name: i.name, email, source: 'Inquiry', last_active: i.created_at })
                    }
                })
            }

            // Convert to array and sort by latest activity
            const aggregated = Array.from(profilesMap.values()).sort((a, b) => new Date(b.last_active).getTime() - new Date(a.last_active).getTime())
            setUsers(aggregated)
            setLoading(false)
        }

        fetchUsers()
    }, [])

    const deleteUser = async (userEmail: string) => {
        if (!confirm(`Are you sure you want to delete ${userEmail} and all associated data? This will remove their orders, inquiries, and chat history.`)) return

        try {
            // Delete orders (this should cascade if configured, but let's be explicit if not sure)
            await adminSupabase.from('orders').delete().ilike('customer_email', userEmail)

            // Delete inquiries
            await adminSupabase.from('inquiries').delete().ilike('email', userEmail)

            // Delete chat messages where message starts with [email]
            await adminSupabase.from('chat_messages').delete().like('message', `[${userEmail}]%`)

            // Update local state
            setUsers(prev => prev.filter(u => u.email !== userEmail))
        } catch (error) {
            console.error('Error deleting user data:', error)
            alert('An error occurred while deleting user data.')
        }
    }

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }

    if (loading) {
        return <div className="p-8"><div className="animate-pulse bg-gray-200 h-10 w-48 rounded mb-6"></div></div>
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Customer Pipeline</h1>
                    <p className="text-gray-500 font-medium text-sm mt-1">Aggregated list of registered and interacting customers.</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input-dark bg-white border-gray-200 w-full pl-9"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="admin-table w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-[10px] uppercase tracking-widest text-gray-500">
                                <th className="p-4 font-bold">Customer Name</th>
                                <th className="p-4 font-bold">Email Address</th>
                                <th className="p-4 font-bold">Initial Source</th>
                                <th className="p-4 font-bold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500 font-medium">No customers found.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, idx) => (
                                    <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-gray-900">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                <Mail size={14} className="text-gray-400 shrink-0" />
                                                <a href={`mailto:${user.email}`} className="hover:text-blue-600 hover:underline truncate max-w-[120px] sm:max-w-[200px] md:max-w-xs">{user.email}</a>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                                                ${user.source === 'Order' ? 'bg-green-100 text-green-700' :
                                                    user.source === 'Inquiry' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}
                                            `}>
                                                {user.source}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                                                <Calendar size={14} className="text-gray-400" />
                                                {formatDate(user.last_active)}
                                            </div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={`/admin/chat?email=${encodeURIComponent(user.email)}`}
                                                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-blue-100 transition-all"
                                                >
                                                    <MessageCircle size={14} />
                                                    Chat
                                                </Link>
                                                <button
                                                    onClick={() => deleteUser(user.email)}
                                                    className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg border border-transparent hover:border-red-100 transition-all"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
