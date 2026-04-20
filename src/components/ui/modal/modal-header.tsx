"use client";

import { X } from "lucide-react";
import type React from "react";
import { cn } from "@/lib/utils";
import useModal from "@/stores/modal-store";

interface IModalHeaderProps {
	children: React.ReactNode;
	hideCloseButton?: boolean;
	handleClose?: () => void;
}

const ModalHeader = ({
	children,
	hideCloseButton,
	handleClose,
}: IModalHeaderProps): React.JSX.Element | null => {
	const { closeModal } = useModal();

	return (
		<>
			{(children && <div className="font-bold text-lg">{children}</div>) ||
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
