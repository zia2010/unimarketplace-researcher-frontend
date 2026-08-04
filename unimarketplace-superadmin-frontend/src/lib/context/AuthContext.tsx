/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
} from 'react';
import { AuthState, User, LoginCredentials } from '../types';
import { storage } from '../services/storage';
import { authApi } from '../services/api/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  loginWithUser: (user: User, token: string) => void;
}

const initialState: AuthState = {
  user: storage.getUser<User>(),     // ✅ READ USER
  token: storage.getToken(),
  isAuthenticated: !!storage.getToken(),
  isLoading: false,
};

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };

    case 'LOGIN_FAILURE':
      return { ...state, isLoading: false };

    case 'LOGOUT':
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 🔐 NORMAL LOGIN (API)
  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const response = await authApi.login(credentials);

      storage.setToken(response.data.token);
      storage.setUser(response.data.user); // ✅ SAVE USER

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.data.user,
          token: response.data.token,
        },
      });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  // 🔐 SIGNUP AUTO-LOGIN (NO API)
  const loginWithUser = (user: User, token: string) => {
    storage.setToken(token);
    storage.setUser(user); // ✅ SAVE USER

    dispatch({
      type: 'LOGIN_SUCCESS',
      payload: { user, token },
    });
  };

  const logout = () => {
    storage.removeToken();
    storage.removeUser();
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        loginWithUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
