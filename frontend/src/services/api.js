import axios from 'axios';

const API = axios.create({
   baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
});

// Interceptor to add the auth token to every request if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;