"use client";

import { useEffect, useState } from "react";

const GHOST_FULL =
	"기억이 번진다. 단두대, 흰 천, 그리고 이 같은 손이 그녀를 떠밀던 그 차가운 새벽.";

export function ShowcasePane() {
	const [typed, setTyped] = useState(0);

	useEffect(() => {
		const id = setInterval(() => {
			setTyped((t) => (t >= GHOST_FULL.length ? 0 : t + 1));
		}, 55);
		return () => clearInterval(id);
	}, []);

	const ghost = GHOST_FULL.slice(0, typed);

	return (
		<aside className="tw-showcase">
			<div className="tw-sc-top">
				<div className="tw-wordmark">
					<svg
						width="28"
						height="28"
						viewBox="0 0 32 32"
						fill="none"
						aria-hidden
					>
						<path
							d="M6 6c8 0 14 4 14 12s6 8 6 8"
							stroke="currentColor"
							strokeWidth="2.4"
							strokeLinecap="round"
						/>
						<circle cx="6" cy="6" r="2.4" fill="currentColor" />
						<circle cx="26" cy="26" r="2.4" fill="currentColor" />
					</svg>
					<span>Tale Weaver</span>
				</div>
				<span className="tw-sc-badge">Beta · 2026</span>
			</div>

			<div className="tw-sc-body">
				<div className="tw-sc-kicker">AI 웹소설 공동 집필</div>
				<h1 className="tw-sc-title">
					당신의 다음 문장을,
					<br />
					<em>AI가 먼저 상상합니다.</em>
				</h1>
				<p className="tw-sc-lede">
					캐릭터 시트·세계관을 학습한 AI가 작가의 문체로 이어 씁니다.
					월 평균 집필 시간을 <b>37%</b> 단축시킵니다.
				</p>

				<div className="tw-sc-manuscript">
					<div className="tw-sc-mhead">
						<span className="dot" /> Chapter 09 · 폐제의 손길
					</div>
					<p>
						차가운 감옥 바닥에서 세이렌은 눈을 떴다. 회귀 전, 마지막으로
						본 것은 단두대 위의 새벽이었다.
					</p>
					<p>
						그녀의 손목에 닿은 체온은 낯설지 않았다.{" "}
						<span className="tw-ghost-text">{ghost}</span>
						<span className="tw-caret" />
					</p>
					<div className="tw-sc-hint">
						AI · <kbd>Tab</kbd> 수락 · <kbd>Esc</kbd> 거절
					</div>
				</div>

				<div className="tw-sc-quote">
					<div className="tw-q-avatar">최</div>
					<div>
						<div className="tw-q-text">
							&quot;캐릭터가 내 머릿속에서 튀어나온 것처럼 말해요. 10챕터를 3일 만에
							썼습니다.&quot;
						</div>
						<div className="tw-q-meta">
							최서연 · 로맨스판타지 작가 · 누적 조회 2.4M
						</div>
					</div>
				</div>
			</div>

			<div className="tw-sc-foot">
				<span>© 2026 Tale Weaver</span>
				<span>이용약관</span>
				<span>개인정보처리방침</span>
			</div>
		</aside>
	);
}
