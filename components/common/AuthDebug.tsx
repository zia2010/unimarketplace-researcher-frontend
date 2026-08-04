'use client';

import { useAuth } from '@/lib/auth/context/AuthContext';
import { useEffect } from 'react';

export function AuthDebug() {
  const { user, isHydrating, isLoggedIn } = useAuth();

  useEffect(() => {
    console.log('Auth Debug:', {
      isLoggedIn,
      user,
      userId: user?.id,
      isHydrating,
      timestamp: new Date().toISOString(),
      windowUser:
        typeof window !== 'undefined'
          ? localStorage.getItem('user')
          : 'no window',
      windowLoginState:
        typeof window !== 'undefined'
          ? localStorage.getItem('isLoggedIn')
          : 'no window',
    });
  }, [user, isHydrating]);

  return null;
}
