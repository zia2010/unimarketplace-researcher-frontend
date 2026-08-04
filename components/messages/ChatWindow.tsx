import React, { useState, useEffect, useRef } from 'react';
import { Info, Send, Loader2, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Conversation, ChatMessage } from '@/types';
import { App, Button, Tooltip } from 'antd';
import {
  sendMessage,
  subscribeToMessagesWithTimeout,
} from '@/lib/services/firebase/sendMessageService';
import {
  containsEmail,
  containsLink,
  containsPhone,
  containsProfanity,
} from '@/lib/utils/profanity';
import { markConversationAsRead } from '@/lib/services/firebase/chatService';
import { en } from '@/lib/locales/en';
import { useAuth } from '@/lib/auth/context/AuthContext';
import { ChatAvatar } from './ChatAvatar';
import { useMutation } from '@tanstack/react-query';
import { userApi } from '@/lib/services/api/user.api';
import { AxiosError } from 'axios';
import ReportModal, { ReportPayload } from './ReportModal';

interface ChatWindowProps {
  conversation?: Conversation;
  onBack?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ conversation, onBack }) => {
  const { message } = App.useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const saveMutation = useMutation({
    mutationFn: async (payload: ReportPayload) => {
      if (!conversation?.createdByUserId || !conversation?.assignedStaffId)
        throw new Error('Please try again sometime ids missing');
      return userApi.reportUser(
        payload,
        conversation?.createdByUserId,
        conversation?.assignedStaffId
      );
    },
    onSuccess: () => {
      message.success('Reported user, your request will be reviewed shortly.');
      setIsModalOpen(false);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      message.error(
        error?.response?.data?.message || 'Failed to update booking'
      );
    },
  });

  // Subscribe to messages
  useEffect(() => {
    if (!conversation?.conversationId) {
      setMessages([]);
      return;
    }

    setLoading(true);

    const unsubscribe = subscribeToMessagesWithTimeout(
      conversation.conversationId,
      (msgs) => {
        setMessages(msgs);
        setLoading(false);
      }
    );

    // Mark as read when conversation is opened
    markConversationAsRead(conversation.conversationId);

    return () => unsubscribe();
  }, [conversation?.conversationId]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !conversation?.conversationId || sending) return;

    if (containsEmail(newMessage)) {
      message.error('Sharing email addresses is not allowed.');
      return;
    }

    if (containsPhone(newMessage)) {
      message.error('Sharing phone numbers is not allowed.');
      return;
    }

    if (containsLink(newMessage)) {
      message.error('Sending links is not allowed.');
      return;
    }

    if (containsProfanity(newMessage)) {
      message.error('Inappropriate language is not allowed.');
      return;
    }

    setSending(true);
    try {
      await sendMessage(conversation.conversationId, newMessage, 'user');
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  if (!conversation) {
    return (
      <div className='flex-1 flex items-center justify-center bg-white'>
        <p className='text-[#667085] text-[16px]'>
          {en.settingsPage.selectChat}
        </p>
      </div>
    );
  }

  return (
    <div className='flex-1 flex flex-col bg-white h-full'>
      {/* Header */}
      <div className='p-6 border-b border-[#F2F4F7] flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10'>
        <div className='flex items-center gap-3'>
          {onBack && (
            <div className='md:hidden'>
              <Button
                variant='text'
                color='default'
                onClick={onBack}
                className='text-[#1B56CC]'
              >
                <ArrowLeft />
              </Button>
            </div>
          )}
          <ChatAvatar
            src={conversation.universityLogo}
            name={conversation.assignedStaffName}
            sizeClass='w-10 h-10'
          />
          <div>
            <h2 className='text-[#101010] text-[18px] font-bold'>
              {conversation.assignedStaffName || conversation.productName}
            </h2>
            <span className='text-[12px] text-muted-foreground font-medium flex items-center'>
              {!conversation.assignedStaffName
                ? ''
                : conversation.productName +
                  ' - ' +
                  conversation.universityName}
            </span>
          </div>
        </div>
        <div className='flex gap-3'>
          <Tooltip title='Report this user'>
            <ShieldAlert
              className='text-red-500 cursor-pointer hover:text-red-600 transition-colors'
              size={22}
              onClick={() => setIsModalOpen(true)}
            />
          </Tooltip>
          <Tooltip
            title='This is your chat inbox, Left panel shows all your active conversations. Click a chat to view messages, reply to users, and manage unread conversations.'
            placement='right'
          >
            <Info
              className='text-[#1B56CC] cursor-pointer hover:text-[#1652C9] transition-colors'
              size={24}
            />
          </Tooltip>
        </div>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-[#F9FAFB] no-scrollbar'>
        {loading ? (
          <div className='flex-1 flex items-center justify-center'>
            <Loader2 className='animate-spin text-[#1B56CC]' size={32} />
          </div>
        ) : messages.length === 0 ? (
          <div className='flex-1 flex flex-col items-center justify-center text-[#667085] gap-2'>
            <div className='w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm'>
              <Send size={24} className='text-[#98A2B3]' />
            </div>
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderRole === 'user';
            return (
              <div
                key={msg.id || index}
                className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {!isMe && (
                  <ChatAvatar
                    src={conversation?.universityLogo}
                    name={conversation?.assignedStaffName}
                    sizeClass='w-8 h-8'
                    textClass='text-xs'
                  />
                )}
                {isMe && (
                  <ChatAvatar
                    src={user?.profilePicture}
                    name={conversation?.name}
                    sizeClass='w-8 h-8'
                    textClass='text-xs'
                    className='bg-[#4E7AF7]'
                  />
                )}
                <div
                  className={`flex flex-col gap-1 max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`p-4 rounded-[16px] text-[14px] leading-[1.5] shadow-sm ${
                      isMe
                        ? 'bg-[#1B56CC] text-white rounded-br-none'
                        : 'bg-white border border-[#EAECF0] text-[#101010] rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className='text-[#98A2B3] text-[10px]'>
                    {msg.createdAt?.toDate
                      ? msg.createdAt.toDate().toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Sending...'}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className='p-6 bg-white border-t border-[#F2F4F7]'>
        <form
          onSubmit={handleSendMessage}
          className='relative flex items-center gap-2'
        >
          <input
            type='text'
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={en.settingsPage.typeMessage}
            className='w-full border border-[#D1D5DB] rounded-[16px] py-4 px-6 pr-16 outline-none text-[14px] focus:border-[#1B56CC] transition-colors shadow-sm'
            disabled={sending}
          />
          <button
            type='submit'
            className='absolute right-2 bg-[#1B56CC] text-white p-3 rounded-[12px] hover:bg-[#1652C9] transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-md'
            disabled={!newMessage.trim() || sending}
          >
            {sending ? (
              <Loader2 className='animate-spin' size={20} />
            ) : (
              <Send size={20} />
            )}
          </button>
        </form>
      </div>
      <ReportModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        saveMutation={saveMutation}
      />
    </div>
  );
};

export default ChatWindow;
