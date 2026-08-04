import { Conversation } from '@/types';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { getLatestConversation } from './getLatestConversation';

const db = getFirestore();

export function subscribeToUserChatList(
  userId: string,
  callback: (conversations: Conversation[]) => void,
  onError?: (error: Error) => void
) {
  if (!userId) {
    if (onError) onError(new Error('User ID is required'));
    return () => {};
  }

  const q = query(
    collection(db, 'conversations'),
    where('createdByUserId', '==', userId),
    orderBy('lastMessageAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const conversations = snapshot.docs.map((doc) => ({
        conversationId: doc.id,
        ...doc.data(),
      }));

      callback(conversations as Conversation[]);
    },
    (error) => {
      console.error('Error in chat list subscription:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Enhanced subscription that pauses after 5 minutes of inactivity
 * and resumes when new messages are detected via 30s polling.
 */
export function subscribeToUserChatListWithTimeout(
  userId: string,
  callback: (conversations: Conversation[]) => void,
  onError?: (error: Error) => void
) {
  // const SUBSCRIPTION_TIMEOUT = 100000; // 100 seconds
  const SUBSCRIPTION_TIMEOUT = 300000; // 5 minutes
  const POLLING_INTERVAL = 30000; // 30 seconds
  const ENABLE_DEBUG_LOGS = true;

  let unsubscribe: (() => void) | null = null;
  let timeoutId: NodeJS.Timeout | null = null;
  let pollingIntervalId: NodeJS.Timeout | null = null;
  let lastMessageTimestamp: Timestamp | null = null;
  let isSubscriptionActive = false;

  let lastActivationTime = 0;

  const log = (message: string) => {
    if (ENABLE_DEBUG_LOGS) {
      const now = Date.now();
      const timeSinceActivation = lastActivationTime
        ? `[+${((now - lastActivationTime) / 1000).toFixed(1)}s]`
        : '';
      console.log(`[Chat Subscription] ${timeSinceActivation} ${message}`);
    }
  };

  const startSubscription = () => {
    if (isSubscriptionActive) return;

    lastActivationTime = Date.now();
    log(`Activating subscription for user: ${userId}`);
    isSubscriptionActive = true;

    // Clear polling if active
    if (pollingIntervalId) {
      clearInterval(pollingIntervalId);
      pollingIntervalId = null;
    }

    unsubscribe = subscribeToUserChatList(
      userId,
      (conversations) => {
        // Update last message timestamp for polling comparison
        if (conversations.length > 0) {
          const latest = conversations[0].lastMessageAt;
          lastMessageTimestamp = latest;
        }

        // Reset inactivity timer on every update
        resetInactivityTimer();

        // Relay the data to the component
        callback(conversations);
      },
      (error) => {
        console.error('[Chat Subscription] Error:', error);
        if (onError) onError(error);
      }
    );
  };

  const pauseAndStartPolling = () => {
    if (!isSubscriptionActive) return;

    log(
      'Inactivity timeout reached, pausing subscription and starting polling'
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
    const latestTimestamp = await getLatestConversation(userId);

    if (!latestTimestamp) return;

    // If no previous timestamp recorded, use the one we just got and stay paused
    if (!lastMessageTimestamp) {
      lastMessageTimestamp = latestTimestamp;
      return;
    }

    // Check if there is a newer message
    if (latestTimestamp.toMillis() > lastMessageTimestamp.toMillis()) {
      log('New message detected! Reactivating subscription');
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

    log('Inactivity timer reset');
  };

  // Initial activation
  startSubscription();

  // Return cleanup function
  return () => {
    log('Cleaning up subscription and timers');
    if (unsubscribe) unsubscribe();
    if (timeoutId) clearTimeout(timeoutId);
    if (pollingIntervalId) clearInterval(pollingIntervalId);
  };
}
