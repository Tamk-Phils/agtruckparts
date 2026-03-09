// @ts-ignore: Deno URL import
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore: Deno URL import
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// @ts-ignore: web-push types
import webpush from 'https://esm.sh/web-push'

// @ts-ignore: Deno global
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
// @ts-ignore: Deno global
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
// @ts-ignore: Deno global
const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')!
// @ts-ignore: Deno global
const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')!

webpush.setVapidDetails(
    'mailto:agtruckbedsandparts@gmail.com',
    vapidPublicKey,
    vapidPrivateKey
)

const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req: Request) => {
    try {
        const { record, table, type } = await req.json()

        let title = "New Notification"
        let body = "You have a new update."
        let userId = null

        if (table === 'orders' && type === 'INSERT') {
            title = "New Order! 📦"
            body = `Order from ${record.customer_name} for $${record.total_amount}`
            // You can implement custom logic here to find admin user IDs
        } else if (table === 'chat_messages' && type === 'INSERT' && record.sender === 'agent') {
            title = "New Message 💬"
            body = record.message
            userId = record.user_id
        } else if (table === 'chat_messages' && type === 'INSERT' && record.sender === 'user') {
            title = "User Message! 💬"
            body = record.message
            // Target admins
        }

        // Fetch subscriptions
        let query = supabase.from('push_subscriptions').select('*')

        if (userId) {
            query = query.eq('user_id', userId)
        }

        const { data: subs, error: fetchError } = await query

        if (fetchError || !subs) {
            return new Response(JSON.stringify({ error: fetchError?.message || 'No subscriptions' }), { status: 400 })
        }

        const notifications = subs.map((sub: any) => {
            return webpush.sendNotification({
                endpoint: sub.endpoint,
                keys: {
                    auth: sub.auth_token,
                    p256dh: sub.p256dh_key
                }
            }, JSON.stringify({ title, body }))
        })

        const results = await Promise.allSettled(notifications)

        return new Response(JSON.stringify({ success: true, results }), { headers: { 'Content-Type': 'application/json' } })
    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 })
    }
})
