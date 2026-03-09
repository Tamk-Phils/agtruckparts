import { supabase } from './supabase';

const VAPID_PUBLIC_KEY = 'BE8xQ6jjK-vMNg15K8j0T7GJbaJ22HzeQ3AA7ebtt09Q0zM6MandjuUiLAA8WpOaDx_bThJVZsxqpfgmwl0ueH0';

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

        // Check for existing subscription
        const existingSubscription = await registration.pushManager.getSubscription();

        if (existingSubscription) {
            // If subscription exists, check if it uses a different key (InvalidStateError fix)
            // We can't easily compare keys directly, so the safest way to ensure compatibility 
            // is to unsubscribe and re-subscribe if we've updated our keys.
            await existingSubscription.unsubscribe();
        }

        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });

        const sub = JSON.parse(JSON.stringify(subscription));

        // Save to Supabase
        const { error: upsertError } = await supabase.from('push_subscriptions').upsert({
            user_id: userId,
            endpoint: sub.endpoint,
            p256dh_key: sub.keys.p256dh,
            auth_token: sub.keys.auth
        }, { onConflict: 'endpoint' });

        if (upsertError) {
            console.error('Failed to save push subscription to database:', upsertError);
        } else {
            console.log('Push subscription successful');
        }
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
