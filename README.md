# Auth Bootstrap

Next.js App Router 기반 프론트엔드 시작 템플릿입니다.
회원가입/로그인 샘플 페이지를 mock 기반으로 구현했습니다.

## 기술 스택

Next.js (App Router), TypeScript, React 19, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, React Hook Form, Zod, Motion, pnpm, Biome

## 실행 방법

```bash
pnpm install
pnpm run dev
```

## 구현 범위

- `/` — 홈 (인증 상태 표시)
- `/auth/login` — 로그인 페이지
- `/auth/signup` — 회원가입 페이지

## Mock 정책

- 모든 요청에 750ms 지연
- `fail@example.com`으로 로그인 시 실패
- `taken@example.com`으로 회원가입 시 실패

## 검증 명령

```bash
pnpm run lint
pnpm exec tsc --noEmit
```
