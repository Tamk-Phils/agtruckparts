'use client'
import Link from 'next/link'
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, ArrowRight } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="relative mt-24 border-t border-gray-200 bg-gray-50">
            {/* Main footer */}
            <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                {/* Brand */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <img
                            src="/images/logo.png"
                            alt="AG Truck Beds Logo"
                            className="h-12 md:h-14 w-auto mix-blend-multiply"
                        />
                        <div className="flex flex-col">
                            <span className="text-xl font-black text-gray-900 tracking-tighter uppercase">AG TRUCK BEDS</span>
                            <span className="text-[9px] font-bold text-blue-600 tracking-[0.3em] uppercase mt-0.5">& PARTS</span>
                        </div>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed mb-5">
                        Your trusted source for quality truck beds, Hilux parts, doors, and body panels in East Texas. Fair prices, honest deals.
                    </p>
                    <div className="flex gap-3">
                        {[
                            { Icon: Facebook, href: '#', label: 'Facebook' },
                            { Icon: Instagram, href: '#', label: 'Instagram' },
                            { Icon: Youtube, href: '#', label: 'YouTube' },
                        ].map(({ Icon, href, label }) => (
                            <a
                                key={label}
                                href={href}
                                aria-label={label}
                                className="w-9 h-9 rounded-full border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-900 shadow-sm transition-all"
                            >
                                <Icon size={15} />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-gray-900 font-bold mb-4 text-sm uppercase tracking-widest">Quick Links</h4>
                    <ul className="flex flex-col gap-2.5">
                        {[
                            { label: 'Home', href: '/' },
                            { label: 'Shop All Parts', href: '/shop' },
                            { label: 'Truck Beds', href: '/shop?category=Truck+Beds' },
                            { label: 'Hilux Parts', href: '/shop?category=Hilux+Parts' },
                            { label: 'About Us', href: '/about' },
                            { label: 'FAQ', href: '/faq' },
                            { label: 'Contact', href: '/contact' },
                        ].map(({ label, href }) => (
                            <li key={label}>
                                <Link
                                    href={href}
                                    className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1.5 transition-colors group"
                                >
                                    <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Parts Categories */}
                <div>
                    <h4 className="text-gray-900 font-bold mb-4 text-sm uppercase tracking-widest">Categories</h4>
                    <ul className="flex flex-col gap-2.5">
                        {['Truck Beds', 'Hilux Parts', 'Doors', 'Body Parts', 'Tailgates', 'Bumpers', 'Fenders', 'Roll Bars'].map((cat) => (
                            <li key={cat}>
                                <Link
                                    href={`/shop?category=${encodeURIComponent(cat)}`}
                                    className="text-sm text-gray-600 hover:text-gray-900 font-medium flex items-center gap-1.5 transition-colors group"
                                >
                                    <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {cat}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="text-gray-900 font-bold mb-4 text-sm uppercase tracking-widest">Contact Us</h4>
                    <div className="flex flex-col gap-4">
                        <a href="tel:+19036509882" className="flex items-start gap-3 group">
                            <div className="w-8 h-8 rounded-lg bg-gray-200/50 border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors mt-0.5">
                                <Phone size={14} className="text-gray-700" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5 font-medium">Phone</p>
                                <p className="text-sm text-gray-900 font-semibold group-hover:text-blue-600 transition-colors">+1(903) 650-9882</p>
                            </div>
                        </a>
                        <a href="mailto:agtruckbedsandparts@gmail.com" className="flex items-start gap-3 group">
                            <div className="w-8 h-8 rounded-lg bg-gray-200/50 border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:bg-gray-200 transition-colors mt-0.5">
                                <Mail size={14} className="text-gray-700" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5 font-medium">Email</p>
                                <p className="text-sm text-gray-900 font-semibold group-hover:text-blue-600 transition-colors break-all">agtruckbedsandparts@gmail.com</p>
                            </div>
                        </a>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gray-200/50 border border-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <MapPin size={14} className="text-gray-700" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-0.5 font-medium">Location</p>
                                <p className="text-sm text-gray-900 font-semibold">630 Bridget Ave<br />Buffalo, TX 75831</p>
                            </div>
                        </div>
                        <div className="mt-2 p-3 rounded-xl border border-gray-200 bg-white">
                            <p className="text-xs text-gray-900 font-bold mb-1 uppercase tracking-wide">Business Hours</p>
                            <p className="text-xs text-gray-600 font-medium">Mon–Sat: 8:00 AM – 6:00 PM</p>
                            <p className="text-xs text-gray-600 font-medium">Sun: By Appointment</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-200 bg-white px-6 md:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-sm">
                <p className="text-xs text-gray-500 font-medium">
                    © {new Date().getFullYear()} AG Truck Beds and Parts. All rights reserved.
                </p>
                <div className="flex gap-4 text-xs font-semibold text-gray-500">
                    <Link href="/privacy" className="hover:text-gray-900 transition-colors uppercase tracking-wider">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-gray-900 transition-colors uppercase tracking-wider">Terms of Use</Link>
                </div>
            </div>
        </footer>
    )
}
