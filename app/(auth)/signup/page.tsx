'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useSignIn } from '@/lib/hooks/useSignIn';
import { authApi } from '@/lib/services/api/auth.api';
import { GoogleIcon } from '../login/page';
import { roboto } from '@/lib/theme/fonts';
import { App as AntdApp } from 'antd';
import { isError } from '@/lib/utils/error.util';
import { ProductImage } from '@/components/common/productImage';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,24}$/;

export default function SignupPage() {
  const { message: antMessage } = AntdApp.useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string | null>(null);

  const { signUp } = useSignIn();

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError(null);
  };

  const validateForm = () => {
    if (!PASSWORD_REGEX.test(form.password)) {
      return 'Password must be 8–24 chars with uppercase, lowercase, number & special character';
    }

    if (form.password !== form.confirmPassword) {
      return 'Passwords do not match';
    }

    return null;
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setError(null);

      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }

      await signUp({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
    } catch (error) {
      const errorMessage = isError(error) ? error.message : 'Failed to signup';
      console.error('Failed :', error);
      antMessage.error(errorMessage);
    }
  };

  return (
    <AntdApp>
      <div className='flex min-h-screen w-full bg-white'>
        {/* LEFT */}
        <div className='flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-[82px]'>
          <div className='mx-auto flex w-full max-w-[568px] flex-col'>
            {/* Brand Heading */}
            <div className='mb-8 flex flex-col gap-3 text-center select-none'>
              <h1
                className='tracking-tight text-[#3b82f6] font-bold whitespace-nowrap shrink-100'
                style={{
                  fontSize: 'clamp(32px, 6vw, 42px)',
                }}
              >
                Rent-O-Infra
              </h1>
              <h2
                className="font-['Inter'] text-[#111111] font-bold"
                style={{
                  fontSize: 'clamp(26px, 4.5vw, 32px)',
                }}
              >
                Create your account
              </h2>
              <p
                className="font-['Inter'] text-[#666666] font-normal leading-relaxed"
                style={{
                  fontSize: 'clamp(14px, 2.5vw, 16px)',
                }}
              >
                Level up your experiments by experiencing premium equipments &
                services
              </p>
            </div>

            {/* Google Signup */}
            <button
              onClick={() => authApi.googleLogin('user')}
              className='flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-[#bab9b9] bg-white transition hover:bg-gray-50 hover:shadow-md hover:border-[#1B56CC] hover:cursor-pointer'
            >
              <GoogleIcon />
              <span
                className={`${roboto.className} text-lg font-medium text-[#3c4043]`}
              >
                Sign up with Google
              </span>
            </button>

            {/* OR */}
            <div className='my-[23px] flex items-center gap-[23px]'>
              <div className='h-0.5 grow bg-[#666666]/25' />
              <span className="font-['Inter'] text-lg text-[#666666]">OR</span>
              <div className='h-0.5 grow bg-[#666666]/25' />
            </div>

            {/* FORM */}
            <form onSubmit={handleSignup} className='flex flex-col gap-[18px]'>
              {/* First + Last Name */}
              <div className='grid grid-cols-2 gap-4'>
                <input
                  placeholder='First name'
                  className='h-14 rounded-xl border border-[#666666]/35 px-4 outline-none focus:border-[#1B56CC]'
                  value={form.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  required
                />
                <input
                  placeholder='Last name'
                  className='h-14 rounded-xl border border-[#666666]/35 px-4 outline-none focus:border-[#1B56CC]'
                  value={form.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  required
                />
              </div>

              {/* Email */}
              <input
                placeholder='Email'
                type='email'
                className='h-14 rounded-xl border border-[#666666]/35 px-4 outline-none focus:border-[#1B56CC]'
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
              />

              {/* Phone */}
              <input
                placeholder='Phone'
                type='tel'
                className='h-14 rounded-xl border border-[#666666]/35 px-4 outline-none focus:border-[#1B56CC]'
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                required
              />

              {/* Password */}
              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  className='h-14 w-full rounded-xl border border-[#666666]/35 px-4 outline-none focus:border-[#1B56CC]'
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-[#666]'
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className='relative'>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Confirm password'
                  className='h-14 w-full rounded-xl border border-[#666666]/35 px-4 outline-none focus:border-[#1B56CC]'
                  value={form.confirmPassword}
                  onChange={(e) =>
                    handleChange('confirmPassword', e.target.value)
                  }
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-4 top-1/2 -translate-y-1/2 text-[#666]'
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>

              {/* Error */}
              {error && (
                <p className="font-['Inter'] text-sm text-red-600">{error}</p>
              )}

              {/* Submit */}
              <button
                type='submit'
                className='h-16 w-full rounded-[17px] bg-[#1B56CC] text-xl font-semibold text-white! transition hover:bg-[#1B56CC]/90 hover:cursor-pointer'
              >
                Sign Up
              </button>
            </form>

            {/* Login Link */}
            <div className='mt-4 flex justify-center gap-2  hover:cursor-pointer'>
              <span className="font-['Inter'] text-base text-[#333333]">
                Already have an account?
              </span>
              <Link
                href='/login'
                className="font-['Inter'] text-base font-semibold hover:text-[#1B56CC]"
              >
                Sign In
              </Link>
            </div>

            <Link
              href='/'
              className='flex items-center justify-center gap-2 text-[#1B56CC] hover:text-[#1B56CC]/80 transition-colors mt-8 w-full'
            >
              <ArrowLeft className='h-5 w-5' />
              <span className="font-['Inter'] text-base font-semibold">
                Back
              </span>
            </Link>
          </div>
        </div>

        {/* RIGHT BANNER */}
        <div className='relative hidden w-1/2 lg:block h-screen overflow-hidden'>
          <ProductImage
            src='/assets/loginbanner.png'
            alt='Login Banner'
            classNames='object-cover h-full w-full'
          />
          <div className='absolute inset-0 bg-black/25' />
        </div>
      </div>
    </AntdApp>
  );
}
