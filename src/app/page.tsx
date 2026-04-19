'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  selectAuthUser,
  selectIsAuthenticated,
  useAuthStore,
} from '@/features/auth/store/auth.store';

export default function HomePage() {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const user = useAuthStore(selectAuthUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center gap-6 px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-3xl space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-accent">
            Next.js Auth Bootstrap
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
            로그인/회원가입 샘플을 바로 붙여 쓸 수 있는 프론트엔드 베이스.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            App Router, Tailwind CSS, shadcn/ui 스타일 컴포넌트, Zustand,
            TanStack Query, React Hook Form, Zod 조합으로 mock 인증 흐름을
            구성했습니다.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/login">로그인 열기</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/signup">회원가입 열기</Link>
          </Button>
          {isAuthenticated ? (
            <Button onClick={clearUser} size="lg" variant="ghost">
              로그아웃 상태로 되돌리기
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>현재 인증 상태</CardTitle>
            <CardDescription>
              로그인 성공 후 홈으로 돌아오면 Zustand 상태가 이 영역에
              반영됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="text-sm text-muted-foreground">상태</p>
              <p className="mt-2 text-lg font-medium">
                {isAuthenticated ? '로그인됨' : '비로그인'}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
              <p className="text-sm text-muted-foreground">사용자</p>
              <p className="mt-2 text-lg font-medium">
                {user ? `${user.name} (${user.email})` : '없음'}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>샘플 검증 포인트</CardTitle>
            <CardDescription>
              UI와 상태 흐름을 빠르게 확인할 때 볼 부분입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>1. `fail@example.com`으로 로그인 실패 메시지 확인</p>
            <p>2. `taken@example.com`으로 회원가입 실패 메시지 확인</p>
            <p>3. 정상 로그인 후 홈 상태 카드 반영 확인</p>
            <p>4. 잘못된 입력값에 대한 필드별 Zod 검증 메시지 확인</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
