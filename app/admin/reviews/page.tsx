'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Star, Trash2, CheckCircle, XCircle } from 'lucide-react'

type Review = {
    id: string
    product_id: string | null
    author: string
    rating: number
    comment: string
    location: string
    verified: boolean
    created_at: string
}

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchReviews()
    }, [])

    const fetchReviews = async () => {
        setLoading(true)
        const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false })
        if (data) setReviews(data)
        setLoading(false)
    }

    const deleteReview = async (id: string) => {
        if (!confirm('Delete this review?')) return
        const { error } = await supabase.from('reviews').delete().eq('id', id)
        if (!error) {
            setReviews(reviews.filter(r => r.id !== id))
        } else {
            alert('Failed to delete review')
        }
    }

    const avgRating = reviews.length > 0 ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1) : '0.0'

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">REVIEWS</h1>
                    <p className="text-sm text-gray-600 font-medium mt-1">{reviews.length} reviews · Avg {avgRating} ⭐</p>
                </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-hidden">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Author</th>
                            <th>Rating</th>
                            <th>Comment</th>
                            <th>Location</th>
                            <th>Verified</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="text-center py-10">Loading reviews...</td></tr>
                        ) : reviews.length === 0 ? (
                            <tr><td colSpan={7} className="text-center py-10">No reviews found.</td></tr>
                        ) : reviews.map((r) => (
                            <tr key={r.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-xs font-black text-blue-700 flex-shrink-0 shadow-inner">
                                            {r.author[0]?.toUpperCase() || '?'}
                                        </div>
                                        <span className="text-gray-900 font-bold text-sm">{r.author}</span>
                                    </div>
                                </td>
                                <td>
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} size={14} fill={i < r.rating ? '#f59e0b' : 'none'} className={i < r.rating ? 'text-amber-500' : 'text-gray-300'} />
                                        ))}
                                    </div>
                                </td>
                                <td className="text-gray-600 font-medium text-xs max-w-[220px]">
                                    <p className="truncate">{r.comment}</p>
                                </td>
                                <td className="text-gray-500 font-bold text-xs uppercase tracking-widest">{r.location || 'N/A'}</td>
                                <td>
                                    {r.verified
                                        ? <CheckCircle size={18} className="text-green-500" />
                                        : <XCircle size={18} className="text-gray-300" />}
                                </td>
                                <td className="text-gray-500 font-bold text-[10px] uppercase tracking-widest">{new Date(r.created_at).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        onClick={() => deleteReview(r.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
