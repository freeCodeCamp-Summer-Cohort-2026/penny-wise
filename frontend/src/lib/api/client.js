import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_BASE_URL?.trim() || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
