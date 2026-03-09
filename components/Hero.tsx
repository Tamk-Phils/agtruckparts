'use client'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

export default function Hero() {
    return (
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-between pt-32 pb-10 md:justify-center md:pt-40 md:pb-48 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 bg-slate-900">
                <Image
                    src="/images/hilux-hero.jpg"
                    alt="Truck Parts Background"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                {/* Gradient Overlay for blending into the next section */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-100 via-slate-900/10 to-transparent" />
            </div>

            {/* Text Area */}
            <div className="relative z-20 text-center px-6 max-w-5xl mx-auto mt-12 md:mt-0 md:-mt-16 flex-1 flex flex-col justify-center">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-[2.8rem] md:text-7xl lg:text-[5.5rem] font-black text-white leading-[0.9] mb-8 tracking-tighter uppercase"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                >
                    Quality Parts <br className="hidden md:block" /> <span className="text-blue-500">Reliable</span> Trucks
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-base md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto font-medium leading-relaxed opacity-90"
                >
                    Reliable, affordable and heavy-duty parts for your truck. Sourced carefully for maximum performance on every road.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="flex justify-center"
                >
                    <Link href="/shop" className="btn-primary px-12 py-4.5 text-sm font-black uppercase tracking-[0.25em] rounded-xl shadow-2xl shadow-blue-600/40 hover:scale-105 transition-transform active:scale-95">
                        Shop Inventory
                    </Link>
                </motion.div>
            </div>
        </section>
    )
}
