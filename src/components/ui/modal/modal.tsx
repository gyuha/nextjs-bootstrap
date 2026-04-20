"use client";

import type React from "react";
import { useEffect } from "react";
import ModalContainer from "@/components/ui/modal/modal-container";
import ModalDefault from "@/components/ui/modal/modal-default";
import ModalForm from "@/components/ui/modal/modal-form";
import ModalHeader from "@/components/ui/modal/modal-header";
import { cn } from "@/lib/utils";
import type { ModalProps, ModalSize } from "@/stores/modal.types";
import useModal from "@/stores/modal-store";

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

function ModalInner({
	className,
	size = "md",
	forcusLockDisabled,
	zIndex,
	...rest
}: ModalProps): React.JSX.Element | null {
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
			<ModalForm {...rest} className={className} size={size} zIndex={zIndex} />
		);
	}

	if ("custom" in rest) {
		const { custom } = rest;
		return (
			<Modal.Container className={className} size={size} zIndex={zIndex}>
				{custom}
			</Modal.Container>
		);
	}

	return <Modal.Container>Need any content...</Modal.Container>;
}

function ModalGround({ children }: { children: React.ReactNode }) {
	const { modals, modalCount, closeModal } = useModal();

	const closeModalByClick = () => {
		if (modals[modalCount() - 1]?.backdropDismiss === true) {
			return;
		}
		closeModal();
	};

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: modal backdrop click handler
		<div
			className={cn(
				"fixed inset-0 z-50 flex h-full w-full items-center justify-center",
			)}
			role="presentation"
			onClick={(e) => {
				e.stopPropagation();
				closeModalByClick();
			}}
		>
			{children}
		</div>
	);
}

function ModalContent({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("w-full overflow-y-auto overflow-x-hidden", className)}>
			{children}
		</div>
	);
}

function ModalFooter({ children }: { children: React.ReactNode }) {
	return (
		<div className={cn("grid grid-flow-col justify-items-stretch gap-x-1")}>
			{children}
		</div>
	);
}

const Modal = Object.assign(ModalInner, {
	Ground: ModalGround,
	Container: ModalContainer,
	Header: ModalHeader,
	Content: ModalContent,
	Footer: ModalFooter,
});

export default Modal;
