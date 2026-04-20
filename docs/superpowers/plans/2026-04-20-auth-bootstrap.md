# Auth Bootstrap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Next.js App Router 기반 프론트엔드 부트스트랩 프로젝트에 회원가입/로그인 샘플 페이지를 mock 기반으로 구현한다.

**Architecture:** `src/app` 중심의 App Router 구조를 사용하고, 인증 기능은 `src/features/auth` 아래에 feature 단위로 분리한다. UI는 shadcn/ui와 Tailwind CSS를 기반으로 하고, 폼 상태와 검증은 React Hook Form + Zod, 인증 UI 상태는 Zustand, 비동기 제출 흐름은 TanStack Query mutation으로 구성한다.

**Tech Stack:** Next.js (App Router), TypeScript, React 19, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, React Hook Form, Zod, Motion, Bun, Biome

---

## File Structure

| File | Responsibility |
|------|---------------|
| `package.json` | 의존성 및 스크립트 |
| `tsconfig.json` | TypeScript 설정 (절대 경로 alias 포함) |
| `next.config.ts` | Next.js 설정 |
| `biome.json` | Biome 포맷/린트 설정 |
| `components.json` | shadcn/ui 설정 |
| `src/app/globals.css` | Tailwind + shadcn/ui CSS 변수 |
| `src/app/layout.tsx` | 루트 레이아웃 (providers 포함) |
| `src/app/page.tsx` | 홈 페이지 (인증 상태 표시) |
| `src/app/providers.tsx` | TanStack Query Provider |
| `src/app/(auth)/login/page.tsx` | 로그인 페이지 |
| `src/app/(auth)/signup/page.tsx` | 회원가입 페이지 |
| `src/components/layout/auth-shell.tsx` | 분할 레이아웃 셸 |
| `src/features/auth/types/auth.ts` | 인증 관련 타입 |
| `src/features/auth/schema/auth.schema.ts` | Zod 스키마 |
| `src/features/auth/lib/mock-auth-api.ts` | mock API 함수 |
| `src/features/auth/store/auth.store.ts` | Zustand 인증 스토어 |
| `src/features/auth/hooks/use-auth-mutation.ts` | TanStack Query mutation 훅 |
| `src/features/auth/components/login-form.tsx` | 로그인 폼 |
| `src/features/auth/components/signup-form.tsx` | 회원가입 폼 |
| `src/lib/query-client.ts` | QueryClient 인스턴스 |
| `src/lib/utils.ts` | shadcn/ui 유틸 (cn 함수) |

---

## Task 1: 프로젝트 부트스트랩

**Files:**
- Create: `package.json` (via `bun create next-app`)
- Create: `tsconfig.json` (via scaffold)
- Create: `next.config.ts` (via scaffold)
- Create: `biome.json`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `src/app/globals.css`

- [ ] **Step 1: Next.js 프로젝트 생성**

```bash
cd /Users/gyuha/workspace
bun create next-app nextjs-bootstrap --ts --tailwind --eslint --app --src-dir --no-import-alias --use-bun
```

기존 파일(README.md 등)은 덮어쓰지 않도록 주의. 이미 존재하는 파일은 수동으로 병합.

실제 실행 시 기존 디렉토리에 이미 파일이 있으므로 임시 디렉토리에 생성 후 복사:

```bash
cd /tmp
rm -rf nextjs-bootstrap-tmp
bun create next-app nextjs-bootstrap-tmp --ts --tailwind --eslint --app --src-dir --no-import-alias --use-bun
cp -r /tmp/nextjs-bootstrap-tmp/* /Users/gyuha/workspace/nextjs-bootstrap/
cp /tmp/nextjs-bootstrap-tmp/.eslintrc.json /Users/gyuha/workspace/nextjs-bootstrap/ 2>/dev/null || true
cp /tmp/nextjs-bootstrap-tmp/.gitignore /Users/gyuha/workspace/nextjs-bootstrap/
rm -rf /tmp/nextjs-bootstrap-tmp
```

- [ ] **Step 2: 추가 의존성 설치**

```bash
cd /Users/gyuha/workspace/nextjs-bootstrap
bun add zustand @tanstack/react-query react-hook-form @hookform/resolvers zod motion
```

- [ ] **Step 3: Biome 설치 및 설정**

```bash
bun add -d @biomejs/biome
```

`biome.json` 생성:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "organizeImports": { "enabled": true },
  "linter": { "enabled": true, "rules": { "recommended": true } },
  "formatter": { "enabled": true, "indentStyle": "tab" },
  "javascript": { "formatter": { "quoteStyle": "double" } }
}
```

`package.json`에 스크립트 추가:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "biome check .",
    "format": "biome format --write ."
  }
}
```

