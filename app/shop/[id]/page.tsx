import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Phone, MessageCircle, ArrowLeft, Tag, CheckCircle, XCircle, Calendar, Wrench, Car } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import AddToCartButton from '@/components/AddToCartButton'

export const revalidate = 60

export async function generateStaticParams() {
    const { data } = await supabase.from('products').select('id')
    return data ? data.map((p) => ({ id: p.id })) : []
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    // Fetch product
    const { data: product } = await supabase.from('products').select('*').eq('id', id).single()
    if (!product) notFound()

    // Fetch related
    const { data: relatedProducts } = await supabase
        .from('products')
        .select('*')
        .eq('category', product.category)
        .neq('id', id)
        .limit(3)

    const related = relatedProducts || []

    return (
        <div className="min-h-screen pt-28 pb-20 max-w-7xl mx-auto px-6 md:px-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-8">
                <Link href="/" className="hover:text-gray-400 transition">Home</Link>
                <span>/</span>
                <Link href="/shop" className="hover:text-gray-400 transition">Shop</Link>
                <span>/</span>
                <span className="text-gray-400">{product.name}</span>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
                {/* Images */}
                <div className="flex flex-col gap-4">
                    <div className="relative h-80 md:h-[420px] rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-md">
                        <Image
                            src={(product.images && product.images[0]) ? product.images[0] : '/images/placeholder.jpg'}
                            alt={product.name}
                            fill
                            className="object-contain"
                        />
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                            {product.featured && (
                                <span className="badge bg-gray-900 text-white border-gray-700 shadow-sm">⭐ Featured</span>
                            )}
                        </div>
                    </div>
                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-3">
                            {product.images.map((img: string, i: number) => (
                                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:border-blue-400 cursor-pointer transition-colors">
                                    <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info */}
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <Tag size={13} className="text-gray-500" />
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest">{product.category}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight uppercase">
                        {product.name}
                    </h1>

                    {/* Meta badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`badge ${product.condition.includes('Excellent') ? 'badge-green' : product.condition.includes('Good') ? 'badge-yellow' : 'badge-red'}`}>
                            {product.condition}
                        </span>
                        {product.in_stock ? (
                            <span className="badge badge-green"><CheckCircle size={10} /> In Stock</span>
                        ) : (
                            <span className="badge badge-red"><XCircle size={10} /> Out of Stock</span>
                        )}
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {product.year && (
                            <div className="glass-card bg-gray-50 p-4 flex items-center gap-3 border border-gray-200 rounded-xl">
                                <Calendar size={16} className="text-gray-500" />
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Year</p>
                                    <p className="text-sm text-gray-900 font-black">{product.year}</p>
                                </div>
                            </div>
                        )}
                        {product.make && (
                            <div className="glass-card bg-gray-50 p-4 flex items-center gap-3 border border-gray-200 rounded-xl">
                                <Car size={16} className="text-gray-500" />
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Make</p>
                                    <p className="text-sm text-gray-900 font-black">{product.make}</p>
                                </div>
                            </div>
                        )}
                        {product.model && (
                            <div className="glass-card bg-gray-50 p-4 flex items-center gap-3 border border-gray-200 rounded-xl">
                                <Wrench size={16} className="text-gray-500" />
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Model</p>
                                    <p className="text-sm text-gray-900 font-black">{product.model}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="text-gray-600 text-base font-medium leading-relaxed mb-8">{product.description}</p>

                    <div className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-200 text-center">
                        <span className="text-5xl font-black text-gray-900">${product.price.toLocaleString()}</span>
                        <span className="text-gray-500 ml-2 text-sm font-bold uppercase tracking-wider block mt-2">USD</span>
                    </div>

                    <div className="flex flex-col gap-4 mb-4">
                        <AddToCartButton product={product as any} className="w-full py-4 text-sm shadow-md" />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">
                        <a
                            href={`tel:+19036509882`}
                            className="btn-glass bg-white text-gray-800 border-gray-300 hover:bg-gray-50 py-4 text-sm justify-center flex-1 shadow-sm font-bold"
                        >
                            <Phone size={16} className="mr-2" /> Call to Inquire
                        </a>
                        <a
                            href="mailto:agtruckbedsandparts@gmail.com"
                            className="btn-glass bg-white text-gray-800 border-gray-300 hover:bg-gray-50 py-4 text-sm justify-center flex-1 shadow-sm font-bold"
                        >
                            <MessageCircle size={16} className="mr-2" /> Email Us
                        </a>
                    </div>

                    <p className="text-xs text-gray-600 mt-4 text-center">
                        No payment is collected on this website. All transactions happen in person.
                    </p>
                </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
                <div className="mt-24 pt-16 border-t border-gray-200">
                    <h2 className="text-4xl font-black text-gray-900 mb-8 uppercase tracking-tight text-center">
                        RELATED <span className="text-blue-600">PARTS</span>
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {related.map((p) => {
                            const ProductCard = require('@/components/ProductCard').default
                            return <ProductCard key={p.id} product={p as any} />
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
