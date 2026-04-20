"use client";

import { motion } from "motion/react";
import type React from "react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import useModal from "@/stores/modal-store";

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
	const { modalCount } = useModal();

	useEffect(() => {
		if (modalCount()) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [modalCount]);

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
