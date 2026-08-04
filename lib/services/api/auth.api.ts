import {
  SignInPayload,
  AuthResponse,
  User,
  SignUpPayload,
  FirebaseTokenResponse,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '@/types';
import { authEndpoints } from './endpoints';
import { request } from './axios.config';
import axios from 'axios';

export const authApi = {
  setAccessToken(token: string) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  login: async (payload: SignInPayload): Promise<AuthResponse> => {
    return request<AuthResponse>({
      method: 'POST',
      url: authEndpoints.login,
      data: payload,
    });
  },

  getProfile: async (): Promise<User> => {
    return request<User>({
      method: 'GET',
      url: authEndpoints.profile,
    });
  },

  logout: async () => {
    return request({
      method: 'POST',
      url: authEndpoints.logout,
    });
  },

  googleLogin: (intent: 'user' | 'staff' = 'user') => {
    window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL || '/api'}${authEndpoints.google}?state=${intent}`;
  },

  register: async (payload: SignUpPayload): Promise<AuthResponse> => {
    return request<AuthResponse>({
      method: 'POST',
      url: authEndpoints.register,
      data: payload,
    });
  },

  verificationEmailToken: async (token: string) => {
    return request({
      method: 'GET',
      url: `${authEndpoints.verifyEmail}?token=${encodeURIComponent(token)}`,
    });
  },

  resendVerificationEmail: async (email: string) => {
    return request({
      method: 'GET',
      url: `${authEndpoints.resendEmail}?email=${encodeURIComponent(email)}`,
    });
  },

  getFirebaseToken: async (): Promise<FirebaseTokenResponse> => {
    return request<FirebaseTokenResponse>({
      method: 'GET',
      url: `${authEndpoints.firebaseToken}`,
    });
  },

  saveFCMToken: async (payload: {
    token: string;
  }): Promise<FirebaseTokenResponse> => {
    return request<FirebaseTokenResponse>({
      method: 'POST',
      url: `${authEndpoints.fcmToken}`,
      data: payload,
    });
  },

  forgotPassword: async (
    payload: ForgotPasswordPayload
  ): Promise<AuthResponse> => {
    return request<AuthResponse>({
      method: 'POST',
      url: authEndpoints.forgotPassword,
      data: payload,
    });
  },

  resetPassword: async (
    payload: ResetPasswordPayload
  ): Promise<AuthResponse> => {
    return request<AuthResponse>({
      method: 'POST',
      url: authEndpoints.resetPassword,
      data: payload,
    });
  },
};
