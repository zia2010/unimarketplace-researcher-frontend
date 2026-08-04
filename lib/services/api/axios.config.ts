import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosProgressEvent,
} from 'axios';
import { cookieService } from '../cookie.service';
import { ApiError } from '@/types';
import { storage } from '../storage';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || '/api';

interface ApiOptions extends AxiosRequestConfig {
  url?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: unknown;
}

const onSuccess = (response: AxiosResponse): unknown => {
  const newAccessToken =
    response.headers['new-access-token'] ||
    response.headers['New-Access-Token'];

  if (newAccessToken) {
    cookieService.setAccessToken(newAccessToken);
  }

  return {
    ...response.data,
    status: response.status,
  };
};

const AUTH_ROUTES = [
  '/login',
  '/signin',
  '/forgot-password',
  '/reset-password',
];

const isOnAuthRoute = () =>
  AUTH_ROUTES.some((route) => window.location.pathname.startsWith(route));

const onError = (error: AxiosError<ApiError>): never => {
  const status = error?.response?.status ?? error?.status;

  if (status === 401) {
    if (isOnAuthRoute()) {
      throw (
        error.response?.data ?? {
          message: 'Unauthorized',
          status: 401,
          errors: null,
        }
      );
    }

    localStorage.clear();
    window.location.href = '/login';
  }

  if (error?.code === 'ERR_NETWORK') {
    throw {
      message: 'Network error. Please check your connection.',
      status: 0,
      errors: null,
    } satisfies ApiError;
  }

  throw (
    error?.response?.data ?? {
      message: 'Unexpected error',
      status: status ?? 500,
      errors: null,
    }
  );
};

const createClient = (headers?: Record<string, string>): AxiosInstance =>
  axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

export async function apiRequest<T = unknown>({
  ...options
}: ApiOptions): Promise<T> {
  const token = storage.getToken() ?? cookieService.getAccessToken() ?? '';
  const client = createClient(
    token ? { Authorization: `Bearer ${token}` } : undefined
  );

  return client(options).then(onSuccess).catch(onError) as Promise<T>;
}

export async function withoutToken<T = unknown>({
  ...options
}: ApiOptions): Promise<T> {
  const client = createClient();
  return client(options).then(onSuccess).catch(onError) as Promise<T>;
}

export async function fileUploadRequest<T = unknown>({
  ...options
}: ApiOptions): Promise<T> {
  const token = storage.getToken() ?? cookieService.getAccessToken() ?? '';

  const client = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return client(options).then(onSuccess).catch(onError) as Promise<T>;
}

export async function uploadToPresignedUrl(
  uploadUrl: string,
  file: File,
  onProgress?: (percent: number) => void
) {
  try {
    /**
     * attepmting to do axios request
     */
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      withCredentials: false,
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (!onProgress || !progressEvent.total) return;
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percent);
      },
    });

    return;
  } catch (axiosError) {
    console.error('Axios upload failed. Retrying with fetch...', axiosError);
    /**
     * If you see error log, prolly axios has failed and
     * the code is fallen back to native fetch api for api request
     */

    try {
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type,
        },
        body: file,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Fetch upload failed: ${response.status} - ${errorText}`
        );
      }

      return;
    } catch (fetchError) {
      console.error('Fetch upload also failed:', fetchError);
      throw fetchError;
    }
  }
}

export const request = apiRequest;

export { baseURL };
