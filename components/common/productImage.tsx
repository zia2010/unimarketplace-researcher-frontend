import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils/utils';

interface ProductImageProps {
  src: string;
  alt: string;
  classNames?: string;
}

export const ProductImage = ({ src, alt, classNames }: ProductImageProps) => {
  const [imgError, setImgError] = useState(false);
  const dummyImage = '/assets/broken-links-services.jpg';
  return (
    <Image
      src={imgError || !src ? dummyImage : src}
      alt={alt}
      width={300}
      height={300}
      className={cn('w-full h-full object-cover', classNames)}
      onError={() => setImgError(true)}
    />
  );
};
