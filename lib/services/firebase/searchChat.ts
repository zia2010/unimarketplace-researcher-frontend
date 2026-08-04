import { db } from '@/lib/firebase/config';
import { Conversation } from '@/types';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { auth } from '@/lib/firebase/config';

export async function searchConversations(
  searchQuery: string
): Promise<Conversation[]> {
  if (!auth.currentUser) {
    throw new Error('Not authenticated');
  }

  if (!searchQuery.trim()) {
    return [];
  }

  const conversationsRef = collection(db, 'conversations');

  // Query for assigned conversations
  const assignedQ = query(
    conversationsRef,
    where('userId', '==', auth.currentUser.uid),
    orderBy('lastMessageAt', 'desc')
  );

  const assignedSnapshot = await getDocs(assignedQ);
  const assignedConversations = assignedSnapshot.docs.map(
    (doc) =>
      ({
        conversationId: doc.id,
        ...doc.data(),
      }) as Conversation
  );

  // Combine and filter conversations based on search query
  const allConversations = [...assignedConversations];
  const searchLower = searchQuery.toLowerCase().trim();

  return allConversations.filter((conversation) => {
    const userName = (conversation.name || '').toLowerCase();
    const lastMessage = (conversation.lastMessage || '').toLowerCase();
    const staffName = (conversation.assignedStaffName || '').toLowerCase();

    return (
      userName.includes(searchLower) ||
      lastMessage.includes(searchLower) ||
      staffName.includes(searchLower)
    );
  });
}
