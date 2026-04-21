# Auth Bootstrap Design Spec

## Overview

Next.js App Router 기반 프론트엔드 부트스트랩 프로젝트. 회원가입/로그인 샘플 페이지를 mock 기반으로 구현한다.

## Tech Stack

Next.js (App Router), TypeScript, React 19, Tailwind CSS, shadcn/ui, Zustand, TanStack Query, React Hook Form, Zod, Motion, Bun, Biome

## Project Structure

```
src/
├── app/                       # App Router
│   ├── globals.scss
│   ├── layout.tsx             # 루트 레이아웃
│   ├── page.tsx               # 홈
│   ├── providers.tsx          # TanStack Query Provider
│   └── (auth)/
│       ├── login/page.tsx
│       └── signup/page.tsx
├── components/
│   ├── layout/auth-shell.tsx  # 분할 레이아웃 셸
│   └── ui/                    # shadcn/ui 컴포넌트
├── features/auth/
│   ├── components/
│   │   ├── login-form.tsx
│   │   └── signup-form.tsx
│   ├── hooks/use-auth-mutation.ts
│   ├── lib/mock-auth-api.ts
│   ├── schema/auth.schema.ts
│   ├── store/auth.store.ts
│   └── types/auth.ts
└── lib/
    ├── query-client.ts
    └── utils.ts
```

## Auth Shell Layout (Split Layout)

모든 인증 페이지의 공통 레이아웃.

- **Desktop**: 좌/우 50:50 분할
  - 좌측: 그라디언트 배경 (shadcn/ui primary 기반) + 프로젝트명 + 설명 텍스트
  - 우측: 폼 카드 (로그인/회원가입)
- **Mobile** (md 이하): 상/하 스택
  - 상단: 짧은 브랜딩 영역
  - 하단: 폼 카드
- Motion으로 카드 fade-in 등장 효과

## Auth Forms

### Login Form

- 이메일 + 비밀번호 입력
- `fail@example.com` → mock 실패 반환
- 성공 시 Zustand 상태 업데이트 후 `/` 리다이렉트
- 제출 중 버튼 disabled + 로딩 스피너

### Signup Form

- 이름 + 이메일 + 비밀번호 + 비밀번호 확인
- Zod 검증: 이메일 형식, 비밀번호 최소 길이, 비밀번호 확인 일치
- `taken@example.com` → "이미 가입된 이메일" mock 실패
- 성공 시 `/login` 리다이렉트

## State Management

### Zustand (전역 인증 상태)

```
isAuthenticated: boolean
user: { name: string; email: string } | null
setUser(user): void
clearUser(): void
```

폼 상태는 Zustand에 넣지 않음.

### React Hook Form

폼 입력값, validation 에러, touched 상태 관리.

### TanStack Query

`useMutation`으로 mock API 호출. 로딩/에러/성공 상태 처리.

`useQuery`는 1차 범위에서 사용하지 않음.

## Mock API Policy

- 모든 mock 함수는 500~1000ms 지연
- 로그인: `fail@example.com` → 실패
- 회원가입: `taken@example.com` → 실패
- 그 외 → 성공

## Motion Interactions

- 카드 등장: fade-in
- 에러 메시지: fade-in/out
- 과한 페이지 전환 애니메이션 없음
- 접근성 해치지 않는 수준

## Theme

shadcn/ui 기본 라이트/다크 테마. 별도 커스텀 없음.

## Initialization

`bun create next-app`으로 스캐폴딩 후 필요한 패키지 추가 설치.

## Acceptance Criteria

- `/login`, `/signup` 페이지 정상 렌더링
- 폼 필수 입력값 + 형식 검증 동작
- 오류 메시지 필드 단위 표시
- 제출 중 로딩 상태 표시
- mock 성공/실패 케이스 확인 가능
- 로그인 성공 시 Zustand 상태 갱신
- 홈에서 인증 상태 확인 가능
- `bun run lint` + `bunx tsc --noEmit` 통과
