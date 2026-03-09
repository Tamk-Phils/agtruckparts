'use client'
import { useState, useEffect } from 'react'
import { CATEGORIES } from '@/lib/data'
import { supabase, Product } from '@/lib/supabase'
import { Plus, Pencil, Trash2, CheckCircle, XCircle, X, Save, Upload, Loader2 } from 'lucide-react'
import Image from 'next/image'

const EMPTY: Partial<Product> = {
    name: '', description: '', price: 0, category: 'Truck Beds', condition: 'Used – Good',
    year: '', make: 'Toyota', model: 'Hilux', images: [], in_stock: true, featured: false,
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState<Partial<Product> | null>(null)
    const [isNew, setIsNew] = useState(false)
    const [uploading, setUploading] = useState(false)

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        setLoading(true)
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
        if (data) setProducts(data)
        setLoading(false)
    }

    const openNew = () => { setEditing({ ...EMPTY }); setIsNew(true) }
    const openEdit = (p: Product) => { setEditing({ ...p }); setIsNew(false) }
    const close = () => { setEditing(null); setIsNew(false) }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !editing) return
        setUploading(true)

        const newImages = [...(editing.images || [])]

        for (const file of Array.from(e.target.files)) {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage.from('product-images').upload(filePath, file)
            if (uploadError) {
                console.error("Upload Error:", uploadError)
                continue
            }
            const { data } = supabase.storage.from('product-images').getPublicUrl(filePath)
            newImages.push(data.publicUrl)
        }

        setEditing({ ...editing, images: newImages })
        setUploading(false)
    }

    const removeImage = (index: number) => {
        if (!editing) return
        const newImages = [...(editing.images || [])]
        newImages.splice(index, 1)
        setEditing({ ...editing, images: newImages })
    }

    const save = async () => {
        if (!editing) return

        if (!editing.name || typeof editing.price !== 'number') {
            alert("Name and Price are required.")
            return
        }

        try {
            if (isNew) {
                // Scrub id and created_at, ensure images is an array
                const insertData = {
                    name: editing.name,
                    description: editing.description || '',
                    price: editing.price || 0,
                    category: editing.category || 'Truck Beds',
                    condition: editing.condition || 'Used – Good',
                    year: editing.year || '',
                    make: editing.make || '',
                    model: editing.model || '',
                    in_stock: editing.in_stock ?? true,
                    featured: editing.featured ?? false,
                    images: editing.images || []
                }
                const { error, data } = await supabase.from('products').insert([insertData]).select()
                if (error) {
                    console.error("Supabase Insert Error:", error)
                    throw error
                }
            } else {
                const { error } = await supabase.from('products').update(editing).eq('id', editing.id)
                if (error) throw error
            }
            await fetchProducts()
            close()
        } catch (error: any) {
            console.error("Error saving product:", error)
            alert("Failed to save product: " + (error?.message || JSON.stringify(error)))
        }
    }

    const remove = async (id: string) => {
        if (confirm('Delete this product?')) {
            const { error } = await supabase.from('products').delete().eq('id', id)
            if (!error) {
                setProducts(products.filter((p) => p.id !== id))
            } else {
                alert("Failed to delete product.")
            }
        }
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Products</h1>
                    <p className="text-sm text-gray-600 font-medium mt-1">{products.length} total products</p>
                </div>
                <button onClick={openNew} className="btn-primary text-sm shadow-md px-6 py-2.5">
                    <Plus size={16} className="mr-2" /> Add Product
                </button>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-x-auto">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Condition</th>
                            <th>Stock</th>
                            <th>Featured</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && products.length === 0 ? (
                            <tr><td colSpan={8} className="text-center py-10"><Loader2 className="animate-spin mx-auto text-blue-500" /></td></tr>
                        ) : products.map((p) => (
                            <tr key={p.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
                                <td>
                                    {p.images && p.images.length > 0 ? (
                                        <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-100 border border-gray-200">
                                            <Image src={p.images[0]} fill alt={p.name} className="object-cover" sizes="48px" />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center leading-tight">No<br />Img</div>
                                    )}
                                </td>
                                <td>
                                    <div>
                                        <p className="text-gray-900 font-bold text-sm truncate max-w-[180px]">{p.name}</p>
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{p.year} {p.make} {p.model}</p>
                                    </div>
                                </td>
                                <td><span className="badge text-xs bg-gray-100 text-gray-600 border-gray-200">{p.category}</span></td>
                                <td className="text-gray-900 font-black">${p.price.toLocaleString()}</td>
                                <td className="text-gray-600 font-semibold text-xs">{p.condition}</td>
                                <td>
                                    {p.in_stock
                                        ? <CheckCircle size={18} className="text-green-500" />
                                        : <XCircle size={18} className="text-red-500" />}
                                </td>
                                <td>
                                    {p.featured
                                        ? <CheckCircle size={18} className="text-amber-500" />
                                        : <XCircle size={18} className="text-gray-300" />}
                                </td>
                                <td>
                                    <div className="flex gap-3">
                                        <button onClick={() => openEdit(p)} className="text-gray-400 hover:text-blue-600 transition-colors p-1">
                                            <Pencil size={16} />
                                        </button>
                                        <button onClick={() => remove(p.id)} className="text-gray-400 hover:text-red-600 transition-colors p-1">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editing && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">{isNew ? 'Add Product' : 'Edit Product'}</h2>
                            <button onClick={close} className="text-gray-400 hover:text-gray-800 transition-colors p-1"><X size={20} /></button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-5">
                                {[
                                    { label: 'Name', key: 'name', type: 'text' },
                                    { label: 'Price ($)', key: 'price', type: 'number' },
                                    { label: 'Year', key: 'year', type: 'text' },
                                    { label: 'Make', key: 'make', type: 'text' },
                                    { label: 'Model', key: 'model', type: 'text' },
                                ].map(({ label, key, type }) => (
                                    <div key={key}>
                                        <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest">{label}</label>
                                        <input
                                            type={type}
                                            className="input-dark bg-gray-50 border-gray-200 text-gray-900 py-3 px-4 rounded-xl shadow-sm focus:bg-white w-full"
                                            value={(editing as Record<string, unknown>)[key] as string || ''}
                                            onChange={(e) => setEditing({ ...editing, [key]: type === 'number' ? Number(e.target.value) : e.target.value })}
                                        />
                                    </div>
                                ))}
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest">Category</label>
                                        <select className="input-dark bg-gray-50 border-gray-200 text-gray-900 py-3 px-4 rounded-xl shadow-sm focus:bg-white w-full font-medium" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
                                            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest">Condition</label>
                                        <select className="input-dark bg-gray-50 border-gray-200 text-gray-900 py-3 px-4 rounded-xl shadow-sm focus:bg-white w-full font-medium" value={editing.condition} onChange={(e) => setEditing({ ...editing, condition: e.target.value })}>
                                            {['Used – Excellent', 'Used – Good', 'Used – Fair'].map((c) => <option key={c}>{c}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-6 mt-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={editing.in_stock} onChange={(e) => setEditing({ ...editing, in_stock: e.target.checked })} className="accent-blue-600 w-4 h-4" />
                                        <span className="text-sm font-bold text-gray-700">In Stock</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="accent-blue-600 w-4 h-4" />
                                        <span className="text-sm font-bold text-gray-700">Featured</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col gap-5">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest">Description</label>
                                    <textarea
                                        className="input-dark bg-gray-50 border-gray-200 text-gray-900 py-3 px-4 rounded-xl shadow-sm focus:bg-white w-full resize-none text-sm leading-relaxed"
                                        rows={6}
                                        value={editing.description || ''}
                                        onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                                    />
                                </div>

                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <label className="text-[10px] font-bold text-gray-500 mb-3 block uppercase tracking-widest">Product Images</label>
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        {editing.images && editing.images.map((img, i) => (
                                            <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-gray-300">
                                                <Image src={img} fill alt="Upload" className="object-cover" sizes="120px" />
                                                <button
                                                    onClick={() => removeImage(i)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md">
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        {(!editing.images || editing.images.length === 0) && (
                                            <div className="col-span-3 text-xs text-gray-400 py-6 text-center border-2 border-dashed border-gray-200 rounded-lg">
                                                No images uploaded
                                            </div>
                                        )}
                                    </div>
                                    <label className="cursor-pointer btn-glass bg-white py-2.5 px-4 shadow-sm w-full flex justify-center text-sm">
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                                        {uploading ? <><Loader2 size={16} className="animate-spin mr-2" /> Uploading...</> : <><Upload size={16} className="mr-2" /> Upload Photos</>}
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                            <button onClick={save} className="btn-primary flex-1 justify-center py-3.5 shadow-md" disabled={uploading}>
                                <Save size={16} className="mr-2" /> {isNew ? 'Create Product' : 'Save Changes'}
                            </button>
                            <button onClick={close} className="btn-glass bg-white text-gray-800 border-gray-300 hover:bg-gray-50 flex-1 justify-center py-3.5 font-bold shadow-sm">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
