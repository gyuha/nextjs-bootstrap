# Modal System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** nextjs-sse 리포지토리의 모달 시스템을 전체 포팅하여 현재 프로젝트에 적용한다.

**Architecture:** Zustand + immer 기반 스택 관리, discriminated union 타입, compound component 패턴. framer-motion → motion/react 변환, Cross2Icon → lucide X 교체.

**Tech Stack:** Zustand, immer, motion/react, react-focus-lock, dompurify, lucide-react

---

## File Structure

| File | Responsibility |
|------|---------------|
| `src/lib/utils.ts` | cn 함수 + uuid 유틸 추가 |
| `src/hooks/use-mobile-detection.tsx` | 모바일 감지 훅 (모달 컨테이너용) |
| `src/hooks/use-mobile.tsx` | 모바일 감지 훅 (모달 디폴트용) |
| `src/components/ui/string-to-html.tsx` | 문자열/JSX 렌더링 유틸 |
| `src/stores/modal.types.ts` | 모달 discriminated union 타입 |
| `src/stores/modal-store.ts` | Zustand 모달 스토어 (immer + devtools) |
| `src/components/ui/modal/modal.tsx` | Compound component 진입점 |
| `src/components/ui/modal/modal-container.tsx` | 애니메이션 컨테이너 |
| `src/components/ui/modal/modal-header.tsx` | 헤더 (제목 + 닫기 버튼) |
| `src/components/ui/modal/modal-backdrop.tsx` | 배경 오버레이 |
| `src/components/ui/modal/modal-default.tsx` | alert/content 변형 렌더러 |
| `src/components/ui/modal/modal-form.tsx` | form 변형 렌더러 |
| `src/components/ui/modal/modal-manager.tsx` | 루트 매니저 |
| `src/app/providers.tsx` | ModalManager 통합 |

---

## Task 1: 의존성 설치 및 유틸리티 함수 추가

**Files:**
- Modify: `src/lib/utils.ts`
- Create: `src/hooks/use-mobile-detection.tsx`
- Create: `src/hooks/use-mobile.tsx`
- Create: `src/components/ui/string-to-html.tsx`

- [ ] **Step 1: 의존성 설치**

```bash
cd /Users/gyuha/workspace/nextjs-bootstrap
bun add immer react-focus-lock dompurify
bun add -d @types/dompurify
```

- [ ] **Step 2: uuid() 함수를 utils.ts에 추가**

`src/lib/utils.ts`에 추가:

```ts
export function uuid(numberOfCharacters = 8): string {
	let uidStr = Date.now()
		.toString(36)
		.slice(-4)
		.split("")
		.reverse()
		.join("");
	if (numberOfCharacters <= 4) {
		return uidStr.slice(0, numberOfCharacters);
	}
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < numberOfCharacters - 4; i++) {
		uidStr += characters.charAt(
			Math.floor(Math.random() * characters.length),
		);
	}
	return uidStr;
}
```

- [ ] **Step 3: use-mobile-detection 훅 작성**

`src/hooks/use-mobile-detection.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

const useMobileDetection = (maxWidth = 768) => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobileSize = () => {
			setIsMobile(window.innerWidth <= maxWidth);
		};

		checkMobileSize();

		window.addEventListener("resize", checkMobileSize);

		return () => {
			window.removeEventListener("resize", checkMobileSize);
		};
	}, [maxWidth]);

	return isMobile;
};

export default useMobileDetection;
```

- [ ] **Step 4: use-mobile 훅 작성**

`src/hooks/use-mobile.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

export function useMobile() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkIfMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};

		checkIfMobile();

		window.addEventListener("resize", checkIfMobile);

		return () => {
			window.removeEventListener("resize", checkIfMobile);
		};
	}, []);

	return isMobile;
}
```

- [ ] **Step 5: StringToHtml 컴포넌트 작성**

`src/components/ui/string-to-html.tsx`:

```tsx
import DOMPurify from "dompurify";
import type React from "react";

interface IStringToHtmlProps {
	text: string | React.ReactNode | React.JSX.Element | null;
}

const StringToHtml = ({
	text,
}: IStringToHtmlProps): React.ReactNode | React.JSX.Element | null => {
	if (typeof text === "string") {
		const sanitizedData = DOMPurify.sanitize(text);
		return <div dangerouslySetInnerHTML={{ __html: sanitizedData }} />;
	}
	return text;
};

export default StringToHtml;
```

