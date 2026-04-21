"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/features/auth/store/auth.store";

export default function HomePage() {
	const router = useRouter();
	const { hasHydrated, isAuthenticated, user, clearUser } = useAuthStore();

	useEffect(() => {
		if (hasHydrated && !isAuthenticated) {
			router.replace("/login");
		}
	}, [hasHydrated, isAuthenticated, router]);

	if (!hasHydrated || !isAuthenticated || !user) {
		return (
			<main className="flex min-h-screen flex-col items-center justify-center gap-3 p-8">
				<p className="text-sm font-medium text-muted-foreground">
					세션을 확인하는 중입니다...
				</p>
			</main>
		);
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
			<h1 className="text-4xl font-bold">Auth Bootstrap</h1>
			<p className="text-lg text-muted-foreground">
				Next.js 프론트엔드 시작 템플릿
			</p>

			<Card className="mt-4 w-full max-w-md">
				<CardContent className="pt-6">
					<div className="space-y-4 text-center">
						<p className="text-sm text-muted-foreground">현재 로그인 상태</p>
						<p className="text-lg font-medium">
							{user.name} ({user.email})
						</p>
						<Button variant="outline" onClick={clearUser}>
							로그아웃
						</Button>
					</div>
				</CardContent>
			</Card>
		</main>
	);
}
