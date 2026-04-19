import { AuthShell } from '@/components/layout/auth-shell';
import { SignupForm } from '@/features/auth/components/signup-form';

export default function SignupPage() {
  return (
    <AuthShell
      description="회원가입 폼 검증과 mock 제출 결과를 확인할 수 있는 샘플 화면입니다."
      title="회원가입 샘플 구현"
    >
      <SignupForm />
    </AuthShell>
  );
}
