'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useSignIn } from '@/lib/hooks/useSignIn';
import { storage } from '@/lib/services/storage';
import { authApi } from '@/lib/services/api/auth.api';
import { cookieService } from '@/lib/services/cookie.service';
import { message } from 'antd';

export default function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { googleAuthCallback } = useSignIn();
  const hasAttemptedAuth = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasAttemptedAuth.current) return;

    const handleGoogleAuth = async () => {
      hasAttemptedAuth.current = true;
      const token = searchParams.get('token');

      if (!token) {
        router.replace('/');
        return;
        ``;
      }

      cookieService.setAccessToken(token);
      authApi.setAccessToken(token);

      try {
        // Authenticate and get user profile
        const user = await googleAuthCallback(token);

        // Check if user role is staff, moderator, or admin
        const blockedRoles = ['staff', 'moderator', 'admin'];
        if (user && blockedRoles.includes(user.role.toLowerCase())) {
          // Call logout API to clear backend session and local storage
          await authApi.logout();

          // Clear local data
          storage.clear();
          cookieService.removeAccessToken();

          // Show error message
          message.error(
            'Access denied. Only staff and moderator accounts can log in here'
          );

          // Redirect back to login
          router.replace('/login');
          return;
        }

        // User role is valid, proceed with login
        storage.setLoginState();
        router.replace('/home');
      } catch (error) {
        router.replace('/');
      }
    };

    handleGoogleAuth();
  }, [searchParams, router, googleAuthCallback]);

  return (
    <div className='flex h-screen w-full items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <Loader2 className='mx-auto h-10 w-10 animate-spin text-[#1B56CC]' />
        <p className='mt-4 text-gray-600'>Authenticating...</p>
      </div>
    </div>
  );
}
