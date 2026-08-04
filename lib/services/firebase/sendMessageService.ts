import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  increment,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { auth } from '@/lib/firebase/config';
import { ChatMessage } from '@/types';
import { notificationsApi } from '../api/notification.api';
import { getLatestMessageTimestamp } from './getLatestMessageTimestamp';

const db = getFirestore();

export async function sendMessage(
  conversationId: string,
  text: string,
  senderRole = 'user'
) {
  if (!auth.currentUser) {
    throw new Error('Not authenticated');
  }

  if (!text.trim()) {
    throw new Error('Message cannot be empty');
  }

  const messagesRef = collection(
    db,
    'conversations',
    conversationId,
    'messages'
  );

  const docRef = await addDoc(messagesRef, {
    senderId: auth.currentUser.uid,
    senderRole,
    text,
    createdAt: serverTimestamp(),
  });

  await updateDoc(doc(db, 'conversations', conversationId), {
    lastMessage: text,
    lastMessageAt: serverTimestamp(),
    unreadCountStaff: increment(1),
  });

  console.log('✅ Message sent');
  try {
    await notificationsApi.triggerPushNotification({
      conversationId: conversationId,
      messageId: docRef.id,
      senderId: auth.currentUser.uid,
    });
  } catch (error) {
    console.log(error);
  }
}

export function subscribeToMessages(
  conversationId: string,
  callback: (messages: ChatMessage[]) => void
) {
  const messagesRef = collection(
    db,
    'conversations',
    conversationId,
    'messages'
  );

  const q = query(messagesRef, orderBy('createdAt', 'asc'));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ChatMessage[];

    callback(messages);
  });

  return unsubscribe;
}

/**
 * Enhanced subscription that pauses after 5 minutes of inactivity
 * and resumes when new messages are detected via 30s polling.
 */
export function subscribeToMessagesWithTimeout(
  conversationId: string,
  callback: (messages: ChatMessage[]) => void
) {
  // const SUBSCRIPTION_TIMEOUT = 100000; // 10 seconds
  const SUBSCRIPTION_TIMEOUT = 300000; // 5 minutes
  const POLLING_INTERVAL = 30000; // 30 seconds
  const ENABLE_DEBUG_LOGS = true;

  let unsubscribe: (() => void) | null = null;
  let timeoutId: NodeJS.Timeout | null = null;
  let pollingIntervalId: NodeJS.Timeout | null = null;
  let lastMessageAt: Timestamp | null = null;
  let isSubscriptionActive = false;

  const log = (message: string) => {
    if (ENABLE_DEBUG_LOGS) {
      console.log(`[Messages Subscription] [${conversationId}] ${message}`);
    }
  };

  const startSubscription = () => {
    if (isSubscriptionActive) return;

    log(`Activating messages subscription`);
    isSubscriptionActive = true;

    // Clear polling if active
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
      pollingIntervalId = null;
    }

    unsubscribe = subscribeToMessages(conversationId, (messages) => {
      // Update last message timestamp for polling
      if (messages.length > 0) {
        const latest = messages[messages.length - 1].createdAt;
        if (latest) lastMessageAt = latest;
      }

      // Reset inactivity timer on every update
      resetInactivityTimer();

      // Relay the data to the component
      callback(messages);
    });
  };

  const pauseAndStartPolling = () => {
    if (!isSubscriptionActive) return;

    log(
      'Inactivity timeout reached, pausing messages subscription and starting polling'
    );
    isSubscriptionActive = false;

    // Stop real-time snapshot
    if (unsubscribe) {
      unsubscribe();
      unsubscribe = null;
    }

    // Clear inactivity timer
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    // Start polling
    pollingIntervalId = setInterval(pollForNewMessages, POLLING_INTERVAL);
  };

  const pollForNewMessages = async () => {
    log('Polling for new messages...');
    const latestTimestamp = await getLatestMessageTimestamp(conversationId);

    if (!latestTimestamp) return;

    // If no previous timestamp recorded, use the one we just got and stay paused
    if (!lastMessageAt) {
      lastMessageAt = latestTimestamp;
      return;
    }

    // Check if there is a newer message
    if (latestTimestamp.toMillis() > lastMessageAt.toMillis()) {
      log('New message detected! Reactivating messages subscription');
      startSubscription();
    }
  };

  const resetInactivityTimer = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      pauseAndStartPolling();
    }, SUBSCRIPTION_TIMEOUT);
  };

  // Initial activation
  startSubscription();

  // Return cleanup function
  return () => {
    log('Cleaning up messages subscription and timers');
    if (unsubscribe) unsubscribe();
    if (timeoutId) clearTimeout(timeoutId);
    if (pollingIntervalId) clearInterval(pollingIntervalId);
  };
}