- [ ] **Step 4: tsconfig.json에 절대 경로 alias 설정**

`tsconfig.json`의 `compilerOptions`에 추가:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

- [ ] **Step 5: 기본 홈 페이지 수정**

`src/app/page.tsx`를 임시 기본 페이지로 설정:

```tsx
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold">Auth Bootstrap</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Next.js 프론트엔드 시작 템플릿
      </p>
    </main>
  );
}
```

- [ ] **Step 6: 검증**

```bash
cd /Users/gyuha/workspace/nextjs-bootstrap
bun install
bunx tsc --noEmit
bun run lint
```

Expected: 모든 명령 성공

- [ ] **Step 7: 커밋**

```bash
git add -A
git commit -m "chore: bootstrap Next.js project with Bun, Tailwind, Biome"
```

---

## Task 2: UI 기초 및 shadcn/ui 세팅

**Files:**
- Modify: `src/app/globals.css`
- Create: `components.json`
- Create: `src/components/ui/button.tsx`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/input.tsx`
- Create: `src/components/ui/label.tsx`
- Create: `src/components/ui/form.tsx`
- Create: `src/components/ui/alert.tsx`
- Create: `src/lib/utils.ts`
- Create: `src/components/layout/auth-shell.tsx`

- [ ] **Step 1: shadcn/ui 초기화**

```bash
cd /Users/gyuha/workspace/nextjs-bootstrap
bunx shadcn@latest init -d
```

`components.json`이 자동 생성됨. 기본값 사용 (New York style, neutral color).

- [ ] **Step 2: 필요한 컴포넌트 추가**

```bash
bunx shadcn@latest add button card input label form alert
```

- [ ] **Step 3: Auth Shell 컴포넌트 작성**

`src/components/layout/auth-shell.tsx`:

```tsx
"use client";

import { motion } from "motion/react";

interface AuthShellProps {
  children: React.ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Branding - left on desktop, top on mobile */}
      <div className="flex flex-col items-center justify-center bg-gradient-to-br from-primary/90 to-primary/60 p-8 text-primary-foreground md:w-1/2 md:p-12">
        <h1 className="text-3xl font-bold md:text-4xl">Auth Bootstrap</h1>
        <p className="mt-3 max-w-sm text-center text-primary-foreground/80">
          Next.js 프론트엔드 시작 템플릿
        </p>
      </div>

      {/* Form area - right on desktop, bottom on mobile */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: 검증**

```bash
bunx tsc --noEmit
bun run lint
```

Expected: 통과

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "feat: add shadcn/ui components and auth-shell layout"
```

---

## Task 3: 전역 Provider 구성

**Files:**
- Create: `src/app/providers.tsx`
- Create: `src/lib/query-client.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: QueryClient 인스턴스 생성**

`src/lib/query-client.ts`:

```ts
import { QueryClient } from "@tanstack/react-query";

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      mutations: {
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
```

- [ ] **Step 2: Providers 컴포넌트 작성**

`src/app/providers.tsx`:

```tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query-client";

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
```

- [ ] **Step 3: 루트 레이아웃에 Providers 연결**

`src/app/layout.tsx` 수정 — `<Providers>`로 body children 감싸기:

```tsx
import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auth Bootstrap",
  description: "Next.js 프론트엔드 시작 템플릿",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: 검증**

```bash
bunx tsc --noEmit
bun run lint
```

Expected: 통과

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "feat: add TanStack Query provider"
```

---

## Task 4: 인증 도메인 타입과 스키마 정의

**Files:**
- Create: `src/features/auth/types/auth.ts`
- Create: `src/features/auth/schema/auth.schema.ts`

- [ ] **Step 1: 타입 정의**

`src/features/auth/types/auth.ts`:

```ts
export interface AuthUser {
  name: string;
  email: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUser;
  message?: string;
}
```

- [ ] **Step 2: Zod 스키마 작성**

`src/features/auth/schema/auth.schema.ts`:

```ts
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "이메일을 입력해 주세요").email("올바른 이메일 형식이 아닙니다"),
  password: z.string().min(1, "비밀번호를 입력해 주세요"),
});

export const signupSchema = z
  .object({
    name: z.string().min(1, "이름을 입력해 주세요").min(2, "이름은 2자 이상이어야 합니다"),
    email: z.string().min(1, "이메일을 입력해 주세요").email("올바른 이메일 형식이 아닙니다"),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해 주세요"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
```

- [ ] **Step 3: 검증**

```bash
bunx tsc --noEmit
bun run lint
```

Expected: 통과

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "feat: add auth types and Zod schemas"
```

---

## Task 5: mock 인증 API 작성

**Files:**
- Create: `src/features/auth/lib/mock-auth-api.ts`

- [ ] **Step 1: mock API 함수 작성**

`src/features/auth/lib/mock-auth-api.ts`:

```ts
import type { AuthResponse, LoginInput, SignupInput } from "../types/auth";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockLogin(input: LoginInput): Promise<AuthResponse> {
  await delay(750);

  if (input.email === "fail@example.com") {
    return { success: false, message: "이메일 또는 비밀번호가 올바르지 않습니다" };
  }

  return {
    success: true,
    user: { name: "사용자", email: input.email },
  };
}

export async function mockSignup(input: SignupInput): Promise<AuthResponse> {
  await delay(750);

  if (input.email === "taken@example.com") {
    return { success: false, message: "이미 가입된 이메일입니다" };
  }

  return {
    success: true,
    user: { name: input.name, email: input.email },
  };
}
```

- [ ] **Step 2: 검증**

```bash
bunx tsc --noEmit
bun run lint
```

Expected: 통과

- [ ] **Step 3: 커밋**

```bash
git add -A
git commit -m "feat: add mock auth API with delay and error cases"
```

---

## Task 6: Zustand 인증 상태 스토어 작성

**Files:**
- Create: `src/features/auth/store/auth.store.ts`

- [ ] **Step 1: 스토어 작성**

`src/features/auth/store/auth.store.ts`:

```ts
import { create } from "zustand";
import type { AuthUser } from "../types/auth";

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  setUser: (user) => set({ isAuthenticated: true, user }),
  clearUser: () => set({ isAuthenticated: false, user: null }),
}));
```

- [ ] **Step 2: 검증**

```bash
bunx tsc --noEmit
bun run lint
```

Expected: 통과

- [ ] **Step 3: 커밋**

```bash
git add -A
git commit -m "feat: add Zustand auth store"
```

---

## Task 7: 공통 인증 mutation 훅 작성

**Files:**
- Create: `src/features/auth/hooks/use-auth-mutation.ts`

- [ ] **Step 1: mutation 훅 작성**

`src/features/auth/hooks/use-auth-mutation.ts`:

```ts
import { useMutation } from "@tanstack/react-query";
import { mockLogin, mockSignup } from "../lib/mock-auth-api";
import { useAuthStore } from "../store/auth.store";
import type { LoginInput, SignupInput } from "../types/auth";

