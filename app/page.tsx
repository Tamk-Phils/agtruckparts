import Link from 'next/link'
import Image from 'next/image'
import Hero from '@/components/Hero'
import { ArrowRight, Phone, MapPin, Star, Shield, Truck, Clock, Zap, ChevronRight, CheckCircle } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import ReviewCard from '@/components/ReviewCard'
import { REVIEWS, STATS } from '@/lib/data'
import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'

export const metadata: Metadata = {
  title: "AG Truck Beds and Parts | Quality Custom Truck Beds & Hilux Parts",
  description: "Browse our massive inventory of custom flatbed truck beds, Toyota Hilux parts, truck doors, and tailgates. Fast live chat and honest grading in Buffalo, TX.",
  alternates: {
    canonical: '/',
  },
}

export const revalidate = 60

export default async function HomePage() {
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .limit(6)

  const featured = featuredProducts || []

  return (
    <div className="overflow-x-hidden">
      <Hero />

      {/* ===== MARQUEE ===== */}
      < section className="py-6 border-y border-gray-200 bg-gray-100 overflow-hidden" >
        <div className="flex" style={{ width: 'max-content' }}>
          <div className="marquee-track flex gap-10 pr-10">
            {['Toyota Hilux Beds', '·', 'Truck Doors', '·', 'Tailgates', '·', 'Body Panels', '·', 'Roll Bars', '·', 'Bumpers', '·', 'Fenders', '·', 'Silverado Beds', '·', 'F-150 Parts', '·', 'East Texas Delivery', '·'].map((item, i) => (
              <span key={i} className={`text-sm font-bold whitespace-nowrap ${item === '·' ? 'text-blue-600' : 'text-gray-600 uppercase tracking-widest'}`}>
                {item}
              </span>
            ))}
          </div>
          <div className="marquee-track flex gap-10 pr-10" aria-hidden>
            {['Toyota Hilux Beds', '·', 'Truck Doors', '·', 'Tailgates', '·', 'Body Panels', '·', 'Roll Bars', '·', 'Bumpers', '·', 'Fenders', '·', 'Silverado Beds', '·', 'F-150 Parts', '·', 'East Texas Delivery', '·'].map((item, i) => (
              <span key={i} className={`text-sm font-bold whitespace-nowrap ${item === '·' ? 'text-blue-600' : 'text-gray-600 uppercase tracking-widest'}`}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section >

      {/* ===== WHY CHOOSE US ===== */}
      < section className="py-24 max-w-7xl mx-auto px-6 md:px-10 bg-white" >
        <div className="text-center mb-16">
          <div className="section-tag mx-auto bg-gray-100 border border-gray-200 text-gray-700">Why AG Truck Beds</div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mt-4">
            The Parts Yard <span className="text-blue-600">People Trust</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { Icon: Shield, title: 'Honest Grading', desc: 'Parts graded accurately — what you see is exactly what you get. No surprises on pickup.' },
            { Icon: Truck, title: 'Hilux Specialists', desc: 'We carry an unmatched inventory of Toyota Hilux beds, tailgates, doors, and body panels.' },
            { Icon: Clock, title: 'Same-Day Pickup', desc: 'Browse online, call to confirm availability, and pick up your part the same day.' },
            { Icon: Zap, title: 'Fast Live Chat', desc: 'Get instant answers about part availability, fitment, and pricing through our live chat.' },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="glass-card p-8 hover:border-blue-400 hover:shadow-xl transition-all group bg-white">
              <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center mb-6 group-hover:bg-blue-50 group-hover:border-blue-200 transition-colors">
                <Icon size={22} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
              </div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">{title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">{desc}</p>
            </div>
          ))}
        </div>
      </section >

      {/* ===== FEATURED PRODUCTS ===== */}
      < section className="py-24 bg-gray-50 border-y border-gray-200" >
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="section-tag bg-white border border-gray-200 text-gray-700">Featured Inventory</div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mt-4">
                HOT PARTS <span className="text-blue-600">THIS WEEK</span>
              </h2>
            </div>
            <Link href="/shop" className="btn-glass hidden md:inline-flex items-center gap-2 text-sm font-bold bg-white">
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="mt-10 text-center md:hidden">
            <Link href="/shop" className="btn-primary w-full max-w-sm">
              View All Parts <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section >

      {/* ===== REAL PHOTOS STRIP ===== */}
      < section className="py-24 max-w-7xl mx-auto px-6 md:px-10 bg-white" >
        <div className="text-center mb-12">
          <div className="section-tag mx-auto bg-gray-100 border border-gray-200 text-gray-700">Our Yard</div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mt-4">
            See Our <span className="text-blue-600">Inventory</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {['/images/bed1.jpg', '/images/doors.jpg', '/images/bed2.jpg'].map((src, i) => (
            <div key={i} className="relative h-64 md:h-80 rounded-2xl overflow-hidden group shadow-md border border-gray-100">
              <Image src={src} alt="Inventory" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
          ))}
        </div>
      </section >

      {/* ===== CTA BANNER ===== */}
      < section className="relative py-24 overflow-hidden border-y border-gray-200 bg-gray-900" >
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute inset-0 grid-bg opacity-10" />
        <div className="relative max-w-4xl mx-auto px-6 md:px-10 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight">
            Can&apos;t Find What<br />You&apos;re Looking For?
          </h2>
          <p className="text-gray-300 text-lg md:text-xl font-medium mb-10 max-w-2xl mx-auto">
            Our inventory changes daily. Call or message us and we&apos;ll help you find the exact part you need.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="tel:+19036509882" className="btn-primary text-base px-10 py-4 shadow-lg">
              <Phone size={17} /> +1(903) 650-9882
            </a>
            <Link href="/contact" className="btn-glass !bg-white/10 !text-white !border-white/20 hover:!bg-white/20 text-base px-10 py-4">
              Send Inquiry <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section >

      {/* ===== REVIEWS ===== */}
      < section className="py-24 max-w-7xl mx-auto px-6 md:px-10 bg-white" >
        <div className="text-center mb-16">
          <div className="section-tag mx-auto bg-gray-100 border border-gray-200 text-gray-700">Customer Reviews</div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mt-4">
            What Customers <span className="text-blue-600">Say</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex gap-0.5 stars">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" className="text-amber-400" />)}
            </div>
            <span className="text-gray-600 text-sm font-bold">4.9 / 5 · Based on 180+ reviews</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REVIEWS.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      </section >

      {/* ===== CONTACT STRIP ===== */}
      <section className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
          <div className="section-tag mx-auto bg-white border border-gray-200 text-gray-700">Find Us</div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 uppercase tracking-tight mt-4 mb-8">
            Visit Our <span className="text-blue-600">Yard</span>
          </h2>
          <p className="text-gray-600 text-lg mb-12 font-medium max-w-2xl mx-auto">
            We&apos;re conveniently located in Buffalo, TX. Browse our full selection in person or call ahead to confirm availability.
          </p>
          <div className="grid sm:grid-cols-3 gap-8 text-center pb-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm">
                <MapPin size={22} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Location</p>
                <p className="text-base font-bold text-gray-800">630 Bridget Ave<br />Buffalo, TX 75831</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm">
                <Phone size={22} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Call Us</p>
                <a href="tel:+19036509882" className="text-base font-bold text-gray-800 hover:text-blue-600 transition">+1(903) 650-9882</a>
              </div>
            </div>
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm">
                <Clock size={22} className="text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Hours</p>
                <p className="text-base font-bold text-gray-800">Mon–Sat: 8:00 AM – 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
