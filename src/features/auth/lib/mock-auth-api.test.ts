import { describe, expect, it } from 'vitest';

import {
  loginWithPassword,
  signupWithPassword,
} from '@/features/auth/lib/mock-auth-api';

describe('mock-auth-api', () => {
  it('logs in with a valid email', async () => {
    const result = await loginWithPassword({
      email: 'demo@example.com',
      password: 'password123',
    });

    expect(result.user.email).toBe('demo@example.com');
  });

  it('fails login for the configured invalid email', async () => {
    await expect(
      loginWithPassword({ email: 'fail@example.com', password: 'password123' }),
    ).rejects.toThrow('이메일 또는 비밀번호를 다시 확인해 주세요.');
  });

  it('fails signup for a taken email', async () => {
    await expect(
      signupWithPassword({
        confirmPassword: 'password123',
        email: 'taken@example.com',
        name: '테스트',
        password: 'password123',
      }),
    ).rejects.toThrow(
      '이미 사용 중인 이메일입니다. 다른 이메일을 입력해 주세요.',
    );
  });
});
