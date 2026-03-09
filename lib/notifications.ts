/**
 * Simple utility for Browser Native Notifications
 */

export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }
    return false;
};

export const sendNativeNotification = (title: string, options?: NotificationOptions) => {
    // Only send if tab is backgrounded or hidden
    if (document.hidden && Notification.permission === 'granted') {
        new Notification(title, {
            icon: '/images/logo.png',
            ...options,
        });
    }
};
