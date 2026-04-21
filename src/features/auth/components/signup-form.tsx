"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
import { useSignupMutation } from "../hooks/use-auth-mutation";
import { type SignupFormData, signupSchema } from "../schema/auth.schema";
import { useAuthStore } from "../store/auth.store";

export function SignupForm() {
	const router = useRouter();
	const mutation = useSignupMutation();
	const { hasHydrated, isAuthenticated } = useAuthStore();

	const form = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
	});

	function onSubmit(data: SignupFormData) {
		mutation.mutate(data, {
			onSuccess: (response) => {
				if (response.success) {
					router.push("/login");
				}
			},
		});
	}

	useEffect(() => {
		if (hasHydrated && isAuthenticated) {
			router.replace("/");
		}
	}, [hasHydrated, isAuthenticated, router]);

	const errorMessage =
		mutation.data && !mutation.data.success
			? mutation.data.message
			: mutation.error?.message
				? "회원가입에 실패했습니다"
				: null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>회원가입</CardTitle>
				<CardDescription>계정을 만들어 시작하세요</CardDescription>
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
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>이름</FormLabel>
								<FormControl>
									<Input placeholder="홍길동" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

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
										placeholder="8자 이상 입력해 주세요"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="confirmPassword"
						render={({ field }) => (
							<FormItem>
								<FormLabel>비밀번호 확인</FormLabel>
								<FormControl>
									<Input
										type="password"
										placeholder="비밀번호를 다시 입력해 주세요"
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
						{mutation.isPending ? "가입 중..." : "회원가입"}
					</Button>

					<p className="text-center text-sm text-muted-foreground">
						이미 계정이 있으신가요?{" "}
						<Link
							href="/login"
							className="text-primary underline-offset-4 hover:underline"
						>
							로그인
						</Link>
					</p>
				</form>
			</CardContent>
		</Card>
	);
}
