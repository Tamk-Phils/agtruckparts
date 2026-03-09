'use client'
import { useState, useEffect } from 'react'
import { useCart } from '@/components/CartProvider'
import { useAuth } from '@/components/AuthProvider'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function CheckoutPage() {
    const { items, total, clearCart } = useCart()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        notes: ''
    })

    // Pre-fill email if user is logged in
    useEffect(() => {
        if (user?.email) {
            setForm(prev => ({ ...prev, email: user.email || '' }))
        }
    }, [user])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const customerEmail = user?.email || form.email

            // 1. Create order
            const { data: orderData, error: orderError } = await supabase.from('orders').insert([{
                customer_name: `${form.first_name} ${form.last_name}`,
                customer_email: customerEmail,
                customer_phone: form.notes ? `${form.phone} (Notes: ${form.notes})` : form.phone,
                total_amount: total,
                reservation_fee: 0,
                payment_method: 'Pay at Pickup',
                status: 'pending_payment'
            }]).select().single()

            if (orderError) throw orderError

            // 2. Create order items
            const orderItems = items.map(item => ({
                order_id: orderData.id,
                product_id: item.id,
                quantity: item.quantity,
                price_at_time: item.price
            }))

            const { error: itemsError } = await supabase.from('order_items').insert(orderItems)
            if (itemsError) throw itemsError

            setSuccess(true)
            clearCart()
        } catch (error) {
            console.error("Error submitting order:", error)
            alert("There was an error submitting your reservation. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-gray-50 flex flex-col items-center justify-center px-6">
                <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center border border-gray-100">
                    <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
                    <h1 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tight">Reservation Confirmed</h1>
                    <p className="text-gray-600 mb-8 font-medium leading-relaxed">
                        Thank you for reserving your parts with AG Truck Beds. We have received your request and will hold the items for you. Please contact support for guidance on how to proceed
                    </p>
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 text-left">
                        <h3 className="font-bold text-gray-900 mb-2 uppercase tracking-tight">Next Steps:</h3>
                        <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                            <li>Contact us.</li>
                            <li>Call us at +1(903) 650-9882 to confirm pickup time.</li>
                            <li>Payment is collected in-person via Zelle, Chime, Apple Pay, CashApp,Wire Transfer, Bank Transfer.</li>
                        </ul>
                    </div>
                    <Link href="/shop" className="btn-primary w-full justify-center">
                        Back to Shop
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-gray-50 px-6 md:px-10">
            <div className="max-w-5xl mx-auto">
                <Link href="/shop" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors w-fit">
                    <ArrowLeft size={16} /> Back to Shop
                </Link>

                <div className="grid md:grid-cols-[1.5fr_1fr] gap-10">
                    {/* Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
                        <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">Your Details</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest">First Name *</label>
                                    <input required className="input-dark bg-gray-50 border-gray-200 text-gray-900 py-3 px-4 rounded-xl w-full" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest">Last Name *</label>
                                    <input required className="input-dark bg-gray-50 border-gray-200 text-gray-900 py-3 px-4 rounded-xl w-full" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest">Email Address *</label>
                                <input type="email" required className="input-dark bg-gray-50 border-gray-200 text-gray-900 py-3 px-4 rounded-xl w-full" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest">Phone Number *</label>
                                <input type="tel" required className="input-dark bg-gray-50 border-gray-200 text-gray-900 py-3 px-4 rounded-xl w-full" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest">Order Notes (Optional)</label>
                                <textarea rows={3} className="input-dark bg-gray-50 border-gray-200 text-gray-900 py-3 px-4 rounded-xl w-full resize-none" placeholder="Let us know when you plan to pick up..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
                            </div>

                            <button type="submit" disabled={loading || items.length === 0} className="btn-primary py-4 justify-center mt-4">
                                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Confirm Reservation'}
                            </button>
                            <p className="text-center text-xs text-gray-500 mt-2 font-medium">You will have to contact support through email, phone or through the chat to proceed with payment.</p>
                        </form>
                    </div>

                    {/* Summary */}
                    <div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 sticky top-28">
                            <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-tight">Order Summary</h2>

                            <div className="flex flex-col gap-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                        <div className="flex-1 pr-4">
                                            <p className="text-sm font-bold text-gray-900 line-clamp-2">{item.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-black">${(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                                {items.length === 0 && (
                                    <p className="text-sm text-gray-500">Your cart is empty.</p>
                                )}
                            </div>

                            <div className="border-t border-gray-200 pt-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-gray-600 font-bold">Subtotal</span>
                                    <span className="text-sm font-bold">${total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                                    <span className="text-sm text-gray-600 font-bold">Tax & Fees</span>
                                    <span className="text-sm font-bold text-gray-400">Calculated at pickup</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-base text-gray-900 font-black uppercase tracking-tight">Total Estimate</span>
                                    <span className="text-2xl font-black text-blue-600">${total.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-8 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3 text-blue-800">
                                <div className="mt-0.5"><CheckCircle size={16} className="text-blue-500" /></div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider mb-1">Payment Options</p>
                                    <p className="text-xs font-medium">We accept Cash, Zelle, Chime, and Apple Pay.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
