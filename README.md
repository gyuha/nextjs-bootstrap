# nextjs-bootstrap

Next.js App Router 기반의 프론트엔드 부트스트랩 예제입니다. 로그인/회원가입 샘플을 프론트 단독 mock 흐름으로 구현해 두었습니다.

## Stack

- Next.js (App Router)
- TypeScript
- React 19
- Tailwind CSS
- shadcn/ui style components
- Zustand
- TanStack Query
- React Hook Form
- Zod
- Framer Motion
- Bun
- Biome

## Pages

- `/`
- `/login`
- `/signup`

## Mock rules

- 로그인 실패: `fail@example.com`
- 회원가입 실패: `taken@example.com`, `fail@example.com`

## Run

```bash
bun install
bun run dev
```

## Checks

```bash
bun run test
bun run lint
bun run typecheck
```
