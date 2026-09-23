import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'penny-wise.auth';

function readAuth() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [auth, setAuth] = useState(readAuth);
  useEffect(() => {}, []);

  const signIn = useCallback(({ token, user }) => {
    const value = { token, user };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    setAuth(value);
  }, []);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
  }, []);

  return { auth, ready: true, signIn, signOut };
}
