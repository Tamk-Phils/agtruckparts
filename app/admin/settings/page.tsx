import type { Metadata } from 'next'
import Link from 'next/link'
import { Settings, Database, Bell, Shield } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Settings | AG Truck Beds Admin',
}

export default function AdminSettingsPage() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tight">SETTINGS</h1>
                <p className="text-sm text-gray-600 font-medium mt-1">Site configuration and account settings</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
                {[
                    {
                        Icon: Database,
                        title: 'Supabase Connection',
                        desc: 'Connect your Supabase project to enable live data, chat, and inquiry storage.',
                        action: 'Configure',
                        actionHref: '/.env.local',
                        note: 'Add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local',
                    },
                    {
                        Icon: Bell,
                        title: 'Notifications',
                        desc: 'Configure email notifications for new inquiries and chat messages.',
                        action: 'Coming Soon',
                        actionHref: '#',
                        note: 'Email notification setup will be available after Supabase integration',
                    },
                    {
                        Icon: Shield,
                        title: 'Admin Password',
                        desc: 'Change admin login credentials. Authentication handled via Supabase Auth.',
                        action: 'Coming Soon',
                        actionHref: '#',
                        note: 'Once Supabase is connected, you can set up proper admin authentication',
                    },
                ].map(({ Icon, title, desc, action, actionHref, note }) => (
                    <div key={title} className="bg-white border border-gray-200 shadow-sm p-6 rounded-2xl hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                                <Icon size={20} className="text-blue-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-base">{title}</h3>
                        </div>
                        <p className="text-sm font-medium text-gray-600 mb-4 leading-relaxed">{desc}</p>
                        <p className="text-[11px] font-bold text-gray-400 mb-5 italic">{note}</p>
                        <a href={actionHref} className="btn-glass bg-white text-gray-800 border-gray-300 hover:bg-gray-50 font-bold text-xs py-2 px-5 shadow-sm inline-flex">
                            {action}
                        </a>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-white border border-gray-200 shadow-sm p-8 rounded-2xl max-w-4xl">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-base">
                    <Settings size={18} className="text-gray-400" />
                    Business Information
                </h3>
                <div className="grid grid-cols-2 gap-6 text-sm">
                    {[
                        { label: 'Business Name', value: 'AG Truck Beds and Parts' },
                        { label: 'Email', value: 'agtruckbedsandparts@gmail.com' },
                        { label: 'Phone', value: '+1(903) 650-9882' },
                        { label: 'Address', value: '630 Bridget Ave, Buffalo, TX 75831' },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                            <p className="text-gray-900 font-bold text-sm">{value}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