- [ ] **Step 6: 검증**

```bash
bunx tsc --noEmit
bun run lint
```

Expected: 통과

- [ ] **Step 7: 커밋**

```bash
git add -A
git commit -m "feat: add modal dependencies and utility functions"
```

---

## Task 2: 모달 타입 및 스토어

**Files:**
- Create: `src/stores/modal.types.ts`
- Create: `src/stores/modal-store.ts`

- [ ] **Step 1: 모달 타입 정의**

`src/stores/modal.types.ts`:

```ts
type ModalSize = "sm" | "md" | "lg" | "xl" | "full" | "half" | "2xl" | "3xl";

type ModalHeaderProps = {
	title?: string;
	hideCloseButton?: boolean;
};

type ModalHandleProps = {
	hideBottomButton?: boolean;
	hideBottomCancelButton?: boolean;
	handleCancel?: () => void;
	handleOk?: () => void;
	handleClose?: () => void;
	txtCancel?: string;
	txtOK?: string;
	disabledCancel?: boolean;
	disabledOk?: boolean;
};

type ModalAlertProps = {
	alert: React.ReactNode | string;
} & ModalHeaderProps &
	ModalHandleProps;

type ContentModalProps = {
	info?: React.ReactNode | string;
	content: React.ReactNode | string;
} & ModalHeaderProps &
	ModalHandleProps;

type FormModalProps = {
	form: React.ReactNode | string;
} & ModalHeaderProps;

type CustomModalProps = {
	custom: React.ReactNode | string;
};

type ModalProps = {
	id?: string;
	className?: string;
	size?: ModalSize;
	height?: string;
	backdropDismiss?: boolean;
	disabledEscKey?: boolean;
	zIndex?: number;
	forcusLockDisabled?: boolean;
	portal?: boolean;
	portalTarget?: React.RefObject<HTMLElement | null>;
} & (
	| ModalAlertProps
	| ContentModalProps
	| FormModalProps
	| CustomModalProps
);

export type {
	ModalSize,
	ModalProps,
	ModalAlertProps,
	ContentModalProps,
	FormModalProps,
	CustomModalProps,
	ModalHeaderProps,
	ModalHandleProps,
};
```

- [ ] **Step 2: 모달 스토어 작성**

`src/stores/modal-store.ts`:

```ts
import React from "react";
import type { JSX } from "react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import type { ModalProps } from "./modal.types";

interface IModalState {
	modals: ModalProps[];
	focusLockDisabled: boolean;
}

export interface IModalStore extends IModalState {
	modalCount: () => number;
	openModal: (
		modalProp: ModalProps | string | JSX.Element,
		hideBottomButton?: boolean,
		options?: {
			portal?: boolean;
			portalTarget?: React.RefObject<HTMLElement | null>;
		},
	) => void;
	closeModal: () => void;
	closeAllModal: () => void;
	setFocusLockDisabled: (lock: boolean) => void;
	reset: () => void;
}

const initialState: IModalState = {
	modals: [],
	focusLockDisabled: false,
};

const useModal = create<IModalStore>()(
	devtools(
		immer((set, get) => ({
			...initialState,
			modalCount: () => get().modals.length,
			openModal: (
				props: ModalProps | string | JSX.Element,
				hideBottomButton = false,
				options?: {
					portal?: boolean;
					portalTarget?: React.RefObject<HTMLElement | null>;
				},
			) => {
				if (typeof props === "string" || React.isValidElement(props)) {
					get().openModal(
						{
							alert: props,
							size: "sm",
							height: "auto",
							hideBottomButton,
							...(options?.portal && options?.portalTarget
								? { portal: true, portalTarget: options.portalTarget }
								: {}),
						},
					);
					return;
				}

				const portalOptions =
					options?.portal && options?.portalTarget
						? { portal: true, portalTarget: options.portalTarget }
						: {};

				const modalProps = {
					...props,
					...portalOptions,
				};

				set((state) => ({ modals: [...state.modals, modalProps] }));
			},
			closeModal: () => {
				set((state) => ({
					modals: state.modals.slice(0, state.modals.length - 1),
				}));
			},
			closeAllModal: () => {
				set(initialState);
			},
			setFocusLockDisabled: (lock: boolean) => {
				set({ focusLockDisabled: lock });
			},
			reset: () => {
				set(initialState);
			},
		})),
		{
			enabled: true,
		},
	),
);

export default useModal;
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
git commit -m "feat: add modal types and Zustand store"
```

