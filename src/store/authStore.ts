import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

const storedUser = localStorage.getItem('current_user');
const storedToken = localStorage.getItem('access_token');

export const useAuthStore = create<AuthState>((set) => ({
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  token: storedToken ?? null,
  isAuthenticated: !!storedToken && !!storedUser,
  isAdmin: storedUser ? ['admin', 'super_admin'].includes(JSON.parse(storedUser).role) : false,

  setAuth: (user, token) => {
    localStorage.setItem('current_user', JSON.stringify(user));
    localStorage.setItem('access_token', token);
    set({
      user,
      token,
      isAuthenticated: true,
      isAdmin: ['admin', 'super_admin'].includes(user.role),
    });
  },

  logout: () => {
    localStorage.removeItem('current_user');
    localStorage.removeItem('access_token');
    set({ user: null, token: null, isAuthenticated: false, isAdmin: false });
  },
}));
