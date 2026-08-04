import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import { Conversation } from '@/types';

export async function createConversation(
  universityId: string,
  name: string,
  productId?: string,
  productName?: string,
  universityName?: string,
  universityLogo?: string,
  userProfilePicture?: string
) {
  if (!auth.currentUser) {
    throw new Error('Not authenticated');
  }

  const conversationsRef = collection(db, 'conversations');
  const q = query(
    conversationsRef,
    where('createdByUserId', '==', auth.currentUser.uid),
    where('universityId', '==', universityId),
    where('productId', '==', productId)
  );

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const conversations = querySnapshot.docs.map(
      (doc) =>
        ({
          conversationId: doc.id,
          ...doc.data(),
        }) as Conversation
    );
    conversations.sort(
      (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
    );

    const existingConversation = conversations[0];
    return existingConversation.conversationId;
  }

  const ref = await addDoc(collection(db, 'conversations'), {
    createdByUserId: auth.currentUser.uid,
    universityId,

    assignedStaffId: null,
    assignedStaffName: null,

    productId,
    productName,
    universityName,

    status: 'open',

    lastMessage: '',
    lastMessageAt: serverTimestamp(),
    createdAt: serverTimestamp(),

    name,
    userProfilePicture,
    universityLogo,
  });

  console.log('✅ Conversation created:', ref.id);
  return ref.id;
}

export async function markConversationAsRead(conversationId: string) {
  const conversationRef = doc(db, 'conversations', conversationId);

  await updateDoc(conversationRef, {
    unreadCountUser: 0,
  });
}