export function useLoginMutation() {
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (input: LoginInput) => mockLogin(input),
    onSuccess: (response) => {
      if (response.success && response.user) {
        setUser(response.user);
      }
    },
  });
}

export function useSignupMutation() {
  return useMutation({
    mutationFn: (input: SignupInput) => mockSignup(input),
  });
}
```

- [ ] **Step 2: 검증**

```bash
bunx tsc --noEmit
bun run lint
```

Expected: 통과

- [ ] **Step 3: 커밋**

```bash
git add -A
git commit -m "feat: add auth mutation hooks"
```

---

## Task 8: 로그인 페이지 구현

**Files:**
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/features/auth/components/login-form.tsx`

- [ ] **Step 1: 로그인 폼 컴포넌트 작성**

`src/features/auth/components/login-form.tsx`:

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useLoginMutation } from "../hooks/use-auth-mutation";
import { loginSchema, type LoginFormData } from "../schema/auth.schema";

export function LoginForm() {
  const router = useRouter();
  const mutation = useLoginMutation();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(data: LoginFormData) {
    mutation.mutate(data, {
      onSuccess: (response) => {
        if (response.success) {
          router.push("/");
        }
      },
    });
  }

  const errorMessage = mutation.data && !mutation.data.success
    ? mutation.data.message
    : mutation.error?.message
      ? "로그인에 실패했습니다"
      : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>로그인</CardTitle>
        <CardDescription>이메일과 비밀번호를 입력해 주세요</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert variant="destructive">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="비밀번호를 입력해 주세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "로그인 중..." : "로그인"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
              회원가입
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: 로그인 페이지 작성**

`src/app/(auth)/login/page.tsx`:

```tsx
import { AuthShell } from "@/components/layout/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}
```

- [ ] **Step 3: 검증**

```bash
bunx tsc --noEmit
bun run lint
```

Expected: 통과

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "feat: implement login page with form validation"
```

---

## Task 9: 회원가입 페이지 구현

**Files:**
- Create: `src/app/(auth)/signup/page.tsx`
- Create: `src/features/auth/components/signup-form.tsx`

- [ ] **Step 1: 회원가입 폼 컴포넌트 작성**

`src/features/auth/components/signup-form.tsx`:

```tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useSignupMutation } from "../hooks/use-auth-mutation";
import { signupSchema, type SignupFormData } from "../schema/auth.schema";

