"use client";

import type React from "react";
import Modal from "@/components/ui/modal/modal";
import type { ModalProps } from "@/stores/modal.types";

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
			<Modal.Header hideCloseButton={hideCloseButton}>{title}</Modal.Header>
			<Modal.Content>
				<div className={className}>{form}</div>
			</Modal.Content>
		</Modal.Container>
	);
};

export default ModalForm;
