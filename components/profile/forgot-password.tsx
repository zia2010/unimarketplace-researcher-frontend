'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';
import { authApi } from '@/lib/services/api/auth.api';
import { App } from 'antd';
import { ProductImage } from '../common/productImage';

export default function ForgotPassword() {
  const { message } = App.useApp();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      handleForgotPassword();
      setIsSubmitted(true);
      message.success('Reset Password email sent, Please check you email');
    } catch (error) {
      console.error('Failed to send reset email:', error);
      message.error('Cant send reset password email, Contact Support');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setIsLoading(true);
    try {
      await authApi.forgotPassword({ email, user: 'user' });
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Failed to resend email:', error);
      throw new Error();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen w-full bg-white'>
      <div className='flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-[82px]'>
        <div className='mx-auto flex w-full max-w-[568px] flex-col'>
          {!isSubmitted ? (
            <>
              <div className='mb-8'>
                <h1 className="font-['Inter'] text-3xl font-semibold text-[#111111] mb-3">
                  Forgot Password
                </h1>
                <p className="font-['Inter'] text-base text-[#666666]">
                  Enter your email address and we&apos;ll send you instructions
                  to reset your password
                </p>
              </div>

              <div className='flex flex-col gap-[18px]'>
                <div className='flex flex-col gap-1'>
                  <label className="font-['Inter'] text-base text-[#666666]">
                    Email Address
                  </label>
                  <div className='relative'>
                    <input
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder='your.email@example.com'
                      className='h-14 w-full rounded-xl border border-[#666666]/35 px-4 pr-12 outline-none focus:border-[#1B56CC]'
                    />
                    <Mail className='absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#666666]/50' />
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    const formEvent = {
                      preventDefault: () => {},
                    } as React.FormEvent<HTMLFormElement>;
                    handleSubmit(formEvent);
                  }}
                  disabled={isLoading || !email}
                  className='h-16 w-full rounded-[17px] bg-[#1B56CC] text-xl font-semibold text-white! transition hover:bg-[#1B56CC]/90 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-4'
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>

              <div className='mt-6 flex flex-col gap-4'>
                <div className='flex items-center justify-center gap-2'>
                  <span className="font-['Inter'] text-base text-[#333333]">
                    Remember your password?
                  </span>
                  <Link
                    href='/login'
                    className="font-['Inter'] text-base font-semibold text-[#1B56CC] hover:text-[#1B56CC]/80"
                  >
                    Back to Login
                  </Link>
                </div>

                <div className='flex items-center justify-center gap-2'>
                  <span className="font-['Inter'] text-base text-[#333333]">
                    Don&apos;t have an account?
                  </span>
                  <Link
                    href='/signup'
                    className="font-['Inter'] text-base font-semibold text-[#333333] hover:text-[#1B56CC]"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>

              <Link
                href='/'
                className='flex items-center justify-center gap-2 text-[#1B56CC] hover:text-[#1B56CC]/80 transition-colors mt-8 w-full'
              >
                <ArrowLeft className='h-5 w-5' />
                <span className="font-['Inter'] text-base font-semibold">
                  Back to Home
                </span>
              </Link>
            </>
          ) : (
            <div className='flex flex-col items-center text-center'>
              <div className='mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100'>
                <Mail className='h-10 w-10 text-green-600' />
              </div>

              <h2 className="font-['Inter'] text-2xl font-semibold text-[#111111] mb-3">
                Check Your Email
              </h2>

              <p className="font-['Inter'] text-base text-[#666666] mb-8 max-w-md">
                We&apos;ve sent password reset instructions to{' '}
                <strong>{email}</strong>. Please check your inbox and follow the
                link to reset your password.
              </p>

              <div className='flex flex-col gap-3 w-full'>
                <Link
                  href='/login'
                  className='h-14 w-full rounded-[17px] bg-[#1B56CC] text-lg font-semibold text-white transition hover:bg-[#1B56CC]/90 flex items-center justify-center'
                >
                  Back to Login
                </Link>

                <button
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className='h-14 w-full rounded-[17px] border-2 border-[#1B56CC] text-lg font-semibold text-[#1B56CC] transition hover:bg-[#1B56CC]/5 disabled:opacity-50'
                >
                  {isLoading ? 'Sending...' : 'Resend Email'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='relative hidden w-1/2 lg:block'>
        <ProductImage
          src='/assets/loginbanner.png'
          alt='Login Banner'
          classNames='object-cover'
        />
        <div className='absolute inset-0 bg-black/25' />
        <div className='absolute left-[72px] top-1/2 flex w-[551px] -translate-y-1/2 items-center'>
          <h1 className="font-['Inter'] text-[40px] font-semibold leading-[47px] text-white">
            Reset your password and get back to discovering research resources
          </h1>
        </div>
      </div>
    </div>
  );
}
