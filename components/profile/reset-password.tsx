'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { authApi } from '@/lib/services/api/auth.api';
import { useRouter, useSearchParams } from 'next/navigation';
import { App } from 'antd';
import { isError } from '@/lib/utils/error.util';
import { ProductImage } from '../common/productImage';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { message } = App.useApp();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/(?=.*\d)/.test(password)) {
      return 'Password must contain at least one number';
    }
    return '';
  };

  const handleSubmit = async () => {
    setErrors({ newPassword: '', confirmPassword: '' });

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setErrors((prev) => ({ ...prev, newPassword: passwordError }));
      return;
    }

    if (!token) {
      message.error('Verification token not found');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: 'Passwords do not match',
      }));
      return;
    }

    setIsLoading(true);

    try {
      await authApi.resetPassword({ newPassword, token });
      setIsSuccess(true);
      router.push('/login', { scroll: true });
    } catch (error) {
      const errorMessage = isError(error)
        ? error.message
        : 'Failed to reset password. Please try again or request a new reset link.';
      setErrors((prev) => ({
        ...prev,
        newPassword: errorMessage,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: '', color: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[@$!%*?&])/.test(password)) strength++;

    if (strength <= 2)
      return { strength: 33, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3)
      return { strength: 66, label: 'Medium', color: 'bg-yellow-500' };
    return { strength: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className='flex min-h-screen w-full bg-white'>
      <div className='flex w-full flex-col justify-center px-8 lg:w-1/2 lg:px-[82px]'>
        <div className='mx-auto flex w-full max-w-[568px] flex-col'>
          {!isSuccess ? (
            <>
              <div className='mb-8'>
                <h1 className="font-['Inter'] text-3xl font-semibold text-[#111111] mb-3">
                  Reset Password
                </h1>
                <p className="font-['Inter'] text-base text-[#666666]">
                  Enter your new password below to reset your account password
                </p>
              </div>

              <div className='flex flex-col gap-[18px]'>
                <div className='flex flex-col gap-1'>
                  <div className='relative flex items-center justify-between'>
                    <label className="font-['Inter'] text-base text-[#666666]">
                      New Password
                    </label>
                    <button
                      type='button'
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className='flex items-center gap-2 text-lg text-[#666666]/80 hover:text-[#333333]'
                    >
                      {showNewPassword ? (
                        <EyeOff className='h-5 w-5' />
                      ) : (
                        <Eye className='h-5 w-5' />
                      )}
                      <span className="font-['Poppins']">
                        {showNewPassword ? 'Hide' : 'Show'}
                      </span>
                    </button>
                  </div>

                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder='Enter new password'
                    className={`h-14 w-full rounded-xl border ${
                      errors.newPassword
                        ? 'border-red-500'
                        : 'border-[#666666]/35'
                    } px-4 outline-none focus:border-[#1B56CC]`}
                  />

                  {newPassword && (
                    <div className='mt-2'>
                      <div className='flex items-center justify-between mb-1'>
                        <span className="font-['Inter'] text-xs text-[#666666]">
                          Password Strength: {passwordStrength.label}
                        </span>
                      </div>
                      <div className='h-2 bg-gray-200 rounded-full overflow-hidden'>
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {errors.newPassword && (
                    <span className="font-['Inter'] text-sm text-red-500 mt-1">
                      {errors.newPassword}
                    </span>
                  )}
                </div>

                <div className='flex flex-col gap-1'>
                  <div className='relative flex items-center justify-between'>
                    <label className="font-['Inter'] text-base text-[#666666]">
                      Confirm Password
                    </label>
                    <button
                      type='button'
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className='flex items-center gap-2 text-lg text-[#666666]/80 hover:text-[#333333]'
                    >
                      {showConfirmPassword ? (
                        <EyeOff className='h-5 w-5' />
                      ) : (
                        <Eye className='h-5 w-5' />
                      )}
                      <span className="font-['Poppins']">
                        {showConfirmPassword ? 'Hide' : 'Show'}
                      </span>
                    </button>
                  </div>

                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder='Confirm new password'
                    className={`h-14 w-full rounded-xl border ${
                      errors.confirmPassword
                        ? 'border-red-500'
                        : 'border-[#666666]/35'
                    } px-4 outline-none focus:border-[#1B56CC]`}
                  />

                  {errors.confirmPassword && (
                    <span className="font-['Inter'] text-sm text-red-500 mt-1">
                      {errors.confirmPassword}
                    </span>
                  )}
                </div>

                <div className='bg-[#F9FAFB] border border-[#EAECF0] rounded-lg p-4 mt-2'>
                  <p className="font-['Inter'] text-sm text-[#666666] mb-2 font-medium">
                    Password must contain:
                  </p>
                  <ul className='space-y-1'>
                    <li
                      className={`font-['Inter'] text-xs flex items-center gap-2 ${
                        newPassword.length >= 8
                          ? 'text-green-600'
                          : 'text-[#666666]'
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full ${
                          newPassword.length >= 8
                            ? 'bg-green-600'
                            : 'bg-[#666666]'
                        }`}
                      ></span>
                      At least 8 characters
                    </li>
                    <li
                      className={`font-['Inter'] text-xs flex items-center gap-2 ${
                        /(?=.*[a-z])/.test(newPassword)
                          ? 'text-green-600'
                          : 'text-[#666666]'
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full ${
                          /(?=.*[a-z])/.test(newPassword)
                            ? 'bg-green-600'
                            : 'bg-[#666666]'
                        }`}
                      ></span>
                      One lowercase letter
                    </li>
                    <li
                      className={`font-['Inter'] text-xs flex items-center gap-2 ${
                        /(?=.*[A-Z])/.test(newPassword)
                          ? 'text-green-600'
                          : 'text-[#666666]'
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full ${
                          /(?=.*[A-Z])/.test(newPassword)
                            ? 'bg-green-600'
                            : 'bg-[#666666]'
                        }`}
                      ></span>
                      One uppercase letter
                    </li>
                    <li
                      className={`font-['Inter'] text-xs flex items-center gap-2 ${
                        /(?=.*\d)/.test(newPassword)
                          ? 'text-green-600'
                          : 'text-[#666666]'
                      }`}
                    >
                      <span
                        className={`w-1 h-1 rounded-full ${
                          /(?=.*\d)/.test(newPassword)
                            ? 'bg-green-600'
                            : 'bg-[#666666]'
                        }`}
                      ></span>
                      One number
                    </li>
                  </ul>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !newPassword || !confirmPassword}
                  className='h-16 w-full rounded-[17px] bg-[#1B56CC] text-xl font-semibold text-white! transition hover:bg-[#1B56CC]/90 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-4'
                >
                  {isLoading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </div>

              <Link
                href='/login'
                className='flex items-center justify-center gap-2 text-[#1B56CC] hover:text-[#1B56CC]/80 transition-colors mt-8 w-full'
              >
                <ArrowLeft className='h-5 w-5' />
                <span className="font-['Inter'] text-base font-semibold">
                  Back to Login
                </span>
              </Link>
            </>
          ) : (
            <div className='flex flex-col items-center text-center'>
              <div className='mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100'>
                <CheckCircle2 className='h-10 w-10 text-green-600' />
              </div>

              <h2 className="font-['Inter'] text-2xl font-semibold text-[#111111] mb-3">
                Password Reset Successful!
              </h2>

              <p className="font-['Inter'] text-base text-[#666666] mb-8 max-w-md">
                Your password has been successfully reset. You can now log in
                with your new password.
              </p>

              <Link
                href='/login'
                className='h-14 w-full rounded-[17px] bg-[#1B56CC] text-lg font-semibold text-white transition hover:bg-[#1B56CC]/90 flex items-center justify-center'
              >
                Continue to Login
              </Link>
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
            Create a new password and regain access to your account
          </h1>
        </div>
      </div>
    </div>
  );
}
