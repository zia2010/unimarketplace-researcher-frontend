import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export async function fetchInitialUnreadCount(userId: string) {
  const q = query(
    collection(db, 'conversations'),
    where('createdByUserId', '==', userId),
    where('unreadCountUser', '>', 0)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.reduce(
    (sum, doc) => sum + (doc.data().unreadCountUser || 0),
    0
  );
}
