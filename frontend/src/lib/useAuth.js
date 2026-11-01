import { useContext } from 'react';
import { AuthContext } from '../context/auth-context';
import { clearImageCache } from './api/penny-wise';

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within <AuthProvider>');
  }
  clearImageCache();
  return ctx;
}
