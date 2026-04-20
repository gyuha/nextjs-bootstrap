"use client";

import { useState } from "react";
import { Icons } from "@/components/ui/icons";

interface SignupFormProps {
	onSwitch: () => void;
}

const GENRES = [
	{ id: "romfant", label: "로맨스판타지", sub: "회귀·빙의·환생", top: true },
	{ id: "fantasy", label: "판타지", sub: "마법·검·이세계", top: true },
	{ id: "muhyeop", label: "무협", sub: "문파·내공·강호" },
	{ id: "romance", label: "로맨스", sub: "현대·오피스·캠퍼스" },
	{ id: "modern", label: "현대판타지", sub: "헌터·게이트·각성" },
	{ id: "mystery", label: "미스터리", sub: "추리·스릴러" },
	{ id: "sf", label: "SF", sub: "디스토피아·우주" },
	{ id: "bl", label: "BL", sub: "로맨스·드라마" },
];

function pwdScore(p: string) {
	if (!p) return 0;
	let s = 0;
	if (p.length >= 8) s++;
	if (p.length >= 12) s++;
	if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
	if (/\d/.test(p)) s++;
	if (/[^A-Za-z0-9]/.test(p)) s++;
	return Math.min(s, 4);
}

const PWD_LABELS = ["", "약함", "보통", "좋음", "강력함"];

function Stepper({ step }: { step: number }) {
	const steps = ["계정", "프로필", "장르"];
	return (
		<ol className="tw-stepper">
			{steps.map((s, i) => (
				<li
					key={s}
					className={i === step ? "tw-cur" : i < step ? "tw-done" : ""}
				>
					<span className="tw-s-num">
						{i < step ? <Icons name="check" size={12} /> : i + 1}
					</span>
					<span className="tw-s-lbl">{s}</span>
				</li>
			))}
		</ol>
	);
}

function TermRow({
	req,
	label,
	checked,
	onChange,
	view,
}: {
	req?: boolean;
	label: string;
	checked: boolean;
	onChange: (v: boolean) => void;
	view?: boolean;
}) {
	return (
		<label className="tw-term">
			<input
				type="checkbox"
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
			/>
			<span className="tw-box">
				<Icons name="check" size={11} />
			</span>
			<span className="tw-t-lbl">
				<em className={req ? "req" : "opt"}>
					{req ? "필수" : "선택"}
				</em>
				{label}
			</span>
			{view && <span className="tw-t-view">보기</span>}
		</label>
	);
}

