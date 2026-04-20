"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { useLoginMutation } from "../hooks/use-auth-mutation";
import { type LoginFormData, loginSchema } from "../schema/auth.schema";

export function LoginForm() {
	const router = useRouter();
	const mutation = useLoginMutation();

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	function onSubmit(data: LoginFormData) {
		mutation.mutate(data, {
			onSuccess: (response) => {
				if (response.success) {
					router.push("/");
				}
			},
		});
	}

	const errorMessage =
		mutation.data && !mutation.data.success
			? mutation.data.message
			: mutation.error?.message
				? "로그인에 실패했습니다"
				: null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>로그인</CardTitle>
				<CardDescription>이메일과 비밀번호를 입력해 주세요</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<AnimatePresence>
						{errorMessage && (
							<motion.div
								initial={{ opacity: 0, height: 0 }}
								animate={{ opacity: 1, height: "auto" }}
								exit={{ opacity: 0, height: 0 }}
							>
								<Alert variant="destructive">
									<AlertDescription>{errorMessage}</AlertDescription>
								</Alert>
							</motion.div>
						)}
					</AnimatePresence>

					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>이메일</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="you@example.com"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel>비밀번호</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder="비밀번호를 입력해 주세요"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button
						type="submit"
						className="w-full"
						disabled={mutation.isPending}
					>
						{mutation.isPending ? "로그인 중..." : "로그인"}
					</Button>

					<p className="text-center text-sm text-muted-foreground">
						계정이 없으신가요?{" "}
						<Link
							href="/signup"
							className="text-primary underline-offset-4 hover:underline"
						>
							회원가입
						</Link>
					</p>
				</form>
			</CardContent>
		</Card>
	);
}
