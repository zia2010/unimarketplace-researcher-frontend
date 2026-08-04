import { Suspense } from 'react';
import AuthCallbackClient from './AuthCallbackClient';

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackFallback />}>
      <AuthCallbackClient />
    </Suspense>
  );
}

function AuthCallbackFallback() {
  return (
    <div className='flex h-screen w-full items-center justify-center bg-gray-50'>
      <div className='text-center'>
        <p className='text-gray-600'>Preparing authentication…</p>
      </div>
    </div>
  );
}
