import axios from 'axios';
import { AuthResponse, User } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const signup = async (userData: {
  parentName: string;
  email: string;
  password: string;
  age: number;
  area: string;
  childAge: number;
}): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Signup failed');
  }
};

export const getProfile = async (token: string): Promise<User> => {
  try {
    const response = await api.get('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.user;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get profile');
  }
};