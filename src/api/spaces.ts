import { USE_MOCK, delay, apiClient } from './client';
import { db } from '../mock/data';
import type { Space, SpaceType, SpaceStatus } from '../types';

export const spacesApi = {
  getAll: async (params?: { space_type?: SpaceType; status?: SpaceStatus }): Promise<Space[]> => {
    if (USE_MOCK) {
      await delay();
      return db.spaces.getAll(params?.space_type, params?.status);
    }
    const res = await apiClient.get<Space[]>('/spaces', { params });
    return res.data;
  },

  getById: async (id: number): Promise<Space> => {
    if (USE_MOCK) {
      await delay(200);
      const space = db.spaces.getById(id);
      if (!space) throw new Error('فضا یافت نشد');
      return space;
    }
    const res = await apiClient.get<Space>(`/spaces/${id}`);
    return res.data;
  },

  create: async (data: Partial<Space>): Promise<Space> => {
    if (USE_MOCK) {
      await delay();
      return db.spaces.create(data);
    }
    const res = await apiClient.post<Space>('/spaces', data);
    return res.data;
  },

  update: async (id: number, data: Partial<Space>): Promise<Space> => {
    if (USE_MOCK) {
      await delay();
      const updated = db.spaces.update(id, data);
      if (!updated) throw new Error('فضا یافت نشد');
      return updated;
    }
    const res = await apiClient.put<Space>(`/spaces/${id}`, data);
    return res.data;
  },

  delete: async (id: number): Promise<void> => {
    if (USE_MOCK) {
      await delay();
      db.spaces.delete(id);
      return;
    }
    await apiClient.delete(`/spaces/${id}`);
  },
};
