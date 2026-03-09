import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const adminSupabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storageKey: 'ag-admin-auth-token',
    }
})

export type Product = {
    id: string
    name: string
    description: string
    price: number
    category: string
    condition: string
    year?: string
    make?: string
    model?: string
    images: string[]
    in_stock: boolean
    featured: boolean
    created_at: string
}

export type Review = {
    id: string
    author: string
    rating: number
    comment: string
    location: string
    created_at: string
    verified: boolean
}

export type Inquiry = {
    id: string
    name: string
    email: string
    phone?: string
    subject: string
    message: string
    product_id?: string
    status: 'new' | 'read' | 'replied'
    created_at: string
}

export type ChatMessage = {
    id: string
    session_id: string
    sender: 'user' | 'agent'
    message: string
    read?: boolean
    created_at: string
}
