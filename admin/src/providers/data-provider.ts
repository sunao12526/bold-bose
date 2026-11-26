import { DataProvider } from '@refinedev/core';
import { axiosInstance } from '../lib/axios';

export const dataProvider: DataProvider = {
  getList: async ({ resource, filters, pagination }) => {
    const params: Record<string, any> = {};
    if (filters) {
      for (const filter of filters) {
        if ('field' in filter && 'value' in filter) {
          params[filter.field] = filter.value;
        }
      }
    }
    if (pagination) {
      const p = pagination as any;
      params.page = p.current || p.currentPage || p.pageIndex || 1;
      params.pageSize = p.pageSize || 20;
    }
    const response = await axiosInstance.get(`/${resource}`, { params });
    const data = response.data;
    if (data && typeof data === 'object') {
      if ('items' in data && Array.isArray(data.items)) {
        return {
          data: data.items,
          total: typeof data.total === 'number' ? data.total : data.items.length,
        };
      }
      if ('list' in data && Array.isArray(data.list)) {
        return {
          data: data.list,
          total: typeof data.total === 'number' ? data.total : data.list.length,
        };
      }
      if ('data' in data && Array.isArray(data.data)) {
        return {
          data: data.data,
          total: typeof data.total === 'number' ? data.total : data.data.length,
        };
      }
    }
    return {
      data: Array.isArray(data) ? data : [],
      total: Array.isArray(data) ? data.length : 0,
    };
  },
  getOne: async ({ resource, id }) => {
    const response = await axiosInstance.get(`/${resource}/${id}`);
    return { data: response.data };
  },
  create: async ({ resource, variables }) => {
    const response = await axiosInstance.post(`/${resource}`, variables);
    return { data: response.data };
  },
  update: async ({ resource, id, variables }) => {
    const response = await axiosInstance.put(`/${resource}/${id}`, variables);
    return { data: response.data };
  },
  deleteOne: async ({ resource, id, variables }) => {
    const response = await axiosInstance.delete(`/${resource}/${id}`, { data: variables });
    return { data: response.data };
  },
  getApiUrl: () => process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/admin-api',
};
