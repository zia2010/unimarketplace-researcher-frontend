import { Suspense } from 'react';
import SignupSuccessClient from './SignupSuccessClient';

export default function SignupSuccessPage() {
  return (
    <Suspense fallback={<SignupSuccessFallback />}>
      <SignupSuccessClient />
    </Suspense>
  );
}

function SignupSuccessFallback() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-white'>
      <p className='text-gray-600'>Preparing verification…</p>
    </div>
  );
}
