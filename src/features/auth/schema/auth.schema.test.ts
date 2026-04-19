import { describe, expect, it } from 'vitest';

import { loginSchema, signupSchema } from '@/features/auth/schema/auth.schema';

describe('auth.schema', () => {
  it('rejects invalid login email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    });

    expect(result.success).toBe(false);
  });

  it('rejects mismatched signup passwords', () => {
    const result = signupSchema.safeParse({
      confirmPassword: 'password124',
      email: 'user@example.com',
      name: '홍길동',
      password: 'password123',
    });

    expect(result.success).toBe(false);
  });
});
