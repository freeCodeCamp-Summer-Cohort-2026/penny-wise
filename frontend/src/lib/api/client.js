import axios from 'axios';
import { clearAuth, getAuthToken } from '../authStorage';

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:5000/api';

export function normalizeApiError(error) {
  if (error?.isApiError) return error;

  const data = error?.response?.data ?? error?.data ?? null;
  const message =
    (typeof data === 'string' ? data : data?.message || data?.error) ||
    error?.error ||
    error?.message ||
    'Something went wrong. Please try again.';

  const normalized = new Error(message);
  normalized.name = 'ApiError';
  normalized.status = error?.response?.status ?? error?.status ?? null;
  normalized.data = data;
  normalized.error =
    (typeof data === 'object' && (data?.error || data?.message)) || message;
  normalized.code = error?.code;
  normalized.isApiError = true;

  if (error?.response) normalized.response = error.response;

  return normalized;
}

export function attachAuthToken(config) {
  const token = getAuthToken();
  if (!token) return config;

  if (config.headers && typeof config.headers.set === 'function') {
    config.headers.set('Authorization', `Bearer ${token}`);
  } else {
    config.headers = {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
}

export function handleApiError(error) {
  const normalized = normalizeApiError(error);
  const requestUrl = error?.config?.url || '';
  const isAuthEntry = ['/auth/login', '/auth/register'].some((path) =>
    requestUrl.includes(path),
  );

  if (normalized.status === 401 && !isAuthEntry) clearAuth();
  return normalized;
}

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(attachAuthToken);

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(handleApiError(error)),
);
