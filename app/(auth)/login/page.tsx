'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { en } from '@/lib/locales/en';
import { useSignIn } from '@/lib/hooks/useSignIn';
import { authApi } from '@/lib/services/api/auth.api';
import { useAuth } from '@/lib/auth/context/AuthContext';
import { storage } from '@/lib/services/storage';
import { roboto } from '@/lib/theme/fonts';
import { Form, Input, Button } from 'antd';
import { ProductImage } from '@/components/common/productImage';

export const GoogleIcon = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
      fill='#4285F4'
    />
    <path
      d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
      fill='#34A853'
    />
    <path
      d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
      fill='#FBBC05'
    />
    <path
      d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
      fill='#EA4335'
    />
  </svg>
);

interface LoginFormValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { isLoggedIn } = useAuth();
  const [form] = Form.useForm<LoginFormValues>();
  const { signIn, setProfile } = useSignIn();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      await signIn({
        email: values.email,
        password: values.password,
      });

      const loginState = storage.getLoginState();
      if (isLoggedIn || loginState) {
        await setProfile();
      }
    } catch (error) {
      console.error('Failed to login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen w-full bg-white'>
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
              {en.landingPage.navbar.logo}
            </h1>
            <h2
              className="font-['Inter'] text-[#111111] font-bold"
              style={{
                fontSize: 'clamp(26px, 4.5vw, 32px)',
              }}
            >
              Welcome back
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

          <div className='flex flex-col gap-4'>
            <button
              onClick={() => authApi.googleLogin('user')}
              className='flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-[#333333] bg-white transition hover:bg-gray-50 hover:shadow-md hover:border-[#1B56CC] hover:cursor-pointer'
            >
              <GoogleIcon />
              <span
                className={`${roboto.className} text-lg font-medium text-[#3c4043]`}
              >
                {en.login.form.buttons.google}
              </span>
            </button>
          </div>

          <div className='my-[23px] flex items-center gap-[23px]'>
            <div className='h-0.5 grow bg-[#666666]/25'></div>
            <span className="font-['Inter'] text-lg text-[#666666]">
              {en.login.form.text.or}
            </span>
            <div className='h-0.5 grow bg-[#666666]/25'></div>
          </div>

          <Form
            form={form}
            layout='vertical'
            onFinish={handleLogin}
            className='flex flex-col gap-[18px]'
            requiredMark={false}
          >
            <Form.Item
              name='email'
              label={
                <label className="font-['Inter'] text-base text-[#666666]">
                  {en.login.form.labels.username}
                </label>
              }
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email' },
              ]}
              className='mb-0'
            >
              <Input
                type='text'
                className='h-14 w-full rounded-xl border border-[#666666]/35 px-4 outline-none focus:border-[#1B56CC]'
                style={{ fontSize: '16px' }}
              />
            </Form.Item>

            <Form.Item
              name='password'
              label={
                <label className="font-['Inter'] text-base text-[#666666]">
                  {en.login.form.labels.password}
                </label>
              }
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
              className='mb-0'
            >
              <Input.Password
                // type={showPassword ? 'text' : 'password'}
                className='h-14 w-full rounded-xl border border-[#666666]/35 px-4 outline-none focus:border-[#1B56CC]'
                style={{ fontSize: '16px' }}
                iconRender={(visible) =>
                  visible ? (
                    <EyeOff className='h-5 w-5 text-[#666666]/80' />
                  ) : (
                    <Eye className='h-5 w-5 text-[#666666]/80' />
                  )
                }
              />
            </Form.Item>

            <Link
              href='/forgot-password'
              className="text-right font-['Inter'] text-base text-[#111111] underline hover:text-[#1B56CC]"
            >
              {en.login.form.links.forgotPassword}
            </Link>

            <Form.Item className='mb-0'>
              <Button
                type='primary'
                htmlType='submit'
                loading={loading}
                size='large'
                className='w-full h-14! rounded-[17px] bg-[#1B56CC] text-xl font-semibold text-white transition hover:bg-[#1B56CC]/90'
                style={{
                  border: 'none',
                  boxShadow: 'none',
                }}
              >
                {en.login.form.buttons.signIn}
              </Button>
            </Form.Item>
          </Form>

          <div className='mt-4 flex items-center justify-center gap-2 hover:cursor-pointer'>
            <span className="font-['Inter'] text-base text-[#333333]">
              {en.login.form.text.noAccount}
            </span>
            <Link
              href='/signup'
              className="font-['Inter'] text-base font-semibold text-[#333333] hover:text-[#1B56CC]"
            >
              {en.login.form.buttons.signUp}
            </Link>
          </div>

          <Link
            href='/'
            className='flex items-center justify-center gap-2 text-[#1B56CC] hover:text-[#1B56CC]/80 transition-colors mt-8 w-full'
          >
            <ArrowLeft className='h-5 w-5' />
            <span className="font-['Inter'] text-base font-semibold">Back</span>
          </Link>
        </div>
      </div>

      <div className='relative hidden w-1/2 lg:block h-screen overflow-hidden'>
        <ProductImage
          src='/assets/loginbanner.png'
          alt='Login Banner'
          classNames='object-cover h-full w-full'
        />
        <div className='absolute inset-0 bg-black/25' />
        <div className='absolute left-[72px] top-1/2 flex w-[551px] -translate-y-1/2 items-center'>
          <h1 className="font-['Inter'] text-[40px] font-semibold leading-[47px] text-white">
            {en.login.hero.headline}
          </h1>
        </div>
      </div>
    </div>
  );
}
