import axios from 'axios';

const API = axios.create({
  baseURL: '/api', // This will be proxied to our backend server
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