---

## Task 3: 핵심 모달 컴포넌트

**Files:**
- Create: `src/components/ui/modal/modal-container.tsx`
- Create: `src/components/ui/modal/modal-header.tsx`
- Create: `src/components/ui/modal/modal-backdrop.tsx`
- Create: `src/components/ui/modal/modal.tsx`

- [ ] **Step 1: modal-container.tsx 작성**

`src/components/ui/modal/modal-container.tsx`:

```tsx
"use client";

import { MODAL_SIZE } from "@/components/ui/modal/modal";
import useMobileDetection from "@/hooks/use-mobile-detection";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type React from "react";
import type { ModalSize } from "@/stores/modal.types";

const effect = {
	hidden: {
		y: "-1vh",
		scale: 0.9,
		opacity: 0,
	},
	visible: {
		y: "0",
		opacity: 1,
		scale: 1,
		transition: {
			type: "easeOut",
			duration: 0.2,
		},
	},
	exit: {
		y: "1vh",
		scale: 0.9,
		opacity: 0,
		transition: {
			type: "easeIn",
			duration: 0.2,
		},
	},
};

interface IModalContainerProps {
	className?: string;
	children: React.ReactNode;
	size?: ModalSize;
	zIndex?: number;
}

const ModalContainer = ({
	children,
	className,
	size = "md",
	zIndex,
}: IModalContainerProps): React.JSX.Element | null => {
	const isMobile = useMobileDetection();

	return (
		<motion.div
			tabIndex={-1}
			className={cn(
				"relative inset-0 rounded-xl z-60",
				"gap-6 rounded-xl border shadow-sm m-1",
				"flex max-h-full max-w-full flex-col scroll-auto",
				isMobile ? "h-full !w-full px-6" : "p-6",
				className || "gap-6 bg-white shadow",
			)}
			style={{
				width: MODAL_SIZE[size || "md"],
				zIndex: zIndex,
			}}
			variants={effect}
			initial="hidden"
			animate="visible"
			exit="exit"
			onClick={(event) => event.stopPropagation()}
		>
			{children}
		</motion.div>
	);
};

export default ModalContainer;
```

- [ ] **Step 2: modal-header.tsx 작성**

`src/components/ui/modal/modal-header.tsx`:

```tsx
"use client";

import { cn } from "@/lib/utils";
import useModal from "@/stores/modal-store";
import { X } from "lucide-react";
import type React from "react";

interface IModalHeaderProps {
	children: React.ReactNode;
	hideCloseButton?: boolean;
	className?: string;
	handleClose?: () => void;
}

const ModalHeader = ({
	children,
	className,
	hideCloseButton,
	handleClose,
}: IModalHeaderProps): React.JSX.Element | null => {
	const { closeModal } = useModal();

	return (
		<>
			{(children && (
				<div className="font-bold text-lg">{children}</div>
			)) ||
				null}
			{(!hideCloseButton && (
				<button
					type="button"
					onClick={handleClose ? handleClose : closeModal}
					className={cn(
						"absolute w-6 min-w-0 px-0 top-5 rounded-md hover:bg-muted",
						children ? "right-5 h-[30px]" : "right-6 h-6",
					)}
				>
					<span className="sr-only">Close</span>
					<X className="size-4" />
				</button>
			)) ||
				null}
		</>
	);
};

export default ModalHeader;
```

- [ ] **Step 3: modal-backdrop.tsx 작성**

`src/components/ui/modal/modal-backdrop.tsx`:

