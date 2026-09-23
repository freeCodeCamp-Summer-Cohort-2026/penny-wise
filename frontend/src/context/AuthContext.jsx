import { createContext, useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'penny-wise.auth';
const AUTH_EVENT = 'penny-wise.auth-changed';

function readAuth() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function notifyAuthChanged() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

// eslint-disable-next-line
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => readAuth());

  const signIn = useCallback(({ token, user }) => {
    const value = { token, user };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    setAuth(value);
    notifyAuthChanged();
  }, []);

  const signOut = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY);
    setAuth(null);
    notifyAuthChanged();
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key !== null && e.key !== STORAGE_KEY) return;
      setAuth(readAuth());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const resync = () => setAuth(readAuth());
    window.addEventListener(AUTH_EVENT, resync);
    return () => window.removeEventListener(AUTH_EVENT, resync);
  }, []);

  return (
    <AuthContext.Provider value={{ auth, signIn, signOut, ready: true }}>
      {children}
    </AuthContext.Provider>
  );
};
