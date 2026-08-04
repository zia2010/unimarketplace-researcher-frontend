'use client';

import Link from 'next/link';
import { MailCheck, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSignIn } from '@/lib/hooks/useSignIn';

const RESEND_COOLDOWN = 30;

export default function SignupSuccessClient() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const { resendEmail } = useSignIn();

  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email || cooldown > 0) return;

    try {
      setIsSending(true);
      await resendEmail(email);
      setSent(true);
      setCooldown(RESEND_COOLDOWN);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className='flex min-h-screen w-full bg-white'>
      <div className='flex w-full flex-col justify-center px-8 lg:px-[82px]'>
        <div className='mx-auto flex w-full max-w-[520px] flex-col items-center text-center'>
          {/* Icon */}
          <div className='mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#1B56CC]/10'>
            <MailCheck className='h-10 w-10 text-[#1B56CC]' />
          </div>

          {/* Title */}
          <h1 className="font-['Inter'] text-3xl font-semibold text-[#111111]">
            Verify your email
          </h1>

          {/* Description */}
          <p className="mt-4 max-w-md font-['Inter'] text-base text-[#666666]">
            We’ve sent a verification link to{' '}
            <span className='font-medium'>{email}</span>.
            <br />
            Please verify your account before logging in.
          </p>

          {/* Resend section */}
          <p className="mt-3 font-['Inter'] text-sm text-[#999999]">
            Didn’t receive the email? Check your spam folder or
          </p>

          <button
            onClick={handleResend}
            disabled={cooldown > 0 || isSending || !email}
            className={`mt-2 flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition
              ${
                cooldown > 0 || isSending
                  ? 'cursor-not-allowed text-gray-400'
                  : 'text-[#1B56CC] hover:underline'
              }`}
          >
            {isSending && <Loader2 className='h-4 w-4 animate-spin' />}
            {cooldown > 0
              ? `Resend email in ${cooldown}s`
              : sent
                ? 'Resend verification email'
                : 'Resend verification email'}
          </button>

          {/* Login CTA */}
          <Link
            href='/login'
            className='mt-10 flex h-14 w-[280px] items-center justify-center rounded-2xl bg-[#1B56CC] text-lg text-white transition hover:bg-[#1B56CC]/90'
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
