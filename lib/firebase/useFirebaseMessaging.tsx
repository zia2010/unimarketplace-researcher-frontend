import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import app from './config';
import { useEffect } from 'react';
import { authApi } from '../services/api/auth.api';
import { message } from 'antd';
import { fetchInitialUnreadCount } from '../services/firebase/unread';

export function useFirebaseMessaging(
  setUnreadMessage: React.Dispatch<React.SetStateAction<number>>,
  userId: string | null
) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!('serviceWorker' in navigator)) return;

    const setup = async () => {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      const registration = await navigator.serviceWorker.register(
        '/firebase-messaging-sw.js'
      );

      const messaging = getMessaging(app);

      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
        serviceWorkerRegistration: registration,
      });

      console.log('FCM token:', token);
      if (token && document.cookie.includes('accessToken')) {
        await authApi.saveFCMToken({ token });
      }

      onMessage(messaging, (payload) => {
        console.log('Foreground message:', payload);
        const title = payload.notification?.title ?? 'New notification';
        const body = payload.notification?.body;

        if (userId) fetchInitialUnreadCount(userId).then(setUnreadMessage);

        message.info({
          content: body ? `${title}: ${body}` : title,
        });
      });
    };

    setup();
  }, []);
}
