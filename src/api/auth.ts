import { USE_MOCK, delay, apiClient } from './client';
import { mockUsers } from '../mock/data';
import type { Token, User } from '../types';

export const authApi = {
  login: async (email: string, password: string): Promise<Token & { user: User }> => {
    if (USE_MOCK) {
      await delay();
      const user = mockUsers.find((u) => u.email === email);
      if (!user || password.length < 6) {
        throw new Error('ایمیل یا رمز عبور اشتباه است');
      }
      const token = `mock_token_${user.id}_${user.role}`;
      return {
        access_token: token,
        refresh_token: `mock_refresh_${user.id}`,
        token_type: 'bearer',
        user,
      };
    }
    const form = new URLSearchParams();
    form.append('username', email);
    form.append('password', password);
    const res = await apiClient.post<Token>('/auth/login', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const me = await authApi.getMe();
    return { ...res.data, user: me };
  },

  register: async (data: {
    full_name: string;
    email: string;
    password: string;
    student_id?: string;
    department?: string;
    phone?: string;
    role?: string;
  }): Promise<User> => {
    if (USE_MOCK) {
      await delay();
      const existing = mockUsers.find((u) => u.email === data.email);
      if (existing) throw new Error('این ایمیل قبلاً ثبت شده است');
      const newUser: User = {
        id: mockUsers.length + 10,
        full_name: data.full_name,
        email: data.email,
        student_id: data.student_id,
        phone: data.phone,
        department: data.department,
        role: (data.role as User['role']) ?? 'student',
        is_active: true,
        is_verified: false,
        created_at: new Date().toISOString(),
      };
      mockUsers.push(newUser);
      return newUser;
    }
    const res = await apiClient.post<User>('/auth/register', data);
    return res.data;
  },

  getMe: async (): Promise<User> => {
    if (USE_MOCK) {
      await delay(100);
      const stored = localStorage.getItem('current_user');
      if (stored) return JSON.parse(stored) as User;
      throw new Error('Not authenticated');
    }
    const res = await apiClient.get<User>('/auth/me');
    return res.data;
  },
};
