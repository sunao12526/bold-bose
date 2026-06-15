import { AuthProvider } from '@refinedev/core';
import { axiosInstance } from '../lib/axios';

export const authProvider: AuthProvider = {
  login: async ({ username, password, captchaKey, captchaCode }) => {
    try {
      const response = await axiosInstance.post('/system/auth/login', {
        username,
        password,
        captchaKey: captchaKey || '',
        captchaCode: captchaCode || '',
      });
      const { accessToken } = response.data;
      if (accessToken) {
        localStorage.setItem('token', accessToken);
        return {
          success: true,
          redirectTo: '/',
        };
      }
      return {
        success: false,
        error: {
          name: 'Login Error',
          message: '登录失败，未收到 Token',
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          name: 'Login Error',
          message: error.response?.data?.message || '用户名或密码错误',
        },
      };
    }
  },
  logout: async () => {
    localStorage.removeItem('token');
    return {
      success: true,
      redirectTo: '/login',
    };
  },
  check: async () => {
    const token = localStorage.getItem('token');
    if (token) {
      return {
        authenticated: true,
      };
    }
    return {
      authenticated: false,
      redirectTo: '/login',
    };
  },
  getPermissions: async () => {
    try {
      const response = await axiosInstance.get('/system/auth/get-permission-info');
      return response.data.permissions;
    } catch (e) {
      return [];
    }
  },
  getIdentity: async () => {
    try {
      const response = await axiosInstance.get('/system/auth/get-permission-info');
      return response.data.user;
    } catch (e) {
      return null;
    }
  },
  onError: async (error) => {
    if (error.status === 401 || error.statusCode === 401) {
      return {
        logout: true,
        redirectTo: '/login',
      };
    }
    return { error };
  },
};
