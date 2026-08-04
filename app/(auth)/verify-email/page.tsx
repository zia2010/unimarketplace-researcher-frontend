import { Suspense } from 'react';
import VerifyEmailClient from './VerifyEmailClient';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailClient />
    </Suspense>
  );
}

function VerifyEmailFallback() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-white'>
      <p className='text-gray-600'>Preparing verification…</p>
    </div>
  );
}
