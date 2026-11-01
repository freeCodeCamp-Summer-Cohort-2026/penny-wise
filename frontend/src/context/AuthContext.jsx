import { useCallback, useEffect, useState } from 'react';
import { AUTH_EXPIRED_EVENT } from '../lib/api/client';
import {
  clearImageCache,
  getCurrentUser,
  logoutUser,
} from '../lib/api/penny-wise';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getCurrentUser()
      .then((data) => {
        if (!isMounted) return;
        setAuth(data?.user ? { user: data.user } : null);
      })
      .catch(() => {
        if (isMounted) setAuth(null);
      })
      .finally(() => {
        if (isMounted) setReady(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const onExpired = () => setAuth(null);
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, []);

  const signIn = useCallback(async (value) => {
    const candidate = value?.user ?? value;
    let user =
      candidate &&
      typeof candidate === 'object' &&
      (candidate.id || candidate.email)
        ? candidate
        : null;

    if (!user) {
      try {
        user = (await getCurrentUser())?.user ?? null;
      } catch {
        user = null;
      }
    }

    setAuth(user ? { user } : null);
    return user;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      return;
    } finally {
      setAuth(null);
      clearImageCache();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, signIn, signOut, ready }}>
      {children}
    </AuthContext.Provider>
  );
}
