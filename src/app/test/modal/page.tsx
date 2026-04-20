"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Modal from "@/components/ui/modal/modal";
import useModal from "@/stores/modal-store";

const FormSchema = z.object({
	username: z.string().min(2, {
		message: "이름은 2자 이상이어야 합니다.",
	}),
});

const InputForm = () => {
	const { openModal, closeModal } = useModal();
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			username: "",
		},
	});

	const onSubmit = (data: z.infer<typeof FormSchema>) => {
		openModal({
			title: "입력값:",
			content: (
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">{JSON.stringify(data, null, 2)}</code>
				</pre>
			),
		});
	};

	return (
		<FormProvider {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
				<Modal.Content>
					<FormField
						control={form.control}
						name="username"
						render={({ field }) => (
							<FormItem>
								<FormLabel>사용자 이름</FormLabel>
								<FormControl>
									<Input placeholder="이름 입력" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</Modal.Content>
				<Modal.Footer>
					<Button type="button" variant="secondary" onClick={closeModal}>
						취소
					</Button>
					<Button type="submit">확인</Button>
				</Modal.Footer>
			</form>
		</FormProvider>
	);
};

const CustomModalContent = () => {
	const { closeModal, openModal } = useModal();
	return (
		<div className="w-[340px] rounded-md p-4">
			<h1 className="font-semibold text-lg">커스텀 모달</h1>
			<p className="mt-2 text-sm text-muted-foreground">
				이 모달은 커스텀 변형입니다.
			</p>
			<div className="mt-4 flex gap-2">
				<Button
					variant="default"
					onClick={() =>
						openModal({
							title: "중첩 모달",
							custom: <CustomModalContent />,
							size: "md",
						})
					}
				>
					모달 열기 (중첩)
				</Button>
				<Button variant="secondary" onClick={() => closeModal()}>
					닫기
				</Button>
			</div>
		</div>
	);
};

const ModalTest = (): React.JSX.Element => {
	const { openModal } = useModal();

	return (
		<div className="mx-auto max-w-3xl p-8">
			<h1 className="text-2xl font-bold">모달 시스템 예제</h1>
			<p className="mt-2 text-muted-foreground">
				다양한 모달 변형을 테스트할 수 있습니다.
			</p>

			<div className="mt-8 space-y-4">
				<Card>
					<CardHeader>
						<CardTitle>Alert 모달</CardTitle>
						<CardDescription>간단한 메시지를 표시합니다.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							<Button
								variant="default"
								onClick={() =>
									openModal({
										alert: "알림 메시지입니다!",
									})
								}
							>
								Alert (객체)
							</Button>
							<Button
								variant="default"
								onClick={() => openModal("문자열 알림!")}
							>
								Alert (문자열)
							</Button>
							<Button
								variant="default"
								onClick={() =>
									openModal(
										<div className="text-red-600 font-bold">JSX 알림!</div>,
									)
								}
							>
								Alert (JSX)
							</Button>
							<Button
								variant="outline"
								onClick={() => openModal("버튼 없는 알림", true)}
							>
								Alert (버튼 숨김)
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Content 모달</CardTitle>
						<CardDescription>제목 + 콘텐츠를 표시합니다.</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							variant="default"
							onClick={() =>
								openModal({
									title: "콘텐츠 모달",
									info: "추가 정보 텍스트",
									content: "Hello, Modal!!!!",
									size: "lg",
								})
							}
						>
							Content 모달 열기
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Custom 모달</CardTitle>
						<CardDescription>
							임의 JSX를 모달로 렌더링합니다. 중첩 모달도 가능합니다.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							variant="default"
							onClick={() =>
								openModal({
									custom: <CustomModalContent />,
									size: "md",
								})
							}
						>
							Custom 모달 열기
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Form 모달</CardTitle>
						<CardDescription>폼이 포함된 모달입니다.</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							variant="default"
							onClick={() =>
								openModal({
									title: "사용자 정보 입력",
									custom: <InputForm />,
									size: "md",
								})
							}
						>
							Form 모달 열기
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>다양한 크기</CardTitle>
						<CardDescription>
							sm, md, lg, xl, full 크기를 지원합니다.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							<Button
								variant="outline"
								onClick={() => openModal({ alert: "Small", size: "sm" })}
							>
								SM
							</Button>
							<Button
								variant="outline"
								onClick={() => openModal({ alert: "Medium", size: "md" })}
							>
								MD
							</Button>
							<Button
								variant="outline"
								onClick={() => openModal({ alert: "Large", size: "lg" })}
							>
								LG
							</Button>
							<Button
								variant="outline"
								onClick={() => openModal({ alert: "Extra Large", size: "xl" })}
							>
								XL
							</Button>
							<Button
								variant="outline"
								onClick={() =>
									openModal({
										title: "Full Size",
										content: "전체 화면 모달입니다.",
										size: "full",
									})
								}
							>
								FULL
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};

export default ModalTest;
