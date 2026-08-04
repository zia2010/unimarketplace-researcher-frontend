import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { storage } from '../storage';
import { ApiError } from '../../types';

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

interface ApiOptions extends AxiosRequestConfig {
  url?: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: unknown;
}

const onSuccess = (response: AxiosResponse): unknown => ({
  ...response.data,
  status: response.status,
});

const onError = (error: AxiosError<ApiError>): never => {
  if (error?.code === 'ERR_NETWORK') {
    throw {
      message: 'Network error. Please check your connection.',
      status: 0,
      errors: null,
    } satisfies ApiError;
  }
  throw error?.response?.data ?? {
    message: 'Unexpected error',
    status: error.response?.status ?? 500,
    errors: null,
  };
};

const createClient = (headers?: Record<string, string>): AxiosInstance =>
  axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });

export async function apiRequest<T = unknown>({
  ...options
}: ApiOptions): Promise<T> {
  const token = storage.getToken() ?? '';
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
  const token = storage.getToken();

  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return client(options).then(onSuccess).catch(onError) as Promise<T>;
}

// Backwards compatible alias (with-token by default)
export const request = apiRequest;

export { baseURL };