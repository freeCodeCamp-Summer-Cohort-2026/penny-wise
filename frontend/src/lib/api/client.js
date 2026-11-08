import axios from 'axios';

export const AUTH_EXPIRED_EVENT = 'penny-wise.auth-expired';

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:5000/api';

const REQUEST_TIMEOUT_MS = 30000;

const STATUS_FALLBACK_MESSAGES = {
  409: 'An account with that email already exists.',
  429: 'Too many attempts. Please wait a few minutes and try again.',
  500: 'Something went wrong on the server. Please try again.',
  502: 'The server is temporarily unavailable. Please try again in a moment.',
  503: 'The server is starting up. Please try again in a moment.',
  504: 'The server took too long to respond. Please try again.',
};

function isHtmlPayload(value) {
  return typeof value === 'string' && /^\s*</.test(value);
}

function getServerMessage(data) {
  if (typeof data === 'string') {
    return isHtmlPayload(data) ? null : data;
  }
  return data?.message || data?.error || null;
}

export function normalizeApiError(error) {
  if (error?.isApiError) return error;

  const data = error?.response?.data ?? error?.data ?? null;
  const status = error?.response?.status ?? error?.status ?? null;
  const serverMessage = getServerMessage(data);
  const isTimeout =
    error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT';

  const message =
    serverMessage ||
    (status ? STATUS_FALLBACK_MESSAGES[status] : null) ||
    (isTimeout
      ? 'The server is taking too long to respond. Please try again.'
      : null) ||
    (!error?.response
      ? 'We could not reach the server. Check your connection and try again.'
      : null) ||
    error?.message ||
    'Something went wrong. Please try again.';

  const normalized = new Error(message);
  normalized.name = 'ApiError';
  normalized.status = status;
  normalized.data = data;
  normalized.error = serverMessage || message;
  normalized.code = error?.code;
  normalized.isApiError = true;

  if (error?.response) normalized.response = error.response;

  return normalized;
}

export function handleApiError(error) {
  const normalized = normalizeApiError(error);
  const requestUrl = error?.config?.url || '';
  const isAuthEntry = ['/auth/login', '/auth/register'].some((path) =>
    requestUrl.includes(path)
  );

  if (
    normalized.status === 401 &&
    !isAuthEntry &&
    typeof window !== 'undefined'
  ) {
    window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
  }

  return normalized;
}

export const api = axios.create({
  baseURL: baseURL,
  timeout: REQUEST_TIMEOUT_MS,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(handleApiError(error))
);
