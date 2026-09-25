export const AUTH_STORAGE_KEY = 'penny-wise.auth';
export const AUTH_CHANGE_EVENT = 'penny-wise.auth-changed';

function getStorage() {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readAuth() {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw);
    return value && typeof value === 'object' ? value : null;
  } catch {
    return null;
  }
}

export function getAuthToken() {
  const auth = readAuth();
  return typeof auth?.token === 'string' && auth.token ? auth.token : null;
}

export function notifyAuthChanged() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new window.Event(AUTH_CHANGE_EVENT));
}

export function saveAuth(value) {
  const storage = getStorage();
  if (storage) {
    try {
      storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(value));
    } catch {
      return value;
    }
  }
  notifyAuthChanged();
  return value;
}

export function clearAuth() {
  const storage = getStorage();
  if (storage) {
    try {
      storage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      return;
    }
  }
  notifyAuthChanged();
}
