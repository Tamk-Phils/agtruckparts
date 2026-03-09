import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Shield, Truck, Users, Award, Phone, MapPin } from 'lucide-react'

export const metadata: Metadata = {
    title: 'About Us | AG Truck Beds and Parts – Buffalo, TX',
    description: 'Learn about AG Truck Beds and Parts, your trusted truck parts yard in Buffalo, TX. Specializing in Toyota Hilux beds, doors, and body panels.',
}

export default function AboutPage() {
    return (
        <div className="min-h-screen pt-24 pb-20 bg-gray-50">
            {/* Hero */}
            <div className="relative py-24 overflow-hidden bg-white border-b border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white -z-10" />
                <div className="relative max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="section-tag bg-gray-100 border border-gray-200 text-gray-700">About AG Truck Beds</div>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 mt-4 mb-6 uppercase tracking-tight">
                            QUALITY PARTS,<br /><span className="text-blue-600">HONEST DEALS</span>
                        </h1>
                        <p className="text-gray-600 leading-relaxed text-lg font-medium mb-6">
                            AG Truck Beds and Parts has been serving East Texas for over a decade. Founded by truck enthusiasts who understand the value of quality, we specialize in Toyota Hilux beds, Silverado beds, truck doors, tailgates, and all major body panels — at prices that make sense.
                        </p>
                        <p className="text-gray-500 leading-relaxed text-base font-medium mb-10">
                            Located in Buffalo, TX, we&apos;re accessible to customers across Leon County and the greater East Texas region. We grade every part honestly, and we only sell what we&apos;d be proud to put on our own trucks.
                        </p>
                        <div className="flex gap-4">
                            <a href="tel:+19036509882" className="btn-primary text-sm px-8 shadow-md">
                                <Phone size={15} className="mr-2" /> Call Us
                            </a>
                            <Link href="/shop" className="btn-glass bg-white text-gray-800 border-gray-300 font-bold hover:bg-gray-50 text-sm px-8 shadow-sm">
                                Browse Parts
                            </Link>
                        </div>
                    </div>
                    <div className="relative h-80 md:h-[480px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200">
                        <Image src="/images/bed1.jpg" alt="Our Yard" fill className="object-cover" />
                    </div>
                </div>
            </div>

            {/* Values */}
            <section className="py-24 max-w-7xl mx-auto px-6 md:px-10">
                <div className="text-center mb-16">
                    <div className="section-tag mx-auto bg-gray-100 border border-gray-200 text-gray-700">Our Values</div>
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 uppercase tracking-tight">
                        How We Do <span className="text-blue-600">Business</span>
                    </h2>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { Icon: Shield, title: 'Honest Grading', desc: 'Every part is accurately described. We photograph and grade honestly so there are zero surprises when you arrive.' },
                        { Icon: Truck, title: 'Hilux Experts', desc: 'Toyota Hilux is our bread and butter. We carry more Hilux-specific parts than any yard in the region.' },
                        { Icon: Users, title: 'Customer First', desc: 'We take the time to make sure you get the right part for your vehicle. No pressure, just straight talk.' },
                        { Icon: Award, title: 'Fair Pricing', desc: 'We price our parts fairly — not dealer prices, not junk prices. Quality at a price that works for you.' },
                    ].map(({ Icon, title, desc }) => (
                        <div key={title} className="glass-card p-8 bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all group">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-6 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                                <Icon size={22} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-3 text-lg">{title}</h3>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Story */}
            <section className="py-24 bg-white border-y border-gray-200">
                <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative h-72 md:h-[420px] rounded-2xl overflow-hidden shadow-xl border border-gray-200">
                        <Image src="/images/doors.jpg" alt="Our parts selection" fill className="object-cover" />
                    </div>
                    <div>
                        <div className="section-tag bg-gray-100 border border-gray-200 text-gray-700">Our Story</div>
                        <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4 mb-6 uppercase tracking-tight">
                            Started By Truck <span className="text-blue-600">People</span>
                        </h2>
                        <p className="text-gray-600 text-base font-medium leading-relaxed mb-6">
                            AG Truck Beds started as a side operation — buying, inspecting, and reselling quality truck beds out of our family property in Buffalo, TX. Word spread quickly that we were the go-to yard for anyone needing Hilux or half-ton beds that weren&apos;t rotted out or misrepresented.
                        </p>
                        <p className="text-gray-600 text-base font-medium leading-relaxed mb-6">
                            Today we are a full-service truck parts yard with over 500 parts in stock at any given time. We source from fleet vehicles, insurance totals, and trade-ins — always inspecting for quality before we add anything to inventory.
                        </p>
                        <p className="text-gray-600 text-base font-bold leading-relaxed border-l-4 border-blue-600 pl-4 mt-8">
                            Whether you&apos;re a DIY mechanic or a professional shop, give us a call. We speak your language.
                        </p>
                    </div>
                </div>
            </section>

            {/* Location */}
            <section className="py-24 max-w-7xl mx-auto px-6 md:px-10 text-center">
                <div className="section-tag mx-auto bg-gray-100 border border-gray-200 text-gray-700">Visit Us</div>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 mt-4 uppercase tracking-tight">
                    We&apos;re in <span className="text-blue-600">Buffalo, TX</span>
                </h2>
                <div className="flex items-center justify-center gap-3 text-gray-800 font-bold text-lg mb-10">
                    <MapPin size={20} className="text-gray-400" />
                    <span>630 Bridget Ave, Buffalo, TX 75831</span>
                </div>
                <a
                    href="https://www.google.com/maps/search/630+Bridget+Ave,+Buffalo,+TX+75831"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex mx-auto shadow-lg px-8 py-4 text-sm"
                >
                    <MapPin size={16} className="mr-2" /> Get Directions on Google Maps
                </a>
            </section>
        </div>
    )
}
