"use client";

import { useState } from "react";
import { AuthShell } from "@/components/layout/auth-shell";
import { LoginForm } from "@/features/auth/components/login-form";
import { SignupForm } from "@/features/auth/components/signup-form";

export default function LoginPage() {
	const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");

	return (
		<AuthShell>
			{mode === "login" && (
				<LoginForm
					onSwitch={() => setMode("signup")}
					onForgot={() => setMode("forgot")}
				/>
			)}
			{mode === "signup" && (
				<SignupForm onSwitch={() => setMode("login")} />
			)}
			{mode === "forgot" && (
				<ForgotForm onBack={() => setMode("login")} />
			)}
		</AuthShell>
	);
}

function ForgotForm({ onBack }: { onBack: () => void }) {
	const [sent, setSent] = useState(false);
	const [email, setEmail] = useState("");

	return (
		<form
			className="tw-auth-form"
			onSubmit={(e) => {
				e.preventDefault();
				setSent(true);
			}}
		>
			<header className="tw-auth-head">
				<button type="button" className="tw-back-btn" onClick={onBack}>
					<svg
						width="14"
						height="14"
						viewBox="0 0 20 20"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.6"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M16 10H4M9 5l-5 5 5 5" />
					</svg>
					로그인으로
				</button>
				<h2>{sent ? "메일을 확인해 주세요" : "비밀번호 재설정"}</h2>
				<p>
					{sent
						? "입력하신 주소로 재설정 링크를 보냈어요. 메일이 오지 않았다면 스팸함을 확인해 주세요."
						: "가입하신 이메일로 재설정 링크를 보내드려요."}
				</p>
			</header>

			{!sent && (
				<div className="tw-fields">
					<div className="tw-field">
						<div className="tw-field-top">이메일</div>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="name@example.com"
						/>
					</div>
				</div>
			)}

			{sent && (
				<div className="tw-sent-card">
					<div className="tw-s-ic">✉</div>
					<div>
						<b>{email || "seoyeon.writer@naver.com"}</b>
						<span>3분 이내로 도착해요 · 링크는 1시간 동안 유효</span>
					</div>
				</div>
			)}

			<button type="submit" className="tw-submit">
				{sent ? (
					<>메일 다시 보내기</>
				) : (
					<>
						재설정 링크 받기{" "}
						<svg
							width="16"
							height="16"
							viewBox="0 0 20 20"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.6"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M4 10h12M11 5l5 5-5 5" />
						</svg>
					</>
				)}
			</button>
		</form>
	);
}
