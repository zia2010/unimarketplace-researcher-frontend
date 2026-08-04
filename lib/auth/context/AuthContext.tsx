'use client';

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { cookieService } from '@/lib/services/cookie.service';
import { FirebaseSignInResult, User } from '@/types';
import { authApi } from '@/lib/services/api/auth.api';
import { storage } from '@/lib/services/storage';
import { useFirebaseSignIn } from '@/lib/hooks/useFirebaseSignin';
import { useFirebaseMessaging } from '@/lib/firebase/useFirebaseMessaging';
import { fetchInitialUnreadCount } from '@/lib/services/firebase/unread';

type AuthState = {
  user: User | null;
  isHydrating: boolean;
  isLoggedIn: boolean;
};

type AuthAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'HYDRATE_START' }
  | { type: 'HYDRATE_COMPLETE' }
  | { type: 'UPDATE_LOGIN_STATE'; payload: boolean };

type AuthContextType = {
  user: User | null;
  hydrateUser: () => void;
  isHydrating: boolean;
  logout: () => void;
  firebaseSignIn: () => Promise<FirebaseSignInResult | null>;
  firebaseLoading: boolean;
  firebaseError: Error | null;
  firebaseUserData: FirebaseSignInResult | null;
  unreadMessage: number;
  isLoggedIn: boolean;
};

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  isHydrating: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'UPDATE_LOGIN_STATE':
      return { ...state, isLoggedIn: action.payload };
    case 'HYDRATE_START':
      return { ...state, isHydrating: true };
    case 'HYDRATE_COMPLETE':
      return { ...state, isHydrating: false };
    case 'LOGIN':
      return { ...state, user: action.payload, isLoggedIn: true };
    case 'LOGOUT':
      return { ...state, user: null, isLoggedIn: false };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [unreadMessage, setUnreadMessage] = useState<number>(0);
  const [state, dispatch] = useReducer(authReducer, initialState);
  const {
    signIn: firebaseSignIn,
    loading: firebaseLoading,
    error: firebaseError,
    userData: firebaseUserData,
  } = useFirebaseSignIn();

  useFirebaseMessaging(setUnreadMessage, state.user?.id ?? null);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {}
    cookieService.removeAccessToken();
    storage.clear();
    dispatch({ type: 'LOGOUT' });
    window.location.replace('/');
  }, []);

  const hydrateUser = useCallback(async () => {
    console.log('Hydrating user from storage...');
    dispatch({ type: 'HYDRATE_START' });

    try {
      const user: User | null = storage.getUser();
      const isLoggedIn: string | null = storage.getLoginState();
      const isLoggedInBool = isLoggedIn === 'true';

      console.log('Storage data:', { user, isLoggedIn, isLoggedInBool });

      dispatch({ type: 'UPDATE_LOGIN_STATE', payload: isLoggedInBool });

      if (!user || !isLoggedInBool) {
        console.log('No user or not logged in');
        // If not logged in or no user, try to get fresh data
        if (isLoggedInBool) {
          try {
            const freshUser = await authApi.getProfile();
            console.log('Got fresh user from API:', freshUser);
            storage.setUser(freshUser);
            dispatch({ type: 'LOGIN', payload: freshUser });
          } catch (error) {
            console.error('Failed to fetch fresh user:', error);
            if (user) {
              dispatch({ type: 'LOGIN', payload: user as User });
            }
          }
        }
      } else {
        console.log('Using stored user:', user);
        dispatch({ type: 'LOGIN', payload: user as User });
      }
    } catch (error) {
      console.error('Hydration error:', error);
      dispatch({ type: 'LOGOUT' });
    } finally {
      dispatch({ type: 'HYDRATE_COMPLETE' });
    }
  }, []);

  // 2. TRIGGER HYDRATION ON MOUNT
  // This was missing. Without this, state.user remains null.
  useEffect(() => {
    hydrateUser();
  }, [hydrateUser]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user' || e.key === 'isLoggedIn') {
        console.log('Storage changed, re-hydrating...', e.key);
        hydrateUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [hydrateUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentUser = storage.getUser<{ id: string }>();
      const currentLoginState = storage.getLoginState();
      const currentLoginStateBool = currentLoginState === 'true';

      if (currentLoginStateBool !== state.isLoggedIn) {
        console.log('Login state mismatch detected, updating...');
        hydrateUser();
      }

      if (currentUser?.id !== state.user?.id) {
        console.log('User mismatch detected, updating...');
        hydrateUser();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isLoggedIn, state.user?.id, hydrateUser]);

  useEffect(() => {
    if (state.user?.id) {
      fetchInitialUnreadCount(state.user?.id).then(setUnreadMessage);
    }
  }, [state.user?.id]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isHydrating: state.isHydrating,
        hydrateUser,
        logout,
        firebaseSignIn,
        firebaseLoading,
        firebaseError,
        firebaseUserData,
        unreadMessage,
        isLoggedIn: state.isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
