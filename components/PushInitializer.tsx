'use client'
import { useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { registerServiceWorker, subscribeUserToPush } from '@/lib/push'

export default function PushInitializer() {
    const { user } = useAuth()

    useEffect(() => {
        registerServiceWorker()
    }, [])

    useEffect(() => {
        if (user) {
            subscribeUserToPush(user.id)
        }
    }, [user])

    return null
}
