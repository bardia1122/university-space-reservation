import { USE_MOCK, delay, apiClient } from './client';
import { db } from '../mock/data';
import type { DashboardStats, SpaceUsageStats } from '../types';

export const analyticsApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    if (USE_MOCK) {
      await delay();
      const reservations = db.reservations.getAll();
      const spaces = db.spaces.getAll();
      const complaints = db.complaints.getAll();
      return {
        total_reservations: reservations.length,
        pending_reservations: reservations.filter((r) => r.status === 'pending').length,
        approved_reservations: reservations.filter((r) => r.status === 'approved').length,
        total_users: 4,
        total_spaces: spaces.length,
        open_complaints: complaints.filter((c) => c.status === 'open').length,
        avg_rating: 4.3,
      };
    }
    const res = await apiClient.get<DashboardStats>('/analytics/dashboard');
    return res.data;
  },

  getSpaceUsage: async (): Promise<SpaceUsageStats[]> => {
    if (USE_MOCK) {
      await delay();
      const spaces = db.spaces.getAll();
      return spaces.map((space) => {
        const reservations = db.reservations.getAll({ space_id: space.id });
        return {
          space_id: space.id,
          space_name: space.name,
          total_reservations: reservations.length,
          approved_count: reservations.filter(
            (r) => r.status === 'approved' || r.status === 'completed',
          ).length,
          rejected_count: reservations.filter((r) => r.status === 'rejected').length,
          avg_rating: space.avg_rating,
        };
      });
    }
    const res = await apiClient.get<SpaceUsageStats[]>('/analytics/spaces/usage');
    return res.data;
  },

  getCalendar: async (year: number, month: number, spaceId?: number) => {
    if (USE_MOCK) {
      await delay(200);
      const reservations = db.reservations.getAll(spaceId ? { space_id: spaceId } : undefined);
      return reservations
        .filter((r) => {
          const d = new Date(r.reservation_date);
          return (
            d.getFullYear() === year &&
            d.getMonth() + 1 === month &&
            ['pending', 'approved'].includes(r.status)
          );
        })
        .map((r) => ({
          date: r.reservation_date,
          start_time: r.start_time,
          end_time: r.end_time,
          status: r.status,
          title: r.activity_title,
          space_name: r.space?.name ?? '',
        }));
    }
    const res = await apiClient.get('/analytics/reservations/calendar', {
      params: { year, month, space_id: spaceId },
    });
    return res.data;
  },
};
