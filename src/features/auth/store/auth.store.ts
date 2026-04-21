import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
	AUTH_SESSION_STORAGE_KEY,
	syncAuthSessionCookie,
} from "../lib/auth-session";
import type { AuthUser } from "../types/auth";

interface AuthState {
	isAuthenticated: boolean;
	user: AuthUser | null;
	hasHydrated: boolean;
	setUser: (user: AuthUser) => void;
	clearUser: () => void;
	setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			isAuthenticated: false,
			user: null,
			hasHydrated: false,
			setUser: (user) => {
				syncAuthSessionCookie(true);
				set({ isAuthenticated: true, user });
			},
			clearUser: () => {
				syncAuthSessionCookie(false);
				set({ isAuthenticated: false, user: null });
			},
			setHasHydrated: (value) => set({ hasHydrated: value }),
		}),
		{
			name: AUTH_SESSION_STORAGE_KEY,
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				isAuthenticated: state.isAuthenticated,
				user: state.user,
			}),
			onRehydrateStorage: () => (state, error) => {
				if (error || !state?.isAuthenticated || !state.user) {
					syncAuthSessionCookie(false);
					state?.setHasHydrated(true);
					return;
				}

				syncAuthSessionCookie(true);
				state.setHasHydrated(true);
			},
		},
	),
);
