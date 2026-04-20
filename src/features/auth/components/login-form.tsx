"use client";

import { useState } from "react";
import { Icons } from "@/components/ui/icons";

interface LoginFormProps {
	onSwitch: () => void;
	onForgot: () => void;
}

export function LoginForm({ onSwitch, onForgot }: LoginFormProps) {
	const [email, setEmail] = useState("seoyeon.writer@naver.com");
	const [pwd, setPwd] = useState("");
	const [show, setShow] = useState(false);
	const [remember, setRemember] = useState(true);
	const [loading, setLoading] = useState(false);

	const emailErr =
		email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
			? "이메일 형식을 확인해 주세요."
			: "";

	const submit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);
		setTimeout(() => setLoading(false), 1400);
	};

	return (
		<form className="tw-auth-form" onSubmit={submit}>
			<header className="tw-auth-head">
				<div className="tw-auth-kicker">작가의 공간으로</div>
				<h2>다시 만나서 반가워요</h2>
				<p>이어 쓰던 이야기가 기다리고 있어요.</p>
			</header>

			<div className="tw-socials">
				<button type="button" className="tw-soc kakao">
					<Icons name="kakao" size={18} /> 카카오로 계속하기
				</button>
				<div className="tw-soc-row">
					<button type="button" className="tw-soc">
						<Icons name="naver" size={18} /> 네이버
					</button>
					<button type="button" className="tw-soc">
						<Icons name="google" size={18} /> Google
					</button>
					<button type="button" className="tw-soc">
						<Icons name="apple" size={18} /> Apple
					</button>
				</div>
			</div>

			<div className="tw-divider">
				<span>또는 이메일로</span>
			</div>

			<div className="tw-fields">
				<div className={`tw-field ${emailErr ? "err" : ""}`}>
					<div className="tw-field-top">
						<span>이메일</span>
					</div>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						autoComplete="email"
						placeholder="name@example.com"
					/>
					{emailErr && (
						<div className="tw-field-msg">
							<Icons name="warn" size={14} /> {emailErr}
						</div>
					)}
				</div>

				<div className={`tw-field ${pwd && !pwd ? "" : ""}`}>
					<div className="tw-field-top">
						<span>비밀번호</span>
						<button
							type="button"
							className="tw-link-mini"
							onClick={onForgot}
						>
							잊으셨나요?
						</button>
					</div>
					<div className="tw-pwd">
						<input
							type={show ? "text" : "password"}
							value={pwd}
							onChange={(e) => setPwd(e.target.value)}
							autoComplete="current-password"
							placeholder="••••••••"
						/>
						<button
							type="button"
							className="tw-pwd-toggle"
							onClick={() => setShow(!show)}
							aria-label="비밀번호 표시"
						>
							<Icons name={show ? "eye-off" : "eye"} size={16} />
						</button>
					</div>
				</div>

				<div className="tw-row-between">
					<label className="tw-check">
						<input
							type="checkbox"
							checked={remember}
							onChange={(e) => setRemember(e.target.checked)}
						/>
						<span className="tw-box">
							<Icons name="check" size={12} />
						</span>
						로그인 유지
					</label>
					<span className="tw-mini-hint">공용 기기에서는 꺼 주세요</span>
				</div>
			</div>

			<button
				type="submit"
				className={`tw-submit ${loading ? "loading" : ""}`}
				disabled={loading}
			>
				{loading ? (
					<span className="tw-spin" />
				) : (
					<>
						로그인 <Icons name="arrow" size={16} />
					</>
				)}
			</button>

			<p className="tw-switch">
				아직 계정이 없으신가요?{" "}
				<button type="button" onClick={onSwitch}>
					회원가입
				</button>
			</p>
		</form>
	);
}
