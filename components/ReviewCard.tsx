import { Star, MapPin, CheckCircle } from 'lucide-react'

type Review = {
    id: string
    author: string
    rating: number
    comment: string
    location: string
    verified: boolean
    avatar: string
    created_at: string
}

export default function ReviewCard({ review }: { review: Review }) {
    return (
        <div className="glass-card p-5 border border-gray-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 group bg-white">
            {/* Stars */}
            <div className="flex items-center gap-0.5 mb-3 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        fill={i < review.rating ? 'currentColor' : 'none'}
                        className={i < review.rating ? 'text-amber-400' : 'text-gray-700'}
                    />
                ))}
                <span className="ml-2 text-xs text-gray-500 font-medium">{review.rating}.0</span>
            </div>

            {/* Quote */}
            <p className="text-sm text-gray-700 leading-relaxed line-clamp-4 italic">
                &ldquo;{review.comment}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                        <img
                            src={review.avatar}
                            alt={review.author}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                            {review.author}
                            {review.verified && <CheckCircle size={12} className="text-blue-500" />}
                        </p>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1">
                            <MapPin size={9} className="text-gray-400" /> {review.location}
                        </p>
                    </div>
                </div>
                {review.verified && (
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-tighter">Verified Order</span>
                        <span className="text-[8px] text-gray-400 font-medium">via AG Direct</span>
                    </div>
                )}
            </div>
        </div>
    )
}
