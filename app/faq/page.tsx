import type { Metadata } from 'next'
import { ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
    title: 'FAQ | AG Truck Beds and Parts',
    description: 'Frequently asked questions about truck bed and parts purchasing, pickup, pricing, and more at AG Truck Beds and Parts in Buffalo, TX.',
}

const FAQS = [
    {
        q: 'Do you accept online payment?',
        a: 'Yes. We do accept online payment.Transactions are done online. Browse our inventory online, contact us to confirm availability, then come pick up your part or have it shipped to you.',
    },
    {
        q: 'How do I know if a part will fit my truck?',
        a: 'Each listing includes year, make, and model compatibility information. If you\'re unsure, call us at +1(903) 650-9882 or send us a message — we\'re happy to help verify fitment before you make the trip.',
    },
    {
        q: 'What are your general parts prices?',
        a: 'Prices vary by part condition, rarity, and demand. Truck beds typically run $600–$1,000, doors are $140–$350, and Hilux-specific parts vary widely. Check individual listings for current pricing.',
    },
    {
        q: 'Do you offer delivery?',
        a: 'We primarily operate as a pickup yard. For large orders or special circumstances, contact us to discuss delivery options. We do not have scheduled delivery routes at this time.',
    },
    {
        q: 'What condition are your parts in?',
        a: 'We grade all parts honestly: Excellent (minimal wear), Good (normal used condition), or Fair (cosmetic damage but structurally sound). We describe and photograph every significant flaw.',
    },
    {
        q: 'Do you specialize in Toyota Hilux parts?',
        a: 'Yes! The Toyota Hilux is our specialty. We carry beds, tailgates, doors, fenders, bumpers, and roll bars for most Hilux generations from 2000 onwards. Inventory changes regularly, so call or chat to check what\'s available.',
    },
    {
        q: 'What are your business hours?',
        a: 'We are open Monday–Friday 8AM–6PM and Saturday 9AM–4PM. Sunday visits are by appointment only. Call +1(903) 650-9882 to schedule.',
    },
    {
        q: 'Can I sell or trade parts to you?',
        a: 'We purchase quality truck parts in good condition. Contact us with photos and a description and we\'ll let you know if it\'s something we\'re interested in.',
    },
    {
        q: 'Do you have a warranty on parts?',
        a: 'Parts are sold as-is in their described condition. We stand behind our grading — if a part is not as described, we will work with you to make it right. All sales are final for correctly described parts.',
    },
    {
        q: 'Where are you located?',
        a: '630 Bridget Ave, Buffalo, TX 75831. We\'re located in Leon County, easily accessible from Palestine, Corsicana, Huntsville, and Waco.',
    },
]

export default function FAQPage() {
    return (
        <div className="min-h-screen pt-24 pb-20 bg-gray-50">
            {/* Header */}
            <div className="relative py-24 overflow-hidden bg-white border-b border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white -z-10" />
                <div className="relative max-w-7xl mx-auto px-6 md:px-10 text-center">
                    <div className="section-tag mx-auto bg-gray-100 border border-gray-200 text-gray-700">Common Questions</div>
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 mt-4 uppercase tracking-tight">
                        FREQUENTLY ASKED <span className="text-blue-600">QUESTIONS</span>
                    </h1>
                    <p className="text-gray-600 mt-6 text-lg font-medium max-w-xl mx-auto">
                        Everything you need to know before visiting or contacting us.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 md:px-10 mt-16">
                <div className="flex flex-col gap-4">
                    {FAQS.map((faq, i) => (
                        <details key={i} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all group overflow-hidden">
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none bg-white hover:bg-gray-50 transition-colors">
                                <span className="font-bold text-gray-900 text-base pr-4">{faq.q}</span>
                                <ChevronDown
                                    size={18}
                                    className="text-gray-400 group-open:text-blue-600 group-open:rotate-180 transition-transform flex-shrink-0"
                                />
                            </summary>
                            <div className="px-6 pb-6 text-base font-medium text-gray-600 leading-relaxed border-t border-gray-100 pt-4 bg-white/50">
                                {faq.a}
                            </div>
                        </details>
                    ))}
                </div>

                <div className="mt-16 bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-lg">
                    <h3 className="text-2xl font-black text-gray-900 mb-2 tracking-tight">Still have questions?</h3>
                    <p className="text-base text-gray-600 font-medium mb-8">We&apos;re here to help. Call or use our live chat below.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="tel:+19036509882" className="btn-primary text-sm px-8 shadow-md">
                            Call +1(903) 650-9882
                        </a>
                        <a href="mailto:agtruckbedsandparts@gmail.com" className="btn-glass bg-white text-gray-800 border-gray-300 hover:bg-gray-50 text-sm px-8 shadow-sm font-bold">
                            Email Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
