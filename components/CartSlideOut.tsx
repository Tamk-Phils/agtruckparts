'use client'
import { X, Trash2, ArrowRight } from 'lucide-react'
import { useCart } from './CartProvider'
import Image from 'next/image'
import Link from 'next/link'

export default function CartSlideOut({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { items, removeFromCart, updateQuantity, total } = useCart()

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-slide-in-right">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">Reservation</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
                    {items.length === 0 ? (
                        <div className="text-center flex flex-col justify-center h-full py-20 text-gray-400">
                            <p className="text-5xl mb-6">🛒</p>
                            <p className="font-bold text-gray-600">Your reservation list is empty</p>
                            <p className="text-sm mt-2">Add items from the store to reserve them for pickup.</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50 relative group">
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0">
                                    <Image src={(item.images && item.images[0]) ? item.images[0] : '/images/placeholder.jpg'} alt={item.name} fill className="object-cover" sizes="96px" />
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight">{item.name}</h3>
                                        <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-wider">{item.category}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <p className="text-sm font-black text-blue-600">${item.price.toLocaleString()}</p>
                                        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-2 shadow-sm h-8">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-500 hover:text-black w-6 h-full flex items-center justify-center font-bold text-lg leading-none">-</button>
                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-500 hover:text-black w-6 h-full flex items-center justify-center font-bold text-lg leading-none">+</button>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="absolute -top-2 -right-2 bg-white border border-gray-200 text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Total Estimate</span>
                            <span className="text-3xl font-black text-gray-900">${total.toLocaleString()}</span>
                        </div>
                        <Link href="/checkout" onClick={onClose} className="btn-primary w-full py-4 justify-center shadow-lg text-sm">
                            Proceed to Checkout <ArrowRight size={16} className="ml-2" />
                        </Link>
                        <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-wider font-bold">
                            No payment required online. Pay at pickup.
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
