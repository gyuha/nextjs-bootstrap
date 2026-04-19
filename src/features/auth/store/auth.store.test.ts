import { beforeEach, describe, expect, it } from 'vitest';

import { useAuthStore } from '@/features/auth/store/auth.store';

describe('auth.store', () => {
  beforeEach(() => {
    useAuthStore.setState(useAuthStore.getInitialState());
  });

  it('stores a user on login', () => {
    useAuthStore
      .getState()
      .setUser({ email: 'demo@example.com', name: 'demo' });

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(useAuthStore.getState().user?.name).toBe('demo');
  });

  it('clears a user on logout', () => {
    useAuthStore
      .getState()
      .setUser({ email: 'demo@example.com', name: 'demo' });
    useAuthStore.getState().clearUser();

    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
  });
});
