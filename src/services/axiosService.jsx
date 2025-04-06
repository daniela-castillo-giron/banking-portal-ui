import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import environment from '../config/environment';

// Create an Axios instance
const api = axios.create({
  baseURL: environment.apiUrl,
});

// Request Interceptor — Attach token if valid
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(environment.tokenName);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          config.headers['Authorization'] = `Bearer ${token}`;
          config.headers['Access-Control-Allow-Origin'] = environment.origin;
        } else {
          console.error('Session expired.');
          localStorage.removeItem(environment.tokenName);
          toast.error('Session expired. Please log in again.');
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Invalid token.', error);
        localStorage.removeItem(environment.tokenName);
        toast.error('Invalid token. Please log in again.');
        window.location.href = '/login';
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor — Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && error.response?.data === 'Full authentication is required to access this resource') {
      console.error('Unauthorized. Redirecting to login...');
      localStorage.removeItem(environment.tokenName);
      toast.error('Unauthorized access. Please log in again.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
