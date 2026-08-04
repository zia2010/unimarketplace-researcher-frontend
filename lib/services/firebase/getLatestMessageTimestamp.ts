import { doc, getDoc } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore';

const db = getFirestore();

/**
 * Fetches the timestamp of the latest message for a specific conversation.
 * Polling the conversation document is more efficient than polling the messages subcollection.
 */
export async function getLatestMessageTimestamp(
  conversationId: string
): Promise<Timestamp | null> {
  if (!conversationId) return null;

  try {
    const docRef = doc(db, 'conversations', conversationId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data.lastMessageAt || null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching latest message timestamp:', error);
    return null;
  }
}
