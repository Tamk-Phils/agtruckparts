'use client'
import { useState, useEffect } from 'react'
import { adminSupabase, Product, Review, Inquiry  } from '@/lib/supabase'
import { Package, MessageSquare, Star, TrendingUp, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        inStock: 0,
        outOfStock: 0,
        totalReviews: 0,
        avgRating: '0.0',
        openInquiries: 0
    })
    const [recentProducts, setRecentProducts] = useState<Product[]>([])
    const [recentReviews, setRecentReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        setLoading(true)
        try {
            // Fetch Products
            const { data: products } = await adminSupabase.from('products').select('*').order('created_at', { ascending: false })
            const p = products || []
            const inStock = p.filter(item => item.in_stock).length

            // Fetch Reviews
            const { data: reviews } = await adminSupabase.from('reviews').select('*').order('created_at', { ascending: false })
            const r = reviews || []
            const avgRating = r.length > 0
                ? (r.reduce((acc, curr) => acc + curr.rating, 0) / r.length).toFixed(1)
                : '0.0'

            // Fetch Inquiries
            const { count: openInquiries } = await adminSupabase
                .from('inquiries')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'new')

            setStats({
                totalProducts: p.length,
                inStock,
                outOfStock: p.length - inStock,
                totalReviews: r.length,
                avgRating,
                openInquiries: openInquiries || 0
            })

            setRecentProducts(p.slice(0, 5))
            setRecentReviews(r.slice(0, 4))
        } catch (error) {
            console.error("Error fetching dashboard data:", error)
        } finally {
            setLoading(false)
        }
    }

    const STATS_CARDS = [
        { label: 'Total Products', value: stats.totalProducts, Icon: Package, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
        { label: 'In Stock', value: stats.inStock, Icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
        { label: 'Out of Stock', value: stats.outOfStock, Icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
        { label: 'Reviews', value: stats.totalReviews, Icon: Star, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
        { label: 'Avg Rating', value: stats.avgRating, Icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
        { label: 'New Inquiries', value: stats.openInquiries, Icon: MessageSquare, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-100' },
    ]

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Dashboard...</p>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Dashboard</h1>
                <p className="text-sm text-gray-600 mt-2 font-medium">Welcome back, AG Truck Beds Admin</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
                {STATS_CARDS.map(({ label, value, Icon, color, bg }) => (
                    <div key={label} className="bg-white border border-gray-200 shadow-sm p-5 rounded-2xl flex flex-col gap-3 hover:shadow-md transition-shadow">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${bg}`}>
                            <Icon size={18} className={color} />
                        </div>
                        <p className="text-3xl font-black text-gray-900 tracking-tight">{value}</p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Products & Reviews */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Products */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="font-bold text-gray-900 text-base">Recent Products</h2>
                        <Link href="/admin/products" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition">View All →</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentProducts.length > 0 ? recentProducts.map((p) => (
                                    <tr key={p.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
                                        <td className="text-gray-700 font-bold text-sm max-w-[140px] truncate">{p.name}</td>
                                        <td>
                                            <span className="badge text-[10px] bg-gray-100 text-gray-600 border-gray-200 uppercase tracking-wider font-bold">{p.category}</span>
                                        </td>
                                        <td className="text-gray-900 font-black">${p.price.toLocaleString()}</td>
                                        <td>
                                            {p.in_stock ? (
                                                <span className="badge badge-green text-[10px] font-bold uppercase">In Stock</span>
                                            ) : (
                                                <span className="badge badge-red text-[10px] font-bold uppercase">Out</span>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={4} className="text-center py-8 text-gray-400 text-sm italic">No products found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Reviews */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                        <h2 className="font-bold text-gray-900 text-base">Recent Reviews</h2>
                        <Link href="/admin/reviews" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition">View All →</Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {recentReviews.length > 0 ? recentReviews.map((r) => (
                            <div key={r.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden flex-shrink-0 shadow-sm">
                                        <img
                                            src={`https://i.pravatar.cc/150?u=${r.author.toLowerCase().replace(/\s/g, '')}`}
                                            alt={r.author}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm text-gray-900 font-bold">{r.author}</p>
                                        <p className="text-xs text-gray-500 font-medium truncate italic">"{r.comment}"</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} size={10} fill={i < r.rating ? "#f59e0b" : "none"} className={i < r.rating ? "text-amber-500" : "text-gray-300"} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{r.location}</span>
                                </div>
                            </div>
                        )) : (
                            <div className="px-6 py-12 text-center text-gray-400 text-sm italic">No reviews yet</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-10">
                <h2 className="font-bold text-gray-900 text-base mb-5 uppercase tracking-widest text-xs opacity-50">Quick Actions</h2>
                <div className="flex flex-wrap gap-4">
                    <Link href="/admin/products" className="btn-primary text-xs shadow-md px-6 py-3">
                        + Add Product
                    </Link>
                    <Link href="/admin/inquiries" className="btn-glass bg-white text-gray-800 border-gray-200 hover:bg-gray-50 font-bold text-xs shadow-sm px-6 py-3">
                        View Inquiries
                    </Link>
                    <Link href="/shop" target="_blank" className="btn-glass bg-white text-gray-800 border-gray-200 hover:bg-gray-50 font-bold text-xs shadow-sm px-6 py-3">
                        Preview Store Front →
                    </Link>
                </div>
            </div>
        </div>
    )
}

