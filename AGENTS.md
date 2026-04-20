
## Commands

```bash
bun dev          # 개발 서버 (Turbopack)
bun build        # 프로덕션 빌드
bun start        # 프로덕션 서버
bun lint         # Biome lint
bun format       # Biome 포맷팅
```

## Tech Stack

- **Next.js 16.2.4** (React 19.2.4) - App Router 사용
- **Styling**: Tailwind CSS v4 + CSS 변수 기반 디자인
- **Lint/Format**: Biome (ESLint 아님)
- **State**: Zustand + Immer
- **Server State**: TanStack Query v5
- **Forms**: react-hook-form + Zod v4 + @hookform/resolvers
- **Components**: shadcn/ui 패턴 (class-variance-authority 사용)

## Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 라우트 그룹: 인증 페이지
│   ├── test/modal/        # 모달 테스트 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   └── providers.tsx      # QueryClient & ModalManager 프로바이더
├── components/ui/         # shadcn 스타일 재사용 컴포넌트
│   └── modal/             # 모달 시스템 (compound component)
├── features/              # 기능별 모듈 (auth 등)
│   └── auth/
│       ├── components/    # feature 전용 컴포넌트
│       ├── hooks/         # feature 전용 hooks
│       ├── lib/           # feature 전용 유틸리티
│       ├── schema/        # Zod 스키마
│       ├── store/         # Zustand 스토어
│       └── types/         # 타입 정의
├── stores/                # 전역 스토어 (modal-store 등)
├── lib/                   # 공통 유틸리티 (query-client, utils)
└── hooks/                 # 공통 hooks
```

## Important Notes

- **Next.js 16은 학습 데이터와 다른 breaking changes가 있음**. 코드 작성 전 `node_modules/next/dist/docs/`의 가이드를 반드시 읽을 것
- Tailwind CSS v4는旧的 설정과 다름 (postcss.config.mjs 사용)
- Biome 설정에 `tailwindDirectives: true`가 있어 Tailwind 중첩 클래스 사용 가능
- 모달 시스템은 zustand + portal 기반으로 동작, `useModal()` hook으로 제어
