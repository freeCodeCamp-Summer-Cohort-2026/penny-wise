import { useCallback, useEffect, useState } from 'react';
import {
  AUTH_CHANGE_EVENT,
  AUTH_STORAGE_KEY,
  clearAuth,
  readAuth,
  saveAuth,
} from '../lib/authStorage';
import { AuthContext } from './auth-context';

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => readAuth());

  const signIn = useCallback(({ token, user }) => {
    const value = { token, user };
    saveAuth(value);
    setAuth(value);
  }, []);

  const signOut = useCallback(() => {
    clearAuth();
    setAuth(null);
  }, []);

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== null && event.key !== AUTH_STORAGE_KEY) return;
      setAuth(readAuth());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const resync = () => setAuth(readAuth());
    window.addEventListener(AUTH_CHANGE_EVENT, resync);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, resync);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, signIn, signOut, ready: true }}>
      {children}
    </AuthContext.Provider>
  );
}
