import { USE_MOCK, delay, apiClient } from './client';
import { db } from '../mock/data';
import type { Reservation, ReservationCreate, ReservationStatus } from '../types';

export const reservationsApi = {
  create: async (data: ReservationCreate, userId: number): Promise<Reservation> => {
    if (USE_MOCK) {
      await delay();
      return db.reservations.create({ ...data, user_id: userId }) as Reservation;
    }
    const res = await apiClient.post<Reservation>('/reservations', data);
    return res.data;
  },

  getMyReservations: async (userId: number, status?: ReservationStatus): Promise<Reservation[]> => {
    if (USE_MOCK) {
      await delay();
      return db.reservations.getByUser(userId, status);
    }
    const res = await apiClient.get<Reservation[]>('/reservations/my', { params: { status } });
    return res.data;
  },

  getAll: async (filters?: {
    status?: ReservationStatus;
    space_id?: number;
  }): Promise<Reservation[]> => {
    if (USE_MOCK) {
      await delay();
      return db.reservations.getAll(filters);
    }
    const res = await apiClient.get<Reservation[]>('/reservations', { params: filters });
    return res.data;
  },

  getById: async (id: number): Promise<Reservation> => {
    if (USE_MOCK) {
      await delay(200);
      const r = db.reservations.getById(id);
      if (!r) throw new Error('رزرو یافت نشد');
      return r;
    }
    const res = await apiClient.get<Reservation>(`/reservations/${id}`);
    return res.data;
  },

  cancel: async (id: number): Promise<Reservation> => {
    if (USE_MOCK) {
      await delay();
      const r = db.reservations.cancel(id);
      if (!r) throw new Error('رزرو یافت نشد');
      return r;
    }
    const res = await apiClient.post<Reservation>(`/reservations/${id}/cancel`);
    return res.data;
  },

  review: async (
    id: number,
    status: 'approved' | 'rejected',
    adminNote?: string,
  ): Promise<Reservation> => {
    if (USE_MOCK) {
      await delay();
      const r = db.reservations.review(id, status, adminNote);
      if (!r) throw new Error('رزرو یافت نشد');
      return r;
    }
    const res = await apiClient.post<Reservation>(`/reservations/${id}/review`, {
      status,
      admin_note: adminNote,
    });
    return res.data;
  },
};
