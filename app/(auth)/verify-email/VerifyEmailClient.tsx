'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useSignIn } from '@/lib/hooks/useSignIn';
import Link from 'next/link';

export default function VerifyEmailClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const { verifyEmailToken, loading } = useSignIn();

  const hasRunRef = useRef(false);

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>(
    'verifying'
  );

  useEffect(() => {
    console.log(loading);
    if (!token) return;

    if (hasRunRef.current) return;
    hasRunRef.current = true;

    verifyEmailToken(token)
      .then(() => {
        setStatus('success');

        setTimeout(() => {
          router.replace('/login');
        }, 3000);
      })
      .catch(() => {
        setStatus('error');
      });
  }, [token]);

  return (
    <div className='flex min-h-screen items-center justify-center bg-white px-6'>
      <div className='w-full max-w-md text-center'>
        {status === 'verifying' && (
          <>
            <Loader2 className='mx-auto mb-4 h-10 w-10 animate-spin text-[#1B56CC]' />
            <h1 className="font-['Inter'] text-2xl font-semibold">
              Verifying your email
            </h1>
            <p className='mt-2 text-[#666666]'>
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className='mx-auto mb-4 h-10 w-10 text-green-600' />
            <h1 className="font-['Inter'] text-2xl font-semibold">
              Email verified successfully
            </h1>
            <p className='mt-2 text-[#666666]'>
              Your account is now active. Redirecting you to login…
            </p>
          </>
        )}

        {/* ERROR */}
        {status === 'error' && (
          <>
            <XCircle className='mx-auto mb-4 h-10 w-10 text-red-600' />
            <h1 className="font-['Inter'] text-2xl font-semibold">
              Verification failed
            </h1>
            <p className='mt-2 text-[#666666]'>
              The verification link is invalid or has expired.
            </p>
            <p className='mt-2 text-[#666666]'>
              You can start verification process again by visiting the{' '}
              <Link href='/forgot-password'>forgot password</Link> page or
            </p>

            <button
              onClick={() => router.push('/login', { scroll: true })}
              className='mt-6 h-12 w-full rounded-xl bg-[#1B56CC] text-white! hover:bg-[#1B56CC]/90'
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
