"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function HomePage() {
	const { isAuthenticated, user, clearUser } = useAuthStore();

	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
			<h1 className="text-4xl font-bold">Auth Bootstrap</h1>
			<p className="text-lg text-muted-foreground">
				Next.js 프론트엔드 시작 템플릿
			</p>

			<Card className="mt-4 w-full max-w-md">
				<CardContent className="pt-6">
					{isAuthenticated && user ? (
						<div className="space-y-4 text-center">
							<p className="text-sm text-muted-foreground">현재 로그인 상태</p>
							<p className="text-lg font-medium">
								{user.name} ({user.email})
							</p>
							<Button variant="outline" onClick={clearUser}>
								로그아웃
							</Button>
						</div>
					) : (
						<div className="space-y-4 text-center">
							<p className="text-sm text-muted-foreground">
								로그인이 필요합니다
							</p>
							<div className="flex gap-3 justify-center">
								<Link
									href="/login"
									className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-2.5 h-8 text-sm font-medium hover:bg-primary/80"
								>
									로그인
								</Link>
								<Link
									href="/signup"
									className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-2.5 h-8 text-sm font-medium hover:bg-muted hover:text-foreground"
								>
									회원가입
								</Link>
							</div>
						</div>
					)}
				</CardContent>
			</Card>
		</main>
	);
}
