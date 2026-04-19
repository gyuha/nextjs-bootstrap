import type { Metadata } from 'next';
import { Suspense } from 'react';

import { AuthShell } from '@/components/layout/auth-shell';
import { LoginForm } from '@/features/auth/components/login-form';

export const metadata: Metadata = {
  title: '로그인 | Next.js Bootstrap',
};

export default function LoginPage() {
  return (
    <AuthShell
      description="이메일과 비밀번호를 입력하고 mock 로그인 흐름과 상태 갱신을 확인하세요."
      title="로그인 흐름 확인"
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
