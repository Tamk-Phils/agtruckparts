import { supabase } from './supabase';

const VAPID_PUBLIC_KEY = 'BEl62iUYSXUq9p5sk9yR2S2G4d7xS7L-m-Q-8lEj-b9n-m_x-S-m-Q-8lEj-b9n-m_x-S-m-Q-8lEj-b9n-m_x-A'; // Placeholder VAPID key (must be 65 bytes base64 encoded)

function urlBase64ToUint8Array(base64String: string) {
    try {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    } catch (e) {
        console.error('Failed to decode VAPID key. Please ensure VAPID_PUBLIC_KEY in lib/push.ts is a valid base64 encoded VAPID key.', e);
        return new Uint8Array();
    }
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
