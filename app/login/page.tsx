'use client'
import { useState } from 'react'
import { supabase, adminSupabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSignUp, setIsSignUp] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isSignUp) {
                const { error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (signUpError) throw signUpError
                alert("Sign up successful! You can now log in.")
                setIsSignUp(false)
            } else {
                const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL

                if (email === adminEmail) {
                    const { error: signInError } = await adminSupabase.auth.signInWithPassword({
                        email,
                        password,
                    })
                    if (signInError) throw signInError
                    router.push('/admin')
                } else {
                    const { error: signInError } = await supabase.auth.signInWithPassword({
                        email,
                        password,
                    })
                    if (signInError) throw signInError
                    router.push('/shop')
                }
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during authentication.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-32 pb-20 bg-gray-50 flex flex-col items-center justify-center px-6">
            <div className="max-w-md w-full">
                <Link href="/shop" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 font-bold mb-8 transition-colors w-fit">
                    <ArrowLeft size={16} /> Back to Shop
                </Link>

                <div className="bg-white p-10 rounded-2xl shadow-xl w-full border border-gray-100">
                    <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight text-center">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </h1>
                    <p className="text-gray-500 text-center mb-8 font-medium text-sm">
                        {isSignUp ? 'Sign up to reserve parts and track orders.' : 'Log in to securely add items to your cart.'}
                    </p>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold mb-6 border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleAuth} className="flex flex-col gap-5">
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest">Email Address</label>
                            <input
                                type="email"
                                required
                                className="input-dark bg-gray-50 border-gray-200 text-gray-900 py-3 px-4 rounded-xl w-full"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-gray-500 mb-2 block uppercase tracking-widest">Password</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                className="input-dark bg-gray-50 border-gray-200 text-gray-900 py-3 px-4 rounded-xl w-full"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary py-4 justify-center mt-2">
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (isSignUp ? 'Sign Up' : 'Log In')}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-600 font-medium">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                        </p>
                        <button
                            onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
                            className="text-blue-600 font-bold text-sm mt-2 hover:underline"
                        >
                            {isSignUp ? 'Log in here' : 'Create one here'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
