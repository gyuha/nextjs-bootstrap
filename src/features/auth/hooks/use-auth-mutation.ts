'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { mockLogin, mockSignup } from '../lib/mock-auth-api';
import { useAuthStore } from '../store/auth.store';
import type { LoginInput, SignupInput } from '../types/auth';

export function useLoginMutation() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: LoginInput) => mockLogin(data),
    onSuccess: (response) => {
      setUser(response.user);
      router.push('/');
    },
  });
}

export function useSignupMutation() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignupInput) => mockSignup(data),
    onSuccess: () => {
      toast.success('가입이 완료되었습니다!');
      router.push('/auth/login');
    },
  });
}