```tsx
"use client";

import { cn } from "@/lib/utils";
import useModal from "@/stores/modal-store";
import { motion } from "motion/react";
import type React from "react";
import { useEffect } from "react";

interface IModalBackdropProps {
	className?: string;
	children?: React.ReactNode;
	zIndex: number;
}

const ModalBackdrop = ({
	className,
	children,
	zIndex,
}: IModalBackdropProps): React.JSX.Element | null => {
	const { modals, modalCount, closeModal } = useModal();

	useEffect(() => {
		if (modalCount()) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [modals, modalCount]);

	if (!modalCount()) {
		return null;
	}

	return (
		<motion.div
			className={cn(
				"fixed inset-0 flex items-center justify-center backdrop-blur-sm",
				"bg-neutral-950 bg-opacity-60",
				className,
			)}
			style={{ zIndex }}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.2 }}
		>
			{children}
		</motion.div>
	);
};

export default ModalBackdrop;
```

- [ ] **Step 4: modal.tsx (compound component) 작성**

`src/components/ui/modal/modal.tsx`:

```tsx
"use client";

import ModalContainer from "@/components/ui/modal/modal-container";
import ModalDefault from "@/components/ui/modal/modal-default";
import ModalForm from "@/components/ui/modal/modal-form";
import ModalHeader from "@/components/ui/modal/modal-header";
import { cn } from "@/lib/utils";
import useModal from "@/stores/modal-store";
import type { ModalProps, ModalSize } from "@/stores/modal.types";
import type React from "react";
import { useEffect } from "react";

export const MODAL_Z_INDEX = 50;
export const MODAL_SIZE: Record<ModalSize, string> = {
	sm: "400px",
	md: "640px",
	lg: "800px",
	xl: "1000px",
	full: "100%",
	half: "50%",
	"2xl": "1200px",
	"3xl": "1400px",
};

const Modal = ({
	className,
	size = "md",
	forcusLockDisabled,
	zIndex,
	...rest
}: ModalProps): React.JSX.Element | null => {
	const { setFocusLockDisabled } = useModal();

	useEffect(() => {
		if (forcusLockDisabled !== undefined) {
			setFocusLockDisabled(!!forcusLockDisabled);
		}

		return () => {
			if (forcusLockDisabled) {
				setFocusLockDisabled(false);
			}
		};
	}, [forcusLockDisabled, setFocusLockDisabled]);

	if ("alert" in rest || "content" in rest) {
		return (
			<ModalDefault
				{...rest}
				className={className}
				size={size}
				zIndex={zIndex}
			/>
		);
	}

	if ("form" in rest) {
		return (
			<ModalForm
				{...rest}
				className={className}
				size={size}
				zIndex={zIndex}
			/>
		);
	}

	if ("custom" in rest) {
		const { custom } = rest;
		return (
			<Modal.Container
				className={className}
				size={size}
				zIndex={zIndex}
			>
				{custom}
			</Modal.Container>
		);
	}

	return <Modal.Container>Need any content...</Modal.Container>;
};

Modal.Ground = ({ children }: { children: React.ReactNode }) => {
	const { modals, modalCount, closeModal } = useModal();

	const closeModalByClick = () => {
		if (modals[modalCount() - 1]?.backdropDismiss === true) {
			return;
		}
		closeModal();
	};

	return (
		<div
			className={cn(
				"fixed inset-0 z-50 flex h-full w-full items-center justify-center",
			)}
			onClick={(e) => {
				e.stopPropagation();
				closeModalByClick();
			}}
		>
			{children}
		</div>
	);
};

Modal.Container = ModalContainer;
Modal.Header = ModalHeader;
Modal.Content = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => (
	<div className={cn("w-full overflow-y-auto overflow-x-hidden")}>
		{children}
	</div>
);
Modal.Footer = ({ children }: { children: React.ReactNode }) => (
	<div className={cn("grid grid-flow-col justify-items-stretch gap-x-1")}>
		{children}
	</div>
);

export default Modal;
```

- [ ] **Step 5: 검증**

```bash
bunx tsc --noEmit
bun run lint
```

Expected: 통과

- [ ] **Step 6: 커밋**

```bash
git add -A
git commit -m "feat: add core modal components"
```

---

## Task 4: 모달 변형 렌더러

**Files:**
- Create: `src/components/ui/modal/modal-default.tsx`
- Create: `src/components/ui/modal/modal-form.tsx`

- [ ] **Step 1: modal-default.tsx 작성**

