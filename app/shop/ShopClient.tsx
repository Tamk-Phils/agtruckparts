'use client'
import { useState, useMemo, useEffect } from 'react'
import { Search, SlidersHorizontal, X, Loader2, Package, CheckCircle2 } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { CATEGORIES } from '@/lib/data'
import { supabase, Product } from '@/lib/supabase'
import Image from 'next/image'

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [inStockOnly, setInStockOnly] = useState(false)
    const [sort, setSort] = useState('featured')

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
            if (data) setProducts(data)
            setLoading(false)
        }
        fetchProducts()
    }, [])

    const filtered = useMemo(() => {
        let list = [...products]
        if (category !== 'All') list = list.filter((p) => p.category === category)
        if (inStockOnly) list = list.filter((p) => p.in_stock)
        if (search) {
            const q = search.toLowerCase()
            list = list.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    (p.description && p.description.toLowerCase().includes(q)) ||
                    (p.make && p.make.toLowerCase().includes(q)) ||
                    (p.model && p.model.toLowerCase().includes(q))
            )
        }
        if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
        else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
        else if (sort === 'newest') list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        else list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
        return list
    }, [search, category, inStockOnly, sort, products])

    return (
        <div className="min-h-screen pt-24 pb-20 bg-[#f8f9fa]">
            {/* Professional Header */}
            <div className="relative h-[450px] w-full flex items-center overflow-hidden">
                <Image
                    src="/images/hilux-bed-clean.png"
                    fill
                    alt="Professional Hilux Bed"
                    className="object-cover object-center scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/40 to-transparent z-10" />

                <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-10 w-full">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/20 border border-blue-500/30 backdrop-blur-md mb-6">
                        <CheckCircle2 size={12} className="text-blue-400" />
                        <span className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em]">Authentic Parts Inventory</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                        PREMIUM <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">TRUCK BEDS</span>
                    </h1>
                    <p className="text-gray-300 mt-6 text-sm md:text-base font-medium max-w-xl leading-relaxed">
                        Discover our curated selection of Toyota Hilux beds and genuine body parts.
                        Engineered for durability, sourced with precision, and ready for your next build.
                    </p>

                    <div className="flex items-center gap-6 mt-10">
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-white">{products.length}</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Global Stock</span>
                        </div>
                        <div className="w-px h-10 bg-gray-700" />
                        <div className="flex flex-col">
                            <span className="text-3xl font-black text-white">4.9/5</span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Customer Rating</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-10 -mt-10 relative z-30">
                {/* Search & Stats Bar */}
                <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-200 flex flex-col md:flex-row gap-4 items-center mb-12">
                    {/* Search */}
                    <div className="relative flex-1 w-full">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            className="w-full pl-12 pr-4 py-4 text-sm font-semibold rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none"
                            placeholder="Search by part name, make, or model..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        {search && (
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-800" onClick={() => setSearch('')}>
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto px-2">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Found</span>
                            <span className="text-sm font-black text-gray-900">{filtered.length} Items</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <Package size={20} className="text-blue-600" />
                        </div>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <div className="lg:w-64 flex-shrink-0 space-y-8">
                        <div>
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-4">Categories</h3>
                            <div className="flex flex-col gap-1.5">
                                {['All', ...CATEGORIES].map((cat) => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all ${category === cat ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}
                                    >
                                        {cat}
                                        {category === cat && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-200">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] mb-4">Refine</h3>
                            <div className="space-y-4">
                                <label className="flex items-center justify-between cursor-pointer group">
                                    <span className="text-xs font-bold text-gray-700">In Stock Only</span>
                                    <div
                                        className={`w-10 h-6 rounded-full transition-all flex items-center px-1 shadow-inner ${inStockOnly ? 'bg-blue-600' : 'bg-gray-200'}`}
                                        onClick={() => setInStockOnly(!inStockOnly)}
                                    >
                                        <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${inStockOnly ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </div>
                                </label>

                                <div className="space-y-2">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort By</span>
                                    <select
                                        className="w-full py-2.5 px-3 text-xs font-bold rounded-lg bg-white border border-gray-200 shadow-sm outline-none focus:border-blue-500"
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                    >
                                        <option value="featured">Featured First</option>
                                        <option value="price-asc">Price: Low to High</option>
                                        <option value="price-desc">Price: High to Low</option>
                                        <option value="newest">Latest Arrivals</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="flex-1">
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-32 bg-white border border-gray-200 rounded-3xl shadow-sm">
                                <Loader2 size={40} className="animate-spin text-blue-500 mb-4" />
                                <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Accessing Inventory...</p>
                            </div>
                        ) : filtered.length > 0 ? (
                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filtered.map((p) => (
                                    <ProductCard key={p.id} product={p as any} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white border border-gray-200 rounded-3xl shadow-sm px-10">
                                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Search size={32} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Zero Results</h3>
                                <p className="text-gray-500 font-medium mb-8 max-w-sm mx-auto">We couldn't find any parts matching your current filters. Try adjusting your search criteria.</p>
                                <button
                                    className="btn-primary text-[10px] px-8 py-3 shadow-lg shadow-blue-100"
                                    onClick={() => { setSearch(''); setCategory('All'); setInStockOnly(false); setSort('featured'); }}
                                >
                                    Reset Discovery
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