export function SignupForm({ onSwitch }: SignupFormProps) {
	const [step, setStep] = useState(0);
	const [email, setEmail] = useState("");
	const [pwd, setPwd] = useState("");
	const [show, setShow] = useState(false);
	const [pen, setPen] = useState("");
	const [picked, setPicked] = useState(new Set(["romfant"]));
	const [terms, setTerms] = useState({
		age: false,
		tos: false,
		privacy: false,
		marketing: false,
	});

	const allRequired = terms.age && terms.tos && terms.privacy;
	const emailErr =
		!email ? "" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
			? "이메일 형식이 올바르지 않아요."
			: "";
	const emailOk = email && !emailErr ? "사용 가능한 이메일이에요." : "";

	const score = pwdScore(pwd);
	const penErr =
		pen && pen.length < 2 ? "2자 이상 입력해 주세요." : "";
	const penOk = pen && !penErr ? "사용 가능한 필명이에요." : "";
	const penMsg = penErr;

	const togglePick = (id: string) => {
		const next = new Set(picked);
		next.has(id) ? next.delete(id) : next.add(id);
		setPicked(next);
	};

	const nextDisabled =
		(step === 0 && (!email || !!emailErr || score < 2 || !allRequired)) ||
		(step === 1 && (!pen || !!penMsg));

	return (
		<form
			className="tw-auth-form"
			onSubmit={(e) => {
				e.preventDefault();
				if (step < 2) setStep(step + 1);
			}}
		>
			<header className="tw-auth-head">
				<div className="tw-auth-kicker">새 이야기를 시작합니다</div>
				<h2>{["계정 만들기", "작가 프로필", "관심 장르"][step]}</h2>
				<p>
					{step === 0 &&
						"이메일과 비밀번호로 Tale Weaver를 시작해요."}
					{step === 1 && "독자와 AI가 당신을 부를 이름이에요."}
					{step === 2 &&
						"AI가 당신의 장르 문법을 더 잘 이해하도록 도와주세요."}
				</p>
			</header>

			<Stepper step={step} />

			{step === 0 && (
				<>
					<div className="tw-fields">
						<div className={`tw-field ${emailErr ? "err" : emailOk ? "ok" : ""}`}>
							<div className="tw-field-top">이메일</div>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="name@example.com"
								autoComplete="email"
							/>
							{emailErr && (
								<div className="tw-field-msg">
									<Icons name="warn" size={14} /> {emailErr}
								</div>
							)}
							{emailOk && !emailErr && (
								<div className="tw-field-msg">
									<Icons name="check" size={14} /> {emailOk}
								</div>
							)}
						</div>

						<div className="tw-field">
							<div className="tw-field-top">
								<span>비밀번호</span>
							</div>
							<div className="tw-pwd">
								<input
									type={show ? "text" : "password"}
									value={pwd}
									onChange={(e) => setPwd(e.target.value)}
									placeholder="8자 이상"
									autoComplete="new-password"
								/>
								<button
									type="button"
									className="tw-pwd-toggle"
									onClick={() => setShow(!show)}
								>
									<Icons name={show ? "eye-off" : "eye"} size={16} />
								</button>
							</div>
							{!pwd && (
								<div className="tw-field-msg" style={{ color: "var(--tw-ink-4)" }}>
									영문·숫자·특수문자 8자 이상
								</div>
							)}
							{pwd && (
								<div className={`tw-strength s-${score}`}>
									<div className="tw-s-bars">
										<i />
										<i />
										<i />
										<i />
									</div>
									<span>{PWD_LABELS[score]}</span>
								</div>
							)}
						</div>
					</div>

					<div className="tw-terms">
						<label className="tw-check agg">
							<input
								type="checkbox"
								checked={allRequired && terms.marketing}
								onChange={(e) =>
									setTerms({
										age: e.target.checked,
										tos: e.target.checked,
										privacy: e.target.checked,
										marketing: e.target.checked,
									})
								}
							/>
							<span className="tw-box">
								<Icons name="check" size={12} />
							</span>
							<b>약관 전체 동의</b>
							<span className="tw-t-sub">필수 및 선택 약관을 모두 포함합니다.</span>
						</label>
						<div className="tw-t-list">
							<TermRow
								req
								label="만 14세 이상입니다"
								checked={terms.age}
								onChange={(v) => setTerms({ ...terms, age: v })}
							/>
							<TermRow
								req
								label="이용약관 동의"
								checked={terms.tos}
								onChange={(v) => setTerms({ ...terms, tos: v })}
								view
							/>
							<TermRow
								req
								label="개인정보 수집·이용 동의"
								checked={terms.privacy}
								onChange={(v) => setTerms({ ...terms, privacy: v })}
								view
							/>
							<TermRow
								label="마케팅 정보 수신 동의"
								checked={terms.marketing}
								onChange={(v) => setTerms({ ...terms, marketing: v })}
								view
							/>
						</div>
					</div>
				</>
			)}

			{step === 1 && (
				<>
					<div className="tw-fields">
						<div className={`tw-field ${penMsg ? "err" : penOk ? "ok" : ""}`}>
							<div className="tw-field-top">
								<span>필명</span>
							</div>
							<div className="tw-pwd">
								<input
									value={pen}
									onChange={(e) => setPen(e.target.value)}
									placeholder="예: 달빛연주"
									maxLength={20}
								/>
								<span className="tw-count">{pen.length}/20</span>
							</div>
							{penMsg && (
								<div className="tw-field-msg">
									<Icons name="warn" size={14} /> {penMsg}
								</div>
							)}
							{penOk && !penMsg && (
								<div className="tw-field-msg">
									<Icons name="check" size={14} /> {penOk}
								</div>
							)}
							{!pen && (
								<div className="tw-field-msg" style={{ color: "var(--tw-ink-4)" }}>
									한글/영문 2–20자 · 나중에 변경할 수 있어요
								</div>
							)}
						</div>

						<div className="tw-field">
							<div className="tw-field-top">
								<span>작가 소개</span>
								<span className="tw-field-opt">선택</span>
							</div>
							<textarea
								placeholder="로맨스판타지로 이야기를 짓습니다."
								rows={2}
							/>
							<div className="tw-field-msg" style={{ color: "var(--tw-ink-4)" }}>
								독자에게 보여질 짧은 한 줄 · 나중에 채워도 괜찮아요
							</div>
						</div>

						<div className="tw-field">
							<div className="tw-field-top">
								<span>기본 집필 장르</span>
								<span className="tw-field-opt">선택</span>
							</div>
							<div className="tw-chips-mini">
								<button type="button" className="tw-chip-m on">
									로맨스판타지
								</button>
								<button type="button" className="tw-chip-m">
									판타지
								</button>
								<button type="button" className="tw-chip-m">
									무협
								</button>
								<button type="button" className="tw-chip-m">
									현대판타지
								</button>
								<button type="button" className="tw-chip-m">
									로맨스
								</button>
							</div>
						</div>
					</div>

					<div className="tw-privacy-note">
						<Icons name="lock" size={16} />
						<div>
							<b>집필 내용은 공개되지 않아요.</b>
							작성하신 원고는 기본적으로 비공개이며, 발행 전까지 AI 학습에도
							사용되지 않습니다.
						</div>
					</div>
				</>
			)}

			{step === 2 && (
				<>
					<div className="tw-genres">
						{GENRES.map((g) => (
							<button
								type="button"
								key={g.id}
								className={`tw-genre ${picked.has(g.id) ? "on" : ""}`}
								onClick={() => togglePick(g.id)}
							>
								{g.top && <span className="tw-g-top">인기</span>}
								<div className="tw-g-label">{g.label}</div>
								<div className="tw-g-sub">{g.sub}</div>
								<span className="tw-g-dot">
									<Icons name="check" size={10} />
								</span>
							</button>
						))}
					</div>
					<div className="tw-picked-row">
						<span>
							선택됨 <b>{picked.size}</b>개
						</span>
						<span className="tw-mini-hint">최소 1개 · 언제든지 변경할 수 있어요</span>
					</div>

					<div className="tw-ai-teaser">
						<div className="tw-ai-ic">
							<Icons name="spark" size={18} />
						</div>
						<div>
							<b>AI가 당신의 장르를 학습했어요</b>
							<p>
								선택하신 <em>로맨스판타지</em>의 회귀·빙의 서사 패턴{" "}
								<b>1,248</b>개를 분석 중. 첫 집필을 시작하면 즉시 이어쓰기가
								가능해요.
							</p>
						</div>
					</div>
				</>
			)}

			<div className="tw-step-nav">
				{step > 0 ? (
					<button
						type="button"
						className="tw-ghost-btn"
						onClick={() => setStep(step - 1)}
					>
						<Icons name="back" size={14} /> 이전
					</button>
				) : (
					<span />
				)}
				<button className="tw-submit" disabled={nextDisabled}>
					{step < 2 ? (
						<>
							다음 <Icons name="arrow" size={16} />
						</>
					) : (
						<>
							시작하기 <Icons name="arrow" size={16} />
						</>
					)}
				</button>
			</div>

			<p className="tw-switch">
				이미 계정이 있으신가요?{" "}
				<button type="button" onClick={onSwitch}>
					로그인
				</button>
			</p>
		</form>
	);
}
