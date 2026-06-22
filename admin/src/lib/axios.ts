import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/admin-api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res && typeof res === 'object' && 'code' in res) {
      if (res.code === 200) {
        response.data = res.data; // 👈 替换为真实数据，前端业务代码无缝访问
        return response;
      } else {
        return Promise.reject(new Error(res.message || 'Error'));
      }
    }
    return response;
  },
  (error) => {
    const response = error.response;
    if (response && response.data && typeof response.data === 'object' && 'message' in response.data) {
      const backendMessage = response.data.message;
      error.message = Array.isArray(backendMessage) ? backendMessage[0] : backendMessage;
    }

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Do not redirect on SSR, only on browser
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);
