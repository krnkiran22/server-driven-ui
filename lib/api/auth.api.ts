import apiClient from './client';
import { LoginResponse, RegisterResponse, User } from '../types/auth.types';

export const register = async (data: {
  name: string;
  email: string;
  password: string;
  subdomain: string;
}): Promise<RegisterResponse> => {
  const response = await apiClient.post('/auth/register', data);
  return response.data.data;
};

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  // Development bypass: accept two dummy accounts locally without calling the backend
  if (
    (email === 'admin@gmail.com' && password === 'admin') ||
    (email === 'csehod@gmail.com' && password === 'csehod')
  ) {
    const user: User = {
      id: email === 'admin@gmail.com' ? 'dummy-admin-id' : 'dummy-csehod-id',
      name: email === 'admin@gmail.com' ? 'Admin' : 'CSE HOD',
      email,
      role: (email === 'admin@gmail.com' ? ('super-admin' as const) : ('editor' as const)) as any,
      institutionId: 'dummy-institution',
    };
    const accessToken = `dummy:${email}`;
    const refreshToken = `dummy-refresh:${email}`;
    return Promise.resolve({ user, accessToken, refreshToken });
  }

  const response = await apiClient.post('/auth/login', { email, password });
  return response.data.data;
};

export const refreshToken = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
  const response = await apiClient.post('/auth/refresh', { refreshToken });
  return response.data.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await apiClient.get('/auth/me');
  return response.data.data;
};

export const verifyToken = async (token: string): Promise<User> => {
  // Accept dummy tokens issued by the development bypass above
  if (token && token.startsWith('dummy:')) {
    const email = token.split(':')[1];
    const user: User = {
      id: email === 'admin@gmail.com' ? 'dummy-admin-id' : 'dummy-csehod-id',
      name: email === 'admin@gmail.com' ? 'Admin' : 'CSE HOD',
      email,
      role: (email === 'admin@gmail.com' ? ('super-admin' as const) : ('editor' as const)) as any,
      institutionId: 'dummy-institution',
    };
    return Promise.resolve(user);
  }

  const response = await apiClient.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};