`src/components/ui/modal/modal-default.tsx`:

```tsx
"use client";

import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal/modal";
import StringToHtml from "@/components/ui/string-to-html";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import useModal from "@/stores/modal-store";
import type { ModalProps } from "@/stores/modal.types";
import type React from "react";

const InfoContainer = ({ children }: { children: React.ReactNode }) => (
	<pre className={cn("my-6 justify-center gap-2.5 rounded-sm bg-zinc-100 px-4 py-3")}>
		{children}
	</pre>
);

const ContentContainer = ({ children }: { children: React.ReactNode }) => (
	<div className={cn("justify-center gap-2.5 text-base")}>{children}</div>
);

const AlertContainer = ({ children }: { children: React.ReactNode }) => (
	<div
		className={cn(
			"my-6 w-full justify-center gap-2.5 px-4 py-3 text-center text-base",
		)}
	>
		{children}
	</div>
);

const ModalDefault = ({
	className,
	size = "md",
	...rest
}: ModalProps): React.JSX.Element | null => {
	if (!("alert" in rest) && !("content" in rest)) {
		return null;
	}

	const { closeModal } = useModal();
	const isMobile = useMobile();

	const title = "title" in rest ? rest.title : undefined;
	const hideCloseButton =
		"hideCloseButton" in rest ? rest.hideCloseButton : false;
	const handleClose =
		"handleClose" in rest ? rest.handleClose : undefined;
	const handleOk = "handleOk" in rest ? rest.handleOk : undefined;
	const hideBottomButton =
		"hideBottomButton" in rest ? rest.hideBottomButton : undefined;
	const handleCancel =
		"handleCancel" in rest ? rest.handleCancel : undefined;
	const hideBottomCancelButton =
		"hideBottomCancelButton" in rest
			? rest.hideBottomCancelButton
			: undefined;
	const txtCancel = "txtCancel" in rest ? rest.txtCancel : undefined;

	return (
		<Modal.Container
			size={size}
			className={isMobile ? "justify-center gap-4 bg-white" : ""}
		>
			<Modal.Header
				hideCloseButton={hideCloseButton}
				handleClose={handleClose}
			>
				{title}
			</Modal.Header>
			<Modal.Content className={className}>
				<>
					{"info" in rest && (
						<InfoContainer>{rest.info}</InfoContainer>
					)}
					{"alert" in rest && (
						<AlertContainer>
							<StringToHtml text={rest.alert} />
						</AlertContainer>
					)}
					{"content" in rest && (
						<ContentContainer>
							<StringToHtml text={rest.content} />
						</ContentContainer>
					)}
				</>
			</Modal.Content>
			{!hideBottomButton && (
				<Modal.Footer>
					{handleCancel !== undefined
						? !hideBottomCancelButton
							? (
									<Button
										variant="secondary"
										size="lg"
										className="min-w-0 border-[1.5px] border-neutral-900"
										onClick={() => {
											handleCancel();
										}}
									>
										취소
									</Button>
								)
							: null
						: null}
					{txtCancel && !handleCancel && (
						<Button
							variant="secondary"
							size="lg"
							className="min-w-0 border-[1.5px] border-neutral-900"
							onClick={closeModal}
						>
							{txtCancel}
						</Button>
					)}
					<Button
						variant="default"
						size="lg"
						onClick={handleOk ? handleOk : closeModal}
						className={hideBottomCancelButton ? "w-40" : "min-w-0"}
					>
						확인
					</Button>
				</Modal.Footer>
			)}
		</Modal.Container>
	);
};

export default ModalDefault;
```

- [ ] **Step 2: modal-form.tsx 작성**

`src/components/ui/modal/modal-form.tsx`:

```tsx
"use client";

import Modal from "@/components/ui/modal/modal";
import type { ModalProps } from "@/stores/modal.types";
import type React from "react";

const ModalForm = ({
	className,
	size = "md",
	...rest
}: ModalProps): React.JSX.Element | null => {
	if (!("form" in rest)) {
		return null;
	}

	const title = "title" in rest ? rest.title : undefined;
	const hideCloseButton =
		"hideCloseButton" in rest ? rest.hideCloseButton : false;
	const { form } = rest;

	return (
		<Modal.Container size={size}>
			<Modal.Header hideCloseButton={hideCloseButton}>
				{title}
			</Modal.Header>
			<Modal.Content>
				<div className={className}>{form}</div>
			</Modal.Content>
		</Modal.Container>
	);
};

export default ModalForm;
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
git commit -m "feat: add modal variant renderers (default, form)"
```