export function SignupForm() {
  const router = useRouter();
  const mutation = useSignupMutation();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  function onSubmit(data: SignupFormData) {
    mutation.mutate(data, {
      onSuccess: (response) => {
        if (response.success) {
          router.push("/login");
        }
      },
    });
  }

  const errorMessage = mutation.data && !mutation.data.success
    ? mutation.data.message
    : mutation.error?.message
      ? "회원가입에 실패했습니다"
      : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>회원가입</CardTitle>
        <CardDescription>계정을 만들어 시작하세요</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Alert variant="destructive">
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이름</FormLabel>
                <FormControl>
                  <Input placeholder="홍길동" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>이메일</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="8자 이상 입력해 주세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>비밀번호 확인</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="비밀번호를 다시 입력해 주세요" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "가입 중..." : "회원가입"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="text-primary underline-offset-4 hover:underline">
              로그인
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
```

- [ ] **Step 2: 회원가입 페이지 작성**

`src/app/(auth)/signup/page.tsx`:

```tsx
import { AuthShell } from "@/components/layout/auth-shell";
import { SignupForm } from "@/features/auth/components/signup-form";

export default function SignupPage() {
  return (
    <AuthShell>
      <SignupForm />
    </AuthShell>
  );
}
```

- [ ] **Step 3: 검증**

```bash
bunx tsc --noEmit
bun run lint
```

Expected: 통과

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "feat: implement signup page with form validation"
```

---

## Task 10: 홈 화면 및 인증 상태 연결

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: 홈 페이지 수정**

`src/app/page.tsx`:

```tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function HomePage() {
  const { isAuthenticated, user, clearUser } = useAuthStore();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-4xl font-bold">Auth Bootstrap</h1>
      <p className="text-lg text-muted-foreground">Next.js 프론트엔드 시작 템플릿</p>

      <Card className="mt-4 w-full max-w-md">
        <CardContent className="pt-6">
          {isAuthenticated && user ? (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">현재 로그인 상태</p>
              <p className="text-lg font-medium">{user.name} ({user.email})</p>
              <Button variant="outline" onClick={clearUser}>
                로그아웃
              </Button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-sm text-muted-foreground">로그인이 필요합니다</p>
              <div className="flex gap-3 justify-center">
                <Button asChild>
                  <Link href="/login">로그인</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/signup">회원가입</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
```

- [ ] **Step 2: 검증**

```bash
bunx tsc --noEmit
bun run lint
```

Expected: 통과

- [ ] **Step 3: 커밋**

```bash
git add -A
git commit -m "feat: add auth state display to home page"
```

---

## Task 11: 최종 품질 점검

**Files:**
- Modify: `README.md`

- [ ] **Step 1: README 작성**

`README.md`:

```md
# Auth Bootstrap

Next.js App Router 기반 프론트엔드 시작 템플릿입니다.
회원가입/로그인 샘플 페이지를 mock 기반으로 구현했습니다.

## 기술 스택

Next.js (App Router), TypeScript, React 19, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, React Hook Form, Zod, Motion, Bun, Biome

## 실행 방법

```bash
bun install
bun run dev
```

## 구현 범위

- `/` — 홈 (인증 상태 표시)
- `/login` — 로그인 페이지
- `/signup` — 회원가입 페이지

## Mock 정책

- 모든 요청에 750ms 지연
- `fail@example.com`으로 로그인 시 실패
- `taken@example.com`으로 회원가입 시 실패
```

- [ ] **Step 2: 전체 검증**

```bash
bun run lint
bunx tsc --noEmit
bun run build
```

Expected: 모든 명령 통과

- [ ] **Step 3: 수동 검증**

```bash
bun run dev
```

- `/login` 페이지 렌더링 확인
- `/signup` 페이지 렌더링 확인
- 폼 검증 동작 확인 (빈 값, 잘못된 이메일, 짧은 비밀번호)
- `fail@example.com` 로그인 실패 확인
- 정상 이메일 로그인 성공 후 홈에서 상태 표시 확인
- `taken@example.com` 회원가입 실패 확인
- 정상 회원가입 성공 후 로그인 페이지 이동 확인

- [ ] **Step 4: 커밋**

```bash
git add -A
git commit -m "docs: update README with project info and mock policy"
```
