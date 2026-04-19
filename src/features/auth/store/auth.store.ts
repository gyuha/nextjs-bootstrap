'use client';

import { create } from 'zustand';

import type { AuthUser } from '@/features/auth/types/auth';

interface AuthState {
  clearUser: () => void;
  isAuthenticated: boolean;
  setUser: (user: AuthUser) => void;
  user: AuthUser | null;
}

export const useAuthStore = create<AuthState>((set) => ({
  clearUser: () => set({ isAuthenticated: false, user: null }),
  isAuthenticated: false,
  setUser: (user) => set({ isAuthenticated: true, user }),
  user: null,
}));

export const selectAuthUser = (state: AuthState) => state.user;
export const selectIsAuthenticated = (state: AuthState) =>
  state.isAuthenticated;
