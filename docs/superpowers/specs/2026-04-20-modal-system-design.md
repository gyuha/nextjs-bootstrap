# Modal System Design Spec

## Overview

`gyuha/nextjs-sse` 리포지토리의 모달 시스템을 전체 포팅한다. Zustand 스토어 기반 스택 관리, discriminated union 타입, compound component 패턴을 사용한다.

## Source

https://github.com/gyuha/nextjs-sse/tree/main/src

## File Structure

```
src/
├── stores/
│   ├── modal-store.ts          # Zustand 스토어 (immer, devtools)
│   └── modal.types.ts          # Discriminated union 타입
├── components/ui/modal/
│   ├── modal.tsx               # Compound component 진입점
│   ├── modal-container.tsx     # 애니메이션 컨테이너
│   ├── modal-manager.tsx       # 루트 매니저 (포털, 포커스락)
│   ├── modal-backdrop.tsx      # 배경 오버레이
│   ├── modal-default.tsx       # alert/content 변형 렌더러
│   ├── modal-form.tsx          # form 변형 렌더러
│   └── modal-header.tsx        # 헤더 (제목 + 닫기 버튼)
├── hooks/
│   └── use-modal.tsx           # 커스텀 훅 (스토어 셀렉터)
```

## Architecture

### State Layer (modal-store.ts)

Zustand 스토어 + immer + devtools. `modals` 배열을 LIFO 스택으로 관리.

```ts
openModal(modal: ModalProps | string | JSX.Element, hiddenBottom?: boolean)
closeModal()
closeAllModal()
reset()
```

### Type Layer (modal.types.ts)

Discriminated union으로 4가지 변형:

- `ModalAlertProps` — `alert` 필드 (간단 메시지)
- `ContentModalProps` — `content` + optional `info` 필드
- `FormModalProps` — `form` 필드
- `CustomModalProps` — `custom` 필드 (임의 JSX)

공통 옵션: `size`, `zIndex`, `portal`, `portalTarget`, `backdropDismiss`, `disabledEscKey`, `focusLockDisabled`

### Manager Layer (modal-manager.tsx)

루트 컴포넌트. 스토어의 `modals` 배열을 구독하여 렌더링.

- Escape key dismiss
- FocusLock (react-focus-lock)
- AnimatePresence (motion)
- createPortal (portal 모달)
- Sequential z-index

### Component Layer (modal.tsx)

Compound component 패턴:

- `Modal.Ground` — backdrop wrapper, backdropDismiss 처리
- `Modal.Container` — animated frame, 사이즈별 스타일
- `Modal.Header` — 제목 + 닫기 버튼
- `Modal.Content` — 스크롤 가능한 콘텐츠 영역
- `Modal.Footer` — 하단 버튼 바

### Variant Renderers

- `modal-default.tsx` — alert, content 변형 (Cancel/OK 버튼)
- `modal-form.tsx` — form 변형 (헤더 + 콘텐츠만)
- custom 변형은 `Modal.Container`로 직접 렌더링

## Key Adaptations

### framer-motion → motion

소스의 `framer-motion` import를 `motion/react`로 변경:

```ts
// Before (source)
import { motion, AnimatePresence } from "framer-motion"
// After (our project)
import { motion, AnimatePresence } from "motion/react"
```

### Icons

소스의 `@radix-ui/react-icons` `Cross2Icon`을 lucide-react `X`로 교체 (현재 프로젝트가 shadcn/ui + lucide 사용 중).

### Providers

`ModalManager`를 `src/app/providers.tsx`에 추가.

## Dependencies

| Package | Status |
|---------|--------|
| zustand | 이미 설치됨 |
| immer | 설치 필요 |
| motion | 이미 설치됨 |
| react-focus-lock | 설치 필요 |
| @radix-ui/react-icons | 설치 필요 (Cross2Icon용, lucide X로 대체 시 불필요) |
| uuid | 설치 필요 |

## API Usage

```ts
const { openModal, closeModal, closeAllModal } = useModal();

// 간단 사용
openModal("메시지")
openModal({ alert: "알림", size: "sm" })

// 컨텐츠 모달
openModal({
  title: "제목",
  content: <MyContent />,
  size: "lg",
})

// 폼 모달
openModal({
  title: "제목",
  form: <MyForm />,
  size: "md",
})

// 커스텀
openModal({ custom: <MyComponent />, size: "md" })

// 닫기
closeModal()       // 최상단 모달
closeAllModal()    // 전체
```

## Integration Point

`providers.tsx`에 `ModalManager` 추가:

```tsx
export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ModalManager />
    </QueryClientProvider>
  );
}
```
