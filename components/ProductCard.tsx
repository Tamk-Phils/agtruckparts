import Link from 'next/link'
import Image from 'next/image'
import { Tag, CheckCircle, XCircle, Star } from 'lucide-react'
import AddToCartButton from './AddToCartButton'

type Product = {
    id: string
    name: string
    description: string
    price: number
    category: string
    condition: string
    year?: string
    make?: string
    model?: string
    images: string[]
    in_stock: boolean
    featured?: boolean
}

export default function ProductCard({ product }: { product: Product }) {
    const conditionColor =
        product.condition.includes('Excellent')
            ? 'badge-green'
            : product.condition.includes('Good')
                ? 'badge-yellow'
                : 'badge-red'

    return (
        <Link
            href={`/shop/${product.id}`}
            className="glass-card group flex flex-col hover:border-gray-300 hover:shadow-lg hover:shadow-gray-200 transition-all duration-300 cursor-pointer"
        >
            {/* Image */}
            <div className="product-img-wrap h-48 bg-gray-100 relative">
                <Image
                    src={product.images[0] || '/images/placeholder.jpg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {product.featured && (
                        <span className="badge bg-gray-900 text-white border-gray-700 text-[10px]">
                            <Star size={8} /> Featured
                        </span>
                    )}
                    <span className={`badge ${conditionColor} text-[10px]`}>{product.condition}</span>
                </div>
                {/* Stock */}
                <div className="absolute top-3 right-3">
                    {product.in_stock ? (
                        <span className="flex items-center gap-1 bg-green-500/20 border border-green-500/30 rounded-full px-2 py-0.5 text-[10px] text-green-400 font-medium">
                            <CheckCircle size={9} /> In Stock
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 bg-red-500/20 border border-red-500/30 rounded-full px-2 py-0.5 text-[10px] text-red-300 font-medium">
                            <XCircle size={9} /> Out of Stock
                        </span>
                    )}
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="btn-glass px-4 py-2 text-xs">View Details</span>
                </div>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1 gap-2">
                <div className="flex items-center gap-1.5">
                    <Tag size={11} className="text-gray-500" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{product.category}</span>
                </div>
                <h3 className="font-bold text-gray-900 text-sm leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                    {product.name}
                </h3>
                {(product.year || product.make || product.model) && (
                    <p className="text-xs text-gray-500">{[product.year, product.make, product.model].filter(Boolean).join(' · ')}</p>
                )}
                <p className="text-xs text-gray-600 line-clamp-2 flex-1">{product.description}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div>
                        <span className="text-xl font-black text-gray-900">${product.price.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 ml-1 font-semibold">USD</span>
                    </div>
                    <AddToCartButton product={product as any} className="px-3 py-2 text-xs" />
                </div>
            </div>
        </Link>
    )
}
