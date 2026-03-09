'use client'
import { useState, useEffect } from 'react'
import { MessageSquare, Phone, Mail, CheckCircle, Clock, AlertCircle, Eye } from 'lucide-react'
import { adminSupabase  } from '@/lib/supabase'

type Inquiry = {
    id: string
    name: string
    email: string
    phone: string
    subject: string
    message: string
    status: 'new' | 'read' | 'replied'
    created_at: string
}

const STATUS_CONFIG = {
    new: { label: 'New', Icon: AlertCircle, style: 'badge-red' },
    read: { label: 'Read', Icon: Clock, style: 'badge-yellow' },
    replied: { label: 'Replied', Icon: CheckCircle, style: 'badge-green' },
}

export default function AdminInquiriesPage() {
    const [inquiries, setInquiries] = useState<Inquiry[]>([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState<Inquiry | null>(null)

    useEffect(() => {
        fetchInquiries()
    }, [])

    const fetchInquiries = async () => {
        setLoading(true)
        const { data } = await adminSupabase.from('inquiries').select('*').order('created_at', { ascending: false })
        if (data) setInquiries(data as Inquiry[])
        setLoading(false)
    }

    const updateStatus = async (id: string, status: Inquiry['status']) => {
        const { error } = await adminSupabase.from('inquiries').update({ status }).eq('id', id)
        if (!error) {
            setInquiries(inquiries.map((i) => (i.id === id ? { ...i, status } : i)))
            if (selected?.id === id) setSelected((s) => s ? { ...s, status } : null)
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">INQUIRIES</h1>
                    <p className="text-sm text-gray-600 font-medium mt-1">{inquiries.filter((i) => i.status === 'new').length} new · {inquiries.length} total</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
                {/* List */}
                <div className="lg:col-span-2 flex flex-col gap-3">
                    {inquiries.map((inq) => {
                        const { label, Icon, style } = STATUS_CONFIG[inq.status]
                        return (
                            <button
                                key={inq.id}
                                onClick={() => { setSelected(inq); updateStatus(inq.id, inq.status === 'new' ? 'read' : inq.status) }}
                                className={`bg-white border rounded-xl p-5 text-left hover:shadow-md transition-all ${selected?.id === inq.id ? 'border-blue-400 ring-4 ring-blue-50 shadow-md' : 'border-gray-200 shadow-sm'}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-base font-bold text-gray-900">{inq.name}</p>
                                    <span className={`badge ${style} text-[10px] font-bold`}><Icon size={10} /> {label}</span>
                                </div>
                                <p className="text-sm font-semibold text-gray-700 mb-1.5">{inq.subject}</p>
                                <p className="text-xs font-medium text-gray-500 line-clamp-1">{inq.message}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">{new Date(inq.created_at).toLocaleDateString()}</p>
                            </button>
                        )
                    })}
                </div>

                {/* Detail */}
                <div className="lg:col-span-3">
                    {selected ? (
                        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-8 sticky top-8">
                            <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-100">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 mb-1 tracking-tight">{selected.name}</h2>
                                    <p className="text-sm font-bold text-gray-600 uppercase tracking-wider">{selected.subject}</p>
                                </div>
                                <span className={`badge ${STATUS_CONFIG[selected.status].style} text-xs py-1.5 px-3`}>
                                    {selected.status.charAt(0).toUpperCase() + selected.status.slice(1)}
                                </span>
                            </div>

                            {/* Contact */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <a href={`mailto:${selected.email}`} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                                    <Mail size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    <span className="text-sm font-bold text-gray-700 truncate">{selected.email}</span>
                                </a>
                                {selected.phone && (
                                    <a href={`tel:${selected.phone}`} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                                        <Phone size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
                                        <span className="text-sm font-bold text-gray-700">{selected.phone}</span>
                                    </a>
                                )}
                            </div>

                            {/* Message */}
                            <div className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2"><MessageSquare size={12} /> Message</p>
                                <p className="text-base font-medium text-gray-800 leading-relaxed">{selected.message}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} className="btn-primary flex-1 justify-center py-3.5 shadow-md" onClick={() => updateStatus(selected.id, 'replied')}>
                                    <Mail size={16} className="mr-2" /> Reply via Email
                                </a>
                                {selected.phone && (
                                    <a href={`tel:${selected.phone}`} className="btn-glass bg-white text-gray-800 border-gray-300 hover:bg-gray-50 font-bold flex-1 justify-center py-3.5 shadow-sm">
                                        <Phone size={16} className="mr-2" /> Call
                                    </a>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-100">
                                {(['new', 'read', 'replied'] as const).map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => updateStatus(selected.id, s)}
                                        className={`btn-glass font-bold text-xs py-2 px-5 shadow-sm ${selected.status === s ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                                    >
                                        Mark {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 shadow-sm rounded-2xl p-16 flex flex-col items-center justify-center text-center gap-4">
                            <Eye size={40} className="text-gray-300" />
                            <p className="text-gray-500 font-bold text-base">Select an inquiry to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
