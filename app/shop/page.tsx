import { Metadata } from 'next'
import ShopClient from './ShopClient'

export const metadata: Metadata = {
    title: "Shop Truck Beds & Hilux Parts | AG Truck Beds",
    description: "Browse our extensive inventory of premium truck beds, authentic Toyota Hilux parts, doors, tailgates, and accessories. Real-time availability.",
    alternates: {
        canonical: '/shop',
    },
}

export default function ShopPage() {
    return <ShopClient />
}
