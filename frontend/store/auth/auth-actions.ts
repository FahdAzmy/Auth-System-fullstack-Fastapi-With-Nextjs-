import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '@/lib/axios';

// Login Action
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/login', credentials);
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.data.access_token);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Signup Action
export const signup = createAsyncThunk(
  'auth/signup',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/signup', userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Verify Email Action
export const verifyEmail = createAsyncThunk(
  'auth/verify',
  async (verifyData: { email: string; code: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/verify-code', verifyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Resend Code Action
export const resendCode = createAsyncThunk(
  'auth/resend',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/resend-code', { email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Forgot Password Action
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/forgot-password', { email });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Reset Password Action
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { email: string; code: string; new_password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/reset-password', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Logout Action
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post('/logout');
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
      }
      return null;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);

// Refresh Token Action
export const refreshToken = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/refresh');
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.data.access_token);
      }
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  }
);
