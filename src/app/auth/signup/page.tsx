import { AuthShell } from '@/components/layout/auth-shell';
import { SignupForm } from '@/features/auth/components/signup-form';
import Link from 'next/link';

export default function SignupPage() {
  return (
    <AuthShell
      title="회원가입"
      subtitle={
        <>
          이미 계정이 있으신가요?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            로그인
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthShell>
  );
}
