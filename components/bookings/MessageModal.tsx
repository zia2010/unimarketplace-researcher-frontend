import { useEffect, useState } from 'react';
import { Modal, message as antMessage } from 'antd';
import { Loader2, Send } from 'lucide-react';
import { createConversation } from '@/lib/services/firebase/chatService';
import { sendMessage } from '@/lib/services/firebase/sendMessageService';
import { useAuth } from '@/lib/auth/context/AuthContext';
import { storage } from '@/lib/services/storage';
import { useRouter } from 'next/navigation';
import {
  containsEmail,
  containsLink,
  containsPhone,
  containsProfanity,
} from '@/lib/utils/profanity';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  universityId: string;
  resourceId?: string;
  resourceName?: string;
  universityName?: string;
  universityLogo?: string;
  userProfilePicture?: string;
}

const cdnUrl: string = process.env.NEXT_PUBLIC_CF_URL ?? '';

const MessageModal = ({
  isOpen,
  onClose,
  userId,
  universityId,
  resourceId,
  resourceName,
  universityName,
  universityLogo,
  userProfilePicture,
}: MessageModalProps) => {
  const [messageText, setMessageText] = useState('');
  const { firebaseSignIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user: authUser } = useAuth();

  useEffect(() => {
    const initFirebase = async () => {
      try {
        await firebaseSignIn();
      } catch (error) {
        console.error('Failed to sign in to Firebase:', error);
      }
    };
    initFirebase();
  }, []);

  const handleSend = async () => {
    if (!messageText.trim()) return;

    if (containsEmail(messageText)) {
      antMessage.error('Sharing email addresses is not allowed.');
      return;
    }

    if (containsPhone(messageText)) {
      antMessage.error('Sharing phone numbers is not allowed.');
      return;
    }

    if (containsLink(messageText)) {
      antMessage.error('Sending links is not allowed.');
      return;
    }

    if (containsProfanity(messageText)) {
      antMessage.error('Inappropriate language is not allowed.');
      return;
    }

    try {
      setLoading(true);
      console.log(userId, '--------', universityId, 'this is univeristy');
      if (!userId || !universityId) {
        antMessage.error(
          'Cannot create conversation: Missing essential details for conversation.'
        );
        return;
      }

      const user = storage.getUser<{ firstName?: string; id: string }>();
      const userName = user?.firstName || 'user' + user?.id;
      userProfilePicture = `${cdnUrl}${authUser?.profilePicture}`;

      const conversationId = await createConversation(
        universityId,
        userName,
        resourceId,
        resourceName,
        universityName,
        universityLogo,
        userProfilePicture
      );

      await sendMessage(conversationId, messageText, 'user');

      antMessage.success('Message sent');
      setMessageText('');
      onClose();

      // Redirect to messages page with the conversation ID
      router.push(`/messages?conversationId=${conversationId}`, {
        scroll: true,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
      antMessage.error('Failed to send message');
    } finally {
      setLoading(false);
    }
    // console.log(messageText);
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      title={
        <h3 className='text-[20px] font-bold text-[#101828]'>
          Send a message to university
        </h3>
      }
      centered
      width={600}
    >
      <div className='mt-6 border border-[#E4E7EC] rounded-xl p-4 relative min-h-[300px] flex flex-col'>
        <textarea
          className='w-full flex-1 resize-none outline-none text-[#101828] placeholder:text-[#98A2B3] text-base'
          placeholder='Hey I am interested in renting this equipment'
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          disabled={loading}
        />
        <div className='flex justify-end mt-4'>
          <button
            onClick={handleSend}
            disabled={loading || !messageText.trim()}
            className='bg-[#1652C9] hover:bg-[#1242a3] disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors flex items-center justify-center'
          >
            {loading ? (
              <Loader2 size={20} className='animate-spin ml-0.5' />
            ) : (
              <Send size={25} className='ml-0.5 text-white' />
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MessageModal;
