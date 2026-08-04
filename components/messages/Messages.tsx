'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { Conversation } from '@/types';
import { useAuth } from '@/lib/auth/context/AuthContext';
import { App as AntdApp } from 'antd';

export interface UserWithUni {
  university?: { id: string };
  universityId?: string;
  uniId?: string;
  id?: string;
}

const Messages = () => {
  const { user, firebaseSignIn } = useAuth();
  const searchParams = useSearchParams();
  const conversationIdFromUrl = searchParams.get('conversationId');
  // const typedUser = user as unknown as UserWithUni;
  const [showChatWindow, setShowChatWindow] = useState(!!conversationIdFromUrl);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | undefined>(
    conversationIdFromUrl || undefined
  );

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

  // useEffect(() => {
  //   console.log(firebaseUserData, 'this is data ');
  // }, [firebaseUserData]);

  const handleChatSelect = useCallback((chat: Conversation) => {
    setActiveChatId(chat.conversationId);
    setShowChatWindow(true);
  }, []);

  const handleBackToList = useCallback(() => {
    setShowChatWindow(false);
  }, []);

  const handleConversationsUpdate = useCallback(
    (updatedConversations: Conversation[]) => {
      setConversations(updatedConversations);
      setActiveChatId((prevId) => {
        if (!prevId && updatedConversations.length > 0) {
          return updatedConversations[0].conversationId;
        }
        return prevId;
      });
    },
    []
  );

  const activeChat = conversations.find(
    (chat) => chat.conversationId === activeChatId
  );

  return (
    <AntdApp>
      <div className='overflow-hidden flex flex-col'>
        {/* <div className='px-8 shrink-0'>
          <GlobalSearch />
        </div> */}
        <div className='md:mt-4 md:mx-2 flex flex-col'>
          <div className='flex border border-[#EAECF0] rounded-[16px] overflow-hidden bg-white shadow-sm h-[calc(100vh-176px)] md:h-[calc(100vh-196px)]'>
            <div
              className={`w-full md:w-[350px] ${showChatWindow ? 'hidden md:block' : 'block'}`}
            >
              <ChatList
                userId={user?.id ?? ''}
                activeChatId={activeChatId}
                onChatSelect={handleChatSelect}
                onConversationsUpdate={handleConversationsUpdate}
              />
            </div>
            <div
              className={`flex-1 ${showChatWindow ? 'block' : 'hidden md:block'}`}
            >
              <ChatWindow conversation={activeChat} onBack={handleBackToList} />
            </div>
          </div>
        </div>
      </div>
    </AntdApp>
  );
};

export default Messages;
