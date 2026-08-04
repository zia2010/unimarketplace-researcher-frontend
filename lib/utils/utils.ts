import { ResourceResponse } from '@/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getResourceDisplayType = (item: ResourceResponse) => {
  const baseType = item.type === 'service' ? 'Service' : 'Equipment';
  if (item.tags?.includes('Subscription')) {
    return `${baseType} - Subscription`;
  }
  return baseType;
};
