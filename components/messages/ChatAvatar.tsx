import React from 'react';
import { ProductImage } from '../common/productImage';

interface ChatAvatarProps {
  src?: string | null;
  name?: string | null;
  sizeClass?: string;
  className?: string;
  textClass?: string;
}

const cdnUrl: string = process.env.NEXT_PUBLIC_CF_URL ?? '';

export const ChatAvatar: React.FC<ChatAvatarProps> = ({
  src,
  name,
  sizeClass = 'w-10 h-10',
  className = '',
  textClass = '',
}) => {
  const imageUrl: string = src
    ? src?.startsWith('http')
      ? src
      : cdnUrl + src
    : '';
  return (
    <div
      className={`${sizeClass} rounded-full bg-[#1B56CC] flex items-center justify-center text-white font-bold shrink-0 ${className}`}
    >
      {src ? (
        <ProductImage
          src={imageUrl}
          alt={name || 'Avatar'}
          classNames='outline-[1px] outline-[#4E7AF7] rounded-full'
        />
      ) : (
        <span className={textClass}>
          {name?.charAt(0).toUpperCase() || '?'}
        </span>
      )}
    </div>
  );
};
