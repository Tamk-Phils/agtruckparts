'use client'
import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.from('inquiries').insert([form])

        if (error) {
            console.error('Error submitting inquiry:', error)
            alert('Failed to send inquiry. Please try again.')
        } else {
            setSent(true)
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen pt-24 pb-20 bg-gray-50">
            {/* Header */}
            <div className="relative py-24 overflow-hidden bg-white border-b border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white -z-10" />
                <div className="relative max-w-7xl mx-auto px-6 md:px-10">
                    <div className="section-tag bg-gray-100 border border-gray-200 text-gray-700">Get In Touch</div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 mt-4 uppercase tracking-tight">
                        CONTACT <span className="text-blue-600">US</span>
                    </h1>
                    <p className="text-gray-600 mt-6 text-lg font-medium max-w-xl leading-relaxed">
                        Ready to find your parts? Reach out by phone, email, or fill out the inquiry form below.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-10 mt-16 grid md:grid-cols-2 gap-16">
                {/* Info */}
                <div className="flex flex-col gap-6">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Reach Us Directly</h2>
                    {[
                        { Icon: Phone, label: 'Phone', value: '+1(903) 650-9882', href: 'tel:+19036509882' },
                        { Icon: Mail, label: 'Email', value: 'agtruckbedsandparts@gmail.com', href: 'mailto:agtruckbedsandparts@gmail.com' },
                        { Icon: MapPin, label: 'Address', value: '630 Bridget Ave, Buffalo, TX 75831', href: 'https://www.google.com/maps/search/630+Bridget+Ave,+Buffalo,+TX+75831' },
                    ].map(({ Icon, label, value, href }) => (
                        <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 flex items-center gap-5 hover:shadow-md hover:border-blue-300 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                                <Icon size={20} className="text-gray-500 group-hover:text-blue-600" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{label}</p>
                                <p className="text-base text-gray-900 font-bold group-hover:text-blue-600 transition-colors break-all">{value}</p>
                            </div>
                        </a>
                    ))}

                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-8 mt-2">
                        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                            <Clock size={20} className="text-gray-400" />
                            <h3 className="text-lg font-black text-gray-900 tracking-tight">Business Hours</h3>
                        </div>
                        <div className="flex flex-col gap-4">
                            {[
                                { days: 'Monday – Friday', hours: '8:00 AM – 6:00 PM' },
                                { days: 'Saturday', hours: '9:00 AM – 4:00 PM' },
                                { days: 'Sunday', hours: 'By Appointment Only' },
                            ].map(({ days, hours }) => (
                                <div key={days} className="flex flex-col sm:flex-row sm:justify-between text-base">
                                    <span className="text-gray-500 font-medium mb-1 sm:mb-0">{days}</span>
                                    <span className="text-gray-900 font-bold">{hours}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div>
                    {sent ? (
                        <div className="bg-white border border-gray-200 shadow-xl rounded-2xl p-12 h-full flex flex-col items-center justify-center text-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-green-50 border border-green-200 flex items-center justify-center shadow-inner">
                                <CheckCircle size={36} className="text-green-500" />
                            </div>
                            <h3 className="text-3xl font-black text-gray-900 tracking-tight">Message Sent!</h3>
                            <p className="text-gray-600 text-base font-medium max-w-sm leading-relaxed">
                                Thanks for reaching out! We&apos;ll get back to you within 1 business day. You can also call us directly at <span className="font-bold text-gray-900">+1(903) 650-9882</span>.
                            </p>
                            <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }} className="btn-primary mt-4 shadow-md px-8 py-3.5">
                                Send Another Message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 shadow-xl rounded-2xl p-8 flex flex-col gap-6">
                            <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase mb-2">Send an Inquiry</h2>
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest">Name *</label>
                                    <input className="input-dark bg-gray-50 border-gray-200 text-gray-900 py-3 px-4 rounded-xl shadow-sm focus:bg-white w-full" required placeholder="John Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest">Phone</label>
                                    <input className="input-dark bg-gray-50 border-gray-200 text-gray-900 py-3 px-4 rounded-xl shadow-sm focus:bg-white w-full" placeholder="+1 (___) ___-____" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest">Email *</label>
                                <input className="input-dark bg-gray-50 border-gray-200 text-gray-900 py-3 px-4 rounded-xl shadow-sm focus:bg-white w-full" type="email" required placeholder="you@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest">Subject *</label>
                                <select className="input-dark bg-gray-50 border-gray-200 text-gray-900 py-3 px-4 rounded-xl shadow-sm focus:bg-white w-full font-medium" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                                    <option value="">Select a subject...</option>
                                    <option>Part Inquiry</option>
                                    <option>Truck Bed Availability</option>
                                    <option>Pricing Question</option>
                                    <option>Pickup / Delivery</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest">Message *</label>
                                <textarea
                                    className="input-dark bg-gray-50 border-gray-200 text-gray-900 py-4 px-4 rounded-xl shadow-sm focus:bg-white w-full resize-none font-medium text-sm leading-relaxed"
                                    rows={5}
                                    required
                                    placeholder="Tell us what part you're looking for, year/make/model, condition preference..."
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                />
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary py-4 mt-2 justify-center shadow-md">
                                {loading ? (
                                    <span className="flex items-center gap-3">
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </span>
                                ) : (
                                    <><Send size={18} className="mr-2" /> Send Inquiry</>
                                )}
                            </button>
                            <p className="text-sm font-medium text-gray-500 text-center mt-2">We typically respond within a few hours during business hours.</p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
