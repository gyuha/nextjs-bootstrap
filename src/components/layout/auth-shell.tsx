"use client";

import { motion } from "motion/react";

interface AuthShellProps {
	children: React.ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
	return (
		<div className="flex min-h-screen flex-col md:flex-row">
			{/* Branding - left on desktop, top on mobile */}
			<div className="flex flex-col items-center justify-center bg-gradient-to-br from-primary/90 to-primary/60 p-8 text-primary-foreground md:w-1/2 md:p-12">
				<h1 className="text-3xl font-bold md:text-4xl">Auth Bootstrap</h1>
				<p className="mt-3 max-w-sm text-center text-primary-foreground/80">
					Next.js 프론트엔드 시작 템플릿
				</p>
			</div>

			{/* Form area - right on desktop, bottom on mobile */}
			<div className="flex flex-1 items-center justify-center p-6 md:p-12">
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, ease: "easeOut" }}
					className="w-full max-w-md"
				>
					{children}
				</motion.div>
			</div>
		</div>
	);
}
