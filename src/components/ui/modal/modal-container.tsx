"use client";

import type { Variants } from "motion/react";
import { motion } from "motion/react";
import type React from "react";
import { MODAL_SIZE } from "@/components/ui/modal/modal";
import useMobileDetection from "@/hooks/use-mobile-detection";
import { cn } from "@/lib/utils";
import type { ModalSize } from "@/stores/modal.types";

const effect: Variants = {
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
			duration: 0.2,
		},
	},
	exit: {
		y: "1vh",
		scale: 0.9,
		opacity: 0,
		transition: {
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
	const isFull = size === "full";

	return (
		<motion.div
			tabIndex={-1}
			className={cn(
				"relative inset-0 z-60",
				"flex flex-col scroll-auto",
				isFull
					? "fixed inset-0 h-full w-full"
					: "gap-6 rounded-xl border shadow-sm m-1 max-h-full max-w-full",
				isMobile && !isFull ? "h-full !w-full px-6" : !isFull && "p-6",
				className || (isFull ? "bg-white" : "gap-6 bg-white shadow"),
			)}
			style={
				isFull
					? { zIndex: zIndex }
					: {
							width: MODAL_SIZE[size || "md"],
							zIndex: zIndex,
						}
			}
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
