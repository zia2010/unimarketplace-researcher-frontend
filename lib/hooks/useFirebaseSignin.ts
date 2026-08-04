import { useState, useCallback } from 'react';
import { signInWithCustomToken } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { authApi } from '@/lib/services/api/auth.api';
import { FirebaseSignInResult } from '@/types';
import { storage } from '../services/storage';

interface UseFirebaseSignInReturn {
  signIn: () => Promise<FirebaseSignInResult | null>;
  loading: boolean;
  error: Error | null;
  userData: FirebaseSignInResult | null;
}

export const useFirebaseSignIn = (): UseFirebaseSignInReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [userData, setUserData] = useState<FirebaseSignInResult | null>(null);

  const signIn = useCallback(async (): Promise<FirebaseSignInResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const isLoggedIn: string | null = storage.getLoginState();
      const isLoggedInBool = isLoggedIn === 'true';

      // skipping api calls and signInWithCustomToken method
      if (!isLoggedInBool) {
        console.error('User is not authorized');
        return null;
      }

      const response = await authApi.getFirebaseToken();
      const userCredential = await signInWithCustomToken(auth, response.token);
      const idToken = await userCredential.user.getIdToken();

      const result = {
        user: userCredential.user,
        idToken: idToken,
      };

      setUserData(result);
      console.log('✅ Firebase user authenticated:', userCredential.user.uid);

      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('❌ Error signing in to Firebase:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { signIn, loading, error, userData };
};
