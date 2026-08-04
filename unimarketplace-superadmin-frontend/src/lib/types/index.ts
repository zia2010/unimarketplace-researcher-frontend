export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
  firstName?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ApiResponse<T = unknown> {
  data: T;
  message: string;
  status: number;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors: Record<string, string[]> | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}
