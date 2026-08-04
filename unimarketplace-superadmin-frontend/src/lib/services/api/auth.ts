// import { request } from './axios.config';
import { ApiResponse, AuthResponse, LoginCredentials } from '../../types';

const mockDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authApi = {
  login: async (payload: LoginCredentials): Promise<ApiResponse<AuthResponse>> => {
    // Swap this mock with a real request when the backend is ready.
    // return request<ApiResponse<AuthResponse>>({
    //   method: 'POST',
    //   url: authEndpoints.login,
    //   data: payload,
    // });

    await mockDelay(650);

    return {
      data: {
        token: 'mock-jwt-token',
        user: {
          id: '1',
          email: payload.email,
          name: 'John Doe',
          role: 'admin',
        },
      },
      message: 'Login successful',
      status: 200,
      success: true,
    };
  },
};

