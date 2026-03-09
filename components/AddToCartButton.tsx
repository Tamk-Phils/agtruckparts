'use client'
import { ShoppingCart, Check } from 'lucide-react'
import { useCart } from './CartProvider'
import { Product } from '@/lib/supabase'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'

export default function AddToCartButton({ product, className = "" }: { product: Product, className?: string }) {
    const { addToCart } = useCart()
    const { user, loading } = useAuth()
    const router = useRouter()
    const [added, setAdded] = useState(false)

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault() // prevent navigation if inside a Link

        if (loading) return // don't act if auth state is loading

        if (!user) {
            router.push('/login')
            return
        }

        addToCart(product)
        setAdded(true)
        setTimeout(() => setAdded(false), 2000)
    }

    const disabled = !product.in_stock

    return (
        <button
            onClick={handleAdd}
            disabled={disabled}
            className={`btn-primary flex items-center justify-center transition-all ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-500 border-gray-300 shadow-none hover:bg-gray-300 hover:text-gray-500 hover:border-gray-300' : ''} ${className}`}
        >
            {added ? (
                <><Check size={16} className="mr-2" /> Added</>
            ) : disabled ? (
                <>Out of Stock</>
            ) : (
                <><ShoppingCart size={16} className="mr-2" /> Reserve Part</>
            )}
        </button>
    )
}