---

## Task 5: 모달 매니저 및 Providers 통합

**Files:**
- Create: `src/components/ui/modal/modal-manager.tsx`
- Modify: `src/app/providers.tsx`

- [ ] **Step 1: modal-manager.tsx 작성**

`src/components/ui/modal/modal-manager.tsx`:

```tsx
"use client";

import Modal, { MODAL_Z_INDEX } from "@/components/ui/modal/modal";
import ModalBackdrop from "@/components/ui/modal/modal-backdrop";
import useModal from "@/stores/modal-store";
import { AnimatePresence } from "motion/react";
import { useCallback, useEffect } from "react";
import FocusLock from "react-focus-lock";
import { createPortal } from "react-dom";

const Modals = () => {
	const { modals, closeModal, focusLockDisabled, modalCount } = useModal();

	const handleKeyUp = useCallback(
		(e: KeyboardEvent) => {
			if (focusLockDisabled || modalCount() === 0) {
				return;
			}
			if (e.key === "Escape") {
				if (
					modals.length > 0 &&
					modals[modals.length - 1].disabledEscKey !== true
				) {
					closeModal();
				}
			}
		},
		[modals, closeModal, focusLockDisabled, modalCount],
	);

	useEffect(() => {
		document.addEventListener("keyup", handleKeyUp);

		return () => {
			document.removeEventListener("keyup", handleKeyUp);
		};
	}, [handleKeyUp]);

	const regularModals = modals.filter((modal) => !modal.portal);

	return (
		<AnimatePresence initial={false}>
			{regularModals.length > 0 && (
				<ModalBackdrop zIndex={MODAL_Z_INDEX} />
			)}
			{regularModals.map((modalProps, idx) => {
				const modalKey = modalProps.id || `modal-${idx}`;
				const zIndex = modalProps.zIndex || MODAL_Z_INDEX + idx;
				return (
					<Modal.Ground key={modalKey}>
						{!focusLockDisabled ? (
							<FocusLock>
								<Modal {...modalProps} zIndex={zIndex} />
							</FocusLock>
						) : (
							<Modal {...modalProps} zIndex={zIndex} />
						)}
					</Modal.Ground>
				);
			})}

			{modals
				.filter((modal) => modal.portal && modal.portalTarget?.current)
				.map((modalProps, idx) => {
					const modalKey =
						modalProps.id || `portal-modal-${idx}`;
					const zIndex =
						modalProps.zIndex ||
						MODAL_Z_INDEX + modals.length + idx;

					return modalProps.portalTarget?.current
						? createPortal(
								<AnimatePresence initial={false}>
									<ModalBackdrop
										zIndex={zIndex}
										className="absolute"
									>
										<Modal.Ground key={modalKey}>
											<Modal
												{...modalProps}
												zIndex={zIndex}
											/>
										</Modal.Ground>
									</ModalBackdrop>
								</AnimatePresence>,
								modalProps.portalTarget.current,
							)
						: null;
				})}
		</AnimatePresence>
	);
};

export default Modals;
```

- [ ] **Step 2: providers.tsx에 ModalManager 추가**

`src/app/providers.tsx` 수정:

```tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import ModalManager from "@/components/ui/modal/modal-manager";
import { getQueryClient } from "@/lib/query-client";

export function Providers({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ModalManager />
		</QueryClientProvider>
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
git commit -m "feat: add modal manager and integrate into providers"
```

---

## Task 6: 빌드 검증

- [ ] **Step 1: 전체 빌드**

```bash
bun run build
```

Expected: 빌드 성공

- [ ] **Step 2: 개발 서버 실행 및 수동 테스트**

```bash
bun run dev
```

확인 항목:
- 홈 페이지 정상 렌더링 (회귀 없음)
- `/login`, `/signup` 정상 동작
- 브라우저 콘솔에 모달 관련 에러 없음
