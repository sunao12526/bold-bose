import { DataProvider } from '@refinedev/core';
import { axiosInstance } from '../lib/axios';

export const dataProvider: DataProvider = {
  getList: async ({ resource, filters }) => {
    const params: Record<string, any> = {};
    if (filters) {
      for (const filter of filters) {
        if ('field' in filter && 'value' in filter) {
          params[filter.field] = filter.value;
        }
      }
    }
    const response = await axiosInstance.get(`/${resource}`, { params });
    return {
      data: response.data,
      total: response.data.length,
    };
  },
  getOne: async ({ resource, id }) => {
    const response = await axiosInstance.get(`/${resource}/${id}`);
    return {
      data: response.data,
    };
  },
  create: async ({ resource, variables }) => {
    const response = await axiosInstance.post(`/${resource}`, variables);
    return {
      data: response.data,
    };
  },
  update: async ({ resource, id, variables }) => {
    const response = await axiosInstance.put(`/${resource}/${id}`, variables);
    return {
      data: response.data,
    };
  },
  deleteOne: async ({ resource, id, variables }) => {
    const response = await axiosInstance.delete(`/${resource}/${id}`, { data: variables });
    return {
      data: response.data,
    };
  },
  getApiUrl: () => 'http://localhost:3000/admin-api',
};
