import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

const db = getFirestore();

/**
 * Fetches the timestamp of the latest message for a specific user.
 * Used for polling during paused state of real-time subscription.
 */
export async function getLatestConversation(
  userId: string
): Promise<Timestamp | null> {
  if (!userId) return null;

  try {
    const q = query(
      collection(db, 'conversations'),
      where('createdByUserId', '==', userId),
      orderBy('lastMessageAt', 'desc'),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const latestDoc = querySnapshot.docs[0].data();
    return latestDoc.lastMessageAt || null;
  } catch (error) {
    console.error('Error fetching latest conversation:', error);
    return null;
  }
}
