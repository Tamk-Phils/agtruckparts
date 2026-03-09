'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CheckCircle, Clock, Search, XCircle, Eye } from 'lucide-react'

type OrderItem = {
    id: string
    order_id: string
    product_id: string
    quantity: number
    price_at_time: number
    product: {
        name: string
        category: string
    }
}

type Order = {
    id: string
    customer_name: string
    customer_email: string
    customer_phone: string
    total_amount: number
    status: 'pending' | 'reserved' | 'completed' | 'cancelled'
    notes: string
    created_at: string
    items?: OrderItem[]
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('orders')
            .select(`
                *,
                items:order_items(
                    *,
                    product:products(name, category)
                )
            `)
            .order('created_at', { ascending: false })

        if (data) setOrders(data as Order[])
        setLoading(false)
    }

    const updateStatus = async (id: string, status: Order['status']) => {
        const { error } = await supabase.from('orders').update({ status }).eq('id', id)
        if (!error) {
            setOrders(orders.map(o => o.id === id ? { ...o, status } : o))
            if (selectedOrder?.id === id) {
                setSelectedOrder({ ...selectedOrder, status })
            }
        }
    }

    const filtered = orders.filter(o =>
        o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customer_email.toLowerCase().includes(search.toLowerCase())
    )

    const StatusBadge = ({ status }: { status: Order['status'] }) => {
        if (status === 'pending') return <span className="badge badge-yellow"><Clock size={10} /> Pending</span>
        if (status === 'reserved') return <span className="badge badge-blue"><CheckCircle size={10} /> Reserved</span>
        if (status === 'completed') return <span className="badge badge-green"><CheckCircle size={10} /> Completed</span>
        return <span className="badge badge-red"><XCircle size={10} /> Cancelled</span>
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Reservations</h1>
                    <p className="text-sm text-gray-600 font-medium mt-1">{orders.length} total orders</p>
                </div>
                <div className="relative">
                    <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        className="input-dark pl-11 py-2 text-sm rounded-xl border-gray-200 bg-white shadow-sm w-full sm:w-64"
                        placeholder="Search orders..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm rounded-2xl overflow-x-auto">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && orders.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-10">Loading...</td></tr>
                        ) : filtered.map((o) => (
                            <tr key={o.id} className="border-b border-gray-50 last:border-none hover:bg-gray-50/50 transition-colors">
                                <td className="font-mono text-xs text-gray-500 uppercase">{o.id.substring(0, 8)}</td>
                                <td className="text-sm text-gray-600">{new Date(o.created_at).toLocaleDateString()}</td>
                                <td>
                                    <p className="font-bold text-gray-900 text-sm">{o.customer_name}</p>
                                    <p className="text-xs text-gray-500">{o.customer_phone}</p>
                                </td>
                                <td className="font-black text-gray-900">${o.total_amount.toLocaleString()}</td>
                                <td><StatusBadge status={o.status} /></td>
                                <td>
                                    <button onClick={() => setSelectedOrder(o)} className="btn-glass bg-white py-1.5 px-3 text-xs shadow-sm font-bold flex items-center gap-2">
                                        <Eye size={12} /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white border border-gray-200 shadow-2xl rounded-2xl w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-100">
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                    Order #{selectedOrder.id.substring(0, 8).toUpperCase()}
                                    <StatusBadge status={selectedOrder.status} />
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">{new Date(selectedOrder.created_at).toLocaleString()}</p>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-800 transition-colors p-1"><XCircle size={24} /></button>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-widest">Customer Details</h3>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-2 text-sm font-medium">
                                    <p><span className="text-gray-500 mr-2">Name:</span> {selectedOrder.customer_name}</p>
                                    <p><span className="text-gray-500 mr-2">Phone:</span> <a href={`tel:${selectedOrder.customer_phone?.split(' (Notes:')[0] || ''}`} className="text-blue-600">{selectedOrder.customer_phone?.split(' (Notes:')[0] || selectedOrder.customer_phone}</a></p>
                                    <p><span className="text-gray-500 mr-2">Email:</span> <a href={`mailto:${selectedOrder.customer_email}`} className="text-blue-600">{selectedOrder.customer_email}</a></p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-widest">Order Notes</h3>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col gap-2 text-sm font-medium h-[116px] overflow-auto">
                                    {selectedOrder.customer_phone?.includes('(Notes: ') ? <p>{selectedOrder.customer_phone.split('(Notes: ')[1].replace(')', '')}</p> : <p className="text-gray-400 italic">No notes provided.</p>}
                                </div>
                            </div>
                        </div>

                        <h3 className="text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-widest">Reserved Items</h3>
                        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-8">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="pb-2 font-bold text-gray-600">Product</th>
                                        <th className="pb-2 font-bold text-gray-600">Category</th>
                                        <th className="pb-2 font-bold text-gray-600 text-center">Qty</th>
                                        <th className="pb-2 font-bold text-gray-600 text-right">Price</th>
                                        <th className="pb-2 font-bold text-gray-600 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items?.map(item => (
                                        <tr key={item.id} className="border-b border-gray-200/50 last:border-0">
                                            <td className="py-3 font-semibold text-gray-900">{item.product?.name || 'Unknown Item'}</td>
                                            <td className="py-3 text-gray-500">{item.product?.category || 'N/A'}</td>
                                            <td className="py-3 text-center">{item.quantity}</td>
                                            <td className="py-3 text-right">${item.price_at_time.toLocaleString()}</td>
                                            <td className="py-3 text-right font-bold">${(item.price_at_time * item.quantity).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t border-gray-200">
                                        <td colSpan={4} className="py-3 text-right font-bold text-gray-600 uppercase tracking-wide text-xs">Total Estimate</td>
                                        <td className="py-3 text-right font-black text-lg text-gray-900">${selectedOrder.total_amount.toLocaleString()}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        <div className="flex gap-3 pt-6 border-t border-gray-100">
                            <span className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest mt-3 mr-4">Update Status:</span>
                            {selectedOrder.status === 'pending' && (
                                <button onClick={() => updateStatus(selectedOrder.id, 'reserved')} className="btn-primary shadow-sm flex-1 justify-center py-2 text-sm">
                                    Approve & Reserve
                                </button>
                            )}
                            {selectedOrder.status === 'reserved' && (
                                <button onClick={() => updateStatus(selectedOrder.id, 'completed')} className="btn-primary bg-green-600 hover:bg-green-700 shadow-sm flex-1 justify-center py-2 text-sm">
                                    Mark as Paid
                                </button>
                            )}
                            {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'completed' && (
                                <button onClick={() => {
                                    if (confirm('Cancel this reservation?')) updateStatus(selectedOrder.id, 'cancelled')
                                }} className="btn-glass bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-200 text-red-600 shadow-sm flex-1 justify-center py-2 text-sm font-bold">
                                    Cancel Reservation
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
