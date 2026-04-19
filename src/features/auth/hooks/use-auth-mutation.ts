'use client';

import { useMutation } from '@tanstack/react-query';

import {
  loginWithPassword,
  signupWithPassword,
} from '@/features/auth/lib/mock-auth-api';
import { useAuthStore } from '@/features/auth/store/auth.store';

export function useLoginMutation() {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: loginWithPassword,
    onSuccess: ({ user }) => {
      setUser(user);
    },
  });
}

export function useSignupMutation() {
  return useMutation({
    // Registration keeps the user on the explicit login path instead of auto-authing.
    mutationFn: signupWithPassword,
  });
}
