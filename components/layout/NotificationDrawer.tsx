'use client';

import { Check, FileText, Star, MessageSquare } from 'lucide-react';
import { Drawer, Button } from 'antd';
import Link from 'next/link';
import { useState } from 'react';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  link: string;
  type: 'approval' | 'message' | 'system' | 'review';
}

const dummyNotifications: Notification[] = [
  {
    id: '1',
    title: 'Approved',
    description:
      'Your request for Chemical Lab service at IIT Gandhinagar has been approved',
    time: '2 mins ago',
    read: false,
    link: '/bookings',
    type: 'approval',
  },
  {
    id: '2',
    title: 'Message',
    description:
      'You have a message from Dr. Sathya Gupta, Lab Director, IIT Gandhinagar',
    time: '1 hour ago',
    read: false,
    link: '/messages',
    type: 'message',
  },
  {
    id: '3',
    title: 'Tell us your experience about your recent booking',
    description: 'Drop your ratings on your recent bookings',
    time: '2 days ago',
    read: true,
    link: '/bookings',
    type: 'review',
  },
];

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRating: () => void;
}

export default function NotificationDrawer({
  isOpen,
  onClose,
  onOpenRating,
}: NotificationDrawerProps) {
  const [notifications, setNotifications] =
    useState<Notification[]>(dummyNotifications);

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (
    e: React.MouseEvent,
    notification: Notification
  ) => {
    if (notification.type === 'review') {
      e.preventDefault();
      onClose();
      onOpenRating();
    } else {
      onClose();
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'approval':
        return (
          <div className='text-[#1B56CC]'>
            <Check className='w-5 h-5' />
          </div>
        );
      case 'message':
        return (
          <div className='text-[#1B56CC]'>
            <MessageSquare className='w-5 h-5' />
          </div>
        );
      case 'review':
        return (
          <div className='text-[#1B56CC]'>
            <Star className='w-5 h-5 fill-current' />
          </div>
        );
      default:
        return (
          <div className='text-[#1B56CC]'>
            <FileText className='w-5 h-5' />
          </div>
        );
    }
  };

  return (
    <Drawer
      title='Notifications'
      placement='right'
      onClose={onClose}
      open={isOpen}
      size='large'
      extra={
        <Button
          type='text'
          onClick={handleClearAll}
          className='text-[#1B56CC] hover:text-[#1B56CC]/80'
        >
          Clear all
        </Button>
      }
    >
      <div className='flex flex-col gap-0'>
        {notifications.length === 0 ? (
          <div className='text-center text-gray-500 py-10'>
            No notifications
          </div>
        ) : (
          notifications.map((notification, index) => (
            <Link
              href={notification.link}
              key={notification.id}
              onClick={(e) => handleNotificationClick(e, notification)}
              className={`flex gap-4 p-4 hover:bg-gray-50 transition-colors ${
                index !== notifications.length - 1
                  ? 'border-b border-gray-100'
                  : ''
              }`}
            >
              <div className='mt-1 shrink-0'>{getIcon(notification.type)}</div>
              <div className='flex flex-col gap-1'>
                <div className='flex justify-between items-start'>
                  <span className={`font-semibold text-[#1B56CC] text-[16px]`}>
                    {notification.title}
                  </span>
                </div>
                <p className='text-[#041B4B] text-[14px] leading-snug'>
                  {notification.description}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </Drawer>
  );
}
