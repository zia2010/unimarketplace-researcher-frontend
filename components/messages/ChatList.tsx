import React, { useState, useEffect, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';
import { subscribeToUserChatListWithTimeout } from '@/lib/services/firebase/subscribeToChatList';
import { en } from '@/lib/locales/en';
import { Conversation } from '@/types';
import { searchConversations } from '@/lib/services/firebase/searchChat';
import { ChatAvatar } from './ChatAvatar';

interface ChatListProps {
  userId: string;
  activeChatId?: string;
  onChatSelect: (conversation: Conversation) => void;
  onConversationsUpdate?: (conversations: Conversation[]) => void;
}

const formatTime = (
  timestamp: Timestamp | { toDate: () => Date } | Date | null | undefined
) => {
  if (!timestamp) return '';
  try {
    const date =
      timestamp instanceof Date
        ? timestamp
        : timestamp &&
            typeof timestamp === 'object' &&
            'toDate' in timestamp &&
            typeof timestamp.toDate === 'function'
          ? (timestamp as { toDate: () => Date }).toDate()
          : new Date(timestamp as unknown as string | number);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  } catch {
    return '';
  }
};

const ChatList: React.FC<ChatListProps> = ({
  userId,
  activeChatId,
  onChatSelect,
  onConversationsUpdate,
}) => {
  const [chats, setChats] = useState<Conversation[]>([]);
  const [filteredChats, setFilteredChats] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearch = useCallback(
    async (query: string) => {
      setSearchQuery(query);

      if (!query.trim()) {
        setFilteredChats(chats);
        setSearching(false);
        return;
      }

      setSearching(true);
      try {
        const results = await searchConversations(query);
        console.log('Search results:', results);
        setFilteredChats(results);
      } catch (error) {
        console.error('Search failed:', error);
        setFilteredChats(chats);
      } finally {
        setSearching(false);
      }
    },
    [userId, chats]
  );

  useEffect(() => {
    if (!userId) {
      setTimeout(() => setLoading(false), 0);
      return;
    }

    const unsubscribe = subscribeToUserChatListWithTimeout(
      userId,
      (updatedConversations: Conversation[]) => {
        setChats(updatedConversations);
        if (!searchQuery.trim()) {
          setFilteredChats(updatedConversations);
        }
        setLoading(false);
        onConversationsUpdate?.(updatedConversations);
      },
      () => {
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [userId, onChatSelect, onConversationsUpdate]);

  return (
    <div className='w-full md:w-[350px] bg-[#8EA3FA]/10 flex flex-col h-full'>
      <div className='p-6'>
        <h2 className='text-[#041B4B] text-[24px] font-bold mb-6'>
          {en.settingsPage.inbox}
        </h2>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search users...'
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className='w-full bg-white rounded-full py-2 px-4 pr-10 border-none outline-none text-[14px] shadow-sm'
          />
          {searching ? (
            <Loader2
              className='absolute right-3 top-2.5 text-[#1B56CC] animate-spin'
              size={18}
            />
          ) : (
            <Search
              className='absolute right-3 top-2.5 text-[#1B56CC]'
              size={18}
            />
          )}
        </div>
      </div>

      <div className='flex-1 overflow-y-auto px-3 no-scrollbar'>
        {loading && filteredChats.length === 0 && (
          <div className='flex justify-center p-8'>
            <Loader2 className='animate-spin text-[#1B56CC]' size={24} />
          </div>
        )}

        {!loading && filteredChats.length === 0 && (
          <div className='text-center p-8 text-[#667085] text-sm'>
            {searchQuery ? 'No conversations found' : 'No conversations yet'}
          </div>
        )}

        {filteredChats.map((chat) => (
          <div
            key={chat.conversationId}
            onClick={() => onChatSelect(chat)}
            className={`flex items-start gap-3 p-4 rounded-[12px] cursor-pointer mb-2 transition-all ${
              activeChatId === chat.conversationId
                ? 'bg-white shadow-md transform scale-[1.02]'
                : 'hover:bg-white/50'
            }`}
          >
            <ChatAvatar
              src={chat.universityLogo}
              name={chat.assignedStaffName}
              sizeClass='w-12 h-12'
              textClass='text-lg'
            />
            <div className='flex-1 min-w-0'>
              <div className='flex justify-between items-start mb-1'>
                <h3 className='text-[#101010] text-[15px] font-bold truncate pr-2'>
                  {chat.assignedStaffName || 'Staff not assigned'}
                </h3>
                <span className='text-[10px] text-[#98A2B3] shrink-0'>
                  {formatTime(chat.lastMessageAt)}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <p className='text-[#667085] text-[12px] line-clamp-1 leading-[1.4] pr-2'>
                  {chat.productName || 'Product not assigned'} -{' '}
                  {chat.lastMessage || 'No messages yet'}
                </p>
                {chat.unreadCountUser ? (
                  <div className='bg-[#1B56CC] text-white text-[10px] rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center font-bold'>
                    {chat.unreadCountUser}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
