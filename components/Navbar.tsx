'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, Mail, ChevronDown, ShoppingCart } from 'lucide-react'
import { useCart } from './CartProvider'
import { useAuth } from './AuthProvider'
import CartSlideOut from './CartSlideOut'

const NAV_LINKS = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    {
        label: 'Our Solutions',
        href: '/shop',
        sub: [
            { label: 'Truck Beds', href: '/shop?category=Truck+Beds' },
            { label: 'Hilux Parts', href: '/shop?category=Hilux+Parts' },
            { label: 'Doors', href: '/shop?category=Doors' },
            { label: 'Body Parts', href: '/shop?category=Body+Parts' },
        ],
    },
    { label: 'Get a Quote', href: '/contact' },
    { label: 'Blog', href: '/faq' },
]

export default function Navbar() {
    const [open, setOpen] = useState(false)
    const [shopOpen, setShopOpen] = useState(false)
    const [cartOpen, setCartOpen] = useState(false)
    const pathname = usePathname()
    const { items } = useCart()
    const { user, signOut } = useAuth()

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const isAdmin = pathname.startsWith('/admin')

    if (isAdmin) return null

    return (
        <>
            {/* Stable Sticky Navbar */}
            <header className="fixed top-0 left-0 right-0 z-[50] bg-white border-b border-gray-100 py-3 shadow-sm">
                <nav className="flex items-center justify-between px-6 md:px-12 max-w-[1400px] mx-auto">
                    {/* Logo - Consistent Styling */}
                    <Link href="/" className="flex items-center gap-3 group transition-transform hover:scale-105 active:scale-95 duration-300">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-lg shadow-black/5 flex items-center justify-center border border-gray-100 p-1 overflow-hidden">
                            <img
                                src="/images/logo.png"
                                alt="AG Truck Beds"
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl md:text-2xl font-black text-gray-900 leading-none tracking-tighter">AG TRUCK BEDS</span>
                            <span className="text-[10px] font-bold text-blue-600 leading-none tracking-[0.3em] mt-0.5 uppercase">& PARTS</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <ul className="hidden md:flex items-center gap-4">
                        {NAV_LINKS.map((link) =>
                            link.sub ? (
                                <li key={link.label} className="relative">
                                    <button
                                        className="flex items-center gap-1 px-3 py-2 text-[14px] rounded-lg transition-all font-medium text-gray-600 hover:text-gray-900 hover:bg-black/5"
                                        onMouseEnter={() => setShopOpen(true)}
                                        onMouseLeave={() => setShopOpen(false)}
                                    >
                                        {link.label} <ChevronDown size={14} className={`transition-transform ${shopOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {shopOpen && (
                                        <div
                                            className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl overflow-hidden py-2 shadow-xl"
                                            onMouseEnter={() => setShopOpen(true)}
                                            onMouseLeave={() => setShopOpen(false)}
                                        >
                                            {link.sub.map((s) => (
                                                <Link
                                                    key={s.label}
                                                    href={s.href}
                                                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-sky-600 transition-all font-medium"
                                                >
                                                    {s.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </li>
                            ) : (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="px-3 py-2 text-[14px] rounded-lg transition-all font-medium block text-gray-600 hover:text-gray-900 hover:bg-black/5"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            )
                        )}
                    </ul>

                    {/* CTA */}
                    <div className="hidden md:flex items-center gap-4">
                        <button
                            onClick={() => setCartOpen(true)}
                            className="relative p-2 rounded-full transition-colors text-gray-600 hover:bg-black/5 hover:text-gray-900"
                        >
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {user ? (
                            <div className="flex items-center gap-3">
                                <Link href="/dashboard" className="px-4 py-2 text-[13px] font-black text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all uppercase tracking-widest border border-blue-100">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="px-4 py-2 text-[13px] font-bold text-gray-500 hover:text-gray-900 transition-colors uppercase tracking-widest"
                                >
                                    Log Out
                                </button>
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="text-[13px] font-bold px-4 py-2 rounded-xl transition-all uppercase tracking-widest text-gray-600 hover:bg-black/5 hover:text-gray-900">
                                    Log In
                                </Link>
                                <Link href="/contact" className="btn-primary">
                                    Contact Us
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <div className="md:hidden flex items-center gap-3">
                        <button
                            onClick={() => setCartOpen(true)}
                            className="relative p-2.5 rounded-full transition-all active:scale-95 text-gray-900 bg-gray-100 border border-gray-200 shadow-sm"
                        >
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg animate-fade-in">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                        <button
                            className="p-2.5 rounded-full transition-all active:scale-90 text-gray-900 bg-gray-100 border border-gray-200 shadow-sm"
                            onClick={() => setOpen(!open)}
                            aria-label="Toggle menu"
                        >
                            {open ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </nav>
            </header>

            {/* Mobile Menu - Moved outside header for fixed positioning stability */}
            <div className={`fixed inset-0 z-[100] md:hidden transition-all duration-500 ease-in-out ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setOpen(false)} />
                <div className={`absolute right-0 top-0 h-full w-[300px] bg-white shadow-2xl transition-transform duration-500 ease-in-out p-8 flex flex-col ${open ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex justify-between items-center mb-10">
                        <img
                            src="/images/logo.png"
                            alt="AG Logo"
                            className="h-10 w-auto"
                        />
                        <button onClick={() => setOpen(false)} className="p-2.5 bg-gray-100 rounded-full text-gray-500 hover:text-gray-900 shadow-inner">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex flex-col gap-1.5 flex-1 overflow-y-auto pr-2">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`py-4 px-5 rounded-2xl text-sm font-black uppercase tracking-[0.15em] transition-all border-2 ${pathname === link.href ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100' : 'text-gray-600 hover:bg-gray-50 border-transparent hover:border-gray-100'}`}
                                onClick={() => setOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8 pt-8 border-t-2 border-gray-100 space-y-4">
                        {user ? (
                            <>
                                <Link href="/dashboard" className="flex items-center justify-center w-full py-4 bg-blue-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-blue-100" onClick={() => setOpen(false)}>
                                    Dashboard Access
                                </Link>
                                <button onClick={() => { signOut(); setOpen(false); }} className="w-full py-3 px-4 text-gray-400 font-bold hover:text-red-500 text-[10px] uppercase tracking-widest">
                                    Log Out Securely
                                </button>
                            </>
                        ) : (
                            <Link href="/login" className="flex items-center justify-center w-full py-4 bg-gray-900 text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] shadow-xl" onClick={() => setOpen(false)}>
                                Login / Register
                            </Link>
                        )}
                        <div className="pt-2">
                            <a href="tel:+19036509882" className="flex items-center justify-center gap-3 py-4 border-2 border-gray-100 rounded-2xl text-xs font-black text-gray-900 hover:bg-gray-50 transition-colors uppercase tracking-widest">
                                <Phone size={14} className="text-blue-600" /> +1(903) 650-9882
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <CartSlideOut isOpen={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    )
}
