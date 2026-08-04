'use client';

import { useRouter } from 'next/navigation';
import { SignInPayload, SignUpPayload } from '@/types';
import { useState } from 'react';
import { isError } from '@/lib/utils/error.util';
import { authApi } from '@/lib/services/api/auth.api';
import { cookieService } from '@/lib/services/cookie.service';
import { storage } from '@/lib/services/storage';
import { message } from 'antd';

export function useSignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const signIn = async (payload: SignInPayload) => {
    setLoading(true);
    try {
      if (!loading) {
        const response = await authApi.login(payload);
        console.log(response, 'response response signIn');
        storage.setLoginState();
        if (response.accessToken) {
          storage.setToken(response.accessToken);
          cookieService.setAccessToken(response.accessToken);
          const userProfile = await authApi.getProfile();
          if (userProfile.role !== 'user') {
            storage.clear();
            cookieService.removeAccessToken();
            throw new Error('Invalid credentials');
          }

          router.push('/home', { scroll: true });
        }
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = isError(error)
        ? error.message
        : 'Failed operation please try again later';
      message.error(errorMessage);
      console.log(error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const setProfile = async () => {
    setLoading(true);
    try {
      if (!loading) {
        const response = await authApi.getProfile();
        storage.setUser(response);
        return response;
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = isError(error)
        ? error.message
        : 'Failed operation please try again later';
      message.error(errorMessage);
      console.log(error);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (payload: SignUpPayload) => {
    setLoading(true);
    try {
      if (!loading) {
        const response = await authApi.register(payload);
        //do not set the state for the user and redirect back to login where the user data is stored
        // storage.setLoginState();
        router.push(
          `/signup/success?email=${encodeURIComponent(payload.email)}`,
          { scroll: true }
        );
        return response;
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = isError(error)
        ? error.message
        : 'Failed operation please try again later';
      console.log(error, isError(error));
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyEmailToken = async (token: string) => {
    setLoading(true);
    try {
      if (!loading) {
        const response = await authApi.verificationEmailToken(token);
        console.log(response);
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = isError(error)
        ? error.message
        : 'Failed operation please try again later';
      console.log(error, isError(error));
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resendEmail = async (email: string) => {
    setLoading(true);
    try {
      if (!loading) {
        const response = await authApi.resendVerificationEmail(email);
        console.log(response);
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = isError(error)
        ? error.message
        : 'Failed operation please try again later';
      console.log(error, isError(error));
      message.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const googleAuthCallback = async (token: string) => {
    setLoading(true);
    try {
      if (!loading) {
        storage.setToken(token);
        const response = await setProfile();
        console.log(response);
        return response;
      }
    } catch (error) {
      setLoading(false);
      const errorMessage = isError(error)
        ? error.message
        : 'Failed operation please try again later';
      console.log(error, isError(error));
      // Don't show error message here - it's handled in AuthCallbackClient
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    signIn,
    setProfile,
    signUp,
    verifyEmailToken,
    resendEmail,
    googleAuthCallback,
  };
}
