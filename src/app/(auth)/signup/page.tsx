"use client";

import { useState } from "react";
import { AuthShell } from "@/components/layout/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";
import { SignupForm } from "@/features/auth/components/signup-form";

export default function SignupPage() {
	const [mode, setMode] = useState<"login" | "signup">("signup");

	return (
		<AuthShell>
			{mode === "signup" && (
				<SignupForm onSwitch={() => setMode("login")} />
			)}
			{mode === "login" && (
				<LoginForm
					onSwitch={() => setMode("signup")}
					onForgot={() => {}}
				/>
			)}
		</AuthShell>
	);
}
