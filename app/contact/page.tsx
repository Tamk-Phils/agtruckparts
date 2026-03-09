import { Metadata } from 'next'
import ContactClient from './ContactClient'

export const metadata: Metadata = {
    title: 'Contact Us | AG Truck Beds and Parts',
    description: 'Contact AG Truck Beds and Parts in Buffalo, TX. Over 500 truck beds, Hilux parts, and doors in stock. Call +1(903) 650-9882 or send an online inquiry today.',
    keywords: ['contact truck parts yard', 'truck bed inquiry', 'AG truck beds contact', 'Buffalo TX auto parts'],
    alternates: {
        canonical: '/contact',
    },
}

export default function ContactPage() {
    return <ContactClient />
}
