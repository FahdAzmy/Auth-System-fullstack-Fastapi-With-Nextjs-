import axios, { AxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const axiosInstance = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For cookie support
});

// Request interceptor to add token
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'An error occurred';
    
    if (error.response?.data?.detail) {
      const detail = error.response.data.detail;
      if (Array.isArray(detail)) {
        // Handle Pydantic validation errors (array of objects)
        message = detail.map((err: any) => err.msg || 'Invalid input').join(', ');
      } else if (typeof detail === 'string') {
        message = detail;
      } else if (typeof detail === 'object') {
          message = JSON.stringify(detail);
      }
    } else if (error.message) {
      message = error.message;
    }
    
    return Promise.reject(message);
  }
);

export default axiosInstance;
