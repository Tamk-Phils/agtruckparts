import { supabase } from './supabase';

const VAPID_PUBLIC_KEY = 'BI78K_m-Tj6O7H-bI7-Tj6O7H-bI78K_m-Tj6O7H-bI7-Tj6O7H-bI78K_m-Tj6O7H-bI7-Tj6O7H-bI78K_m'; // Placeholder key

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export const subscribeUserToPush = async (userId: string) => {
    try {
        if (!('serviceWorker' in navigator)) return;

        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });

        const sub = JSON.parse(JSON.stringify(subscription));

        // Save to Supabase
        await supabase.from('push_subscriptions').upsert({
            user_id: userId,
            endpoint: sub.endpoint,
            p256dh: sub.keys.p256dh,
            auth: sub.keys.auth
        });

        console.log('Push subscription successful');
    } catch (error) {
        console.error('Push subscription failed:', error);
    }
};

export const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('/sw.js');
        } catch (error) {
            console.error('Service worker registration failed:', error);
        }
    }
};
