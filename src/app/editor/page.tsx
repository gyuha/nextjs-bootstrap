"use client";

import { useState, useEffect, useRef } from "react";

// ---------- DATA ----------
const TW_PROJECT = {
	title: "폐제의 손길",
	genre: "로맨스판타지",
	chapterCount: 23,
	totalChars: 142580,
	deadline: "D-2",
};

const TW_CHAPTERS = [
	{ n: 1, title: "폐허의 정원", chars: 6240, status: "done" },
	{ n: 2, title: "붉은 편지", chars: 5890, status: "done" },
	{ n: 3, title: "황제의 초대", chars: 7120, status: "done" },
	{ n: 4, title: "대리석 복도", chars: 6455, status: "done" },
	{ n: 5, title: "첫 알현", chars: 6980, status: "done" },
	{ n: 6, title: "침묵의 만찬", chars: 5760, status: "done" },
	{ n: 7, title: "비밀의 서고", chars: 6340, status: "done" },
	{ n: 8, title: "그날 밤의 약속", chars: 7020, status: "done" },
	{ n: 9, title: "폐제의 손길", chars: 3820, status: "wip", active: true },
	{ n: 10, title: "(제목 미정)", chars: 0, status: "draft" },
];

const TW_CHARACTERS = [
	{
		name: "리젤 카이엔",
		role: "주인공",
		avatarColor: "linear-gradient(135deg, oklch(0.62 0.14 330), oklch(0.50 0.18 300))",
		initial: "리",
		attrs: [
			{ k: "나이", v: "19세" },
			{ k: "눈", v: "은청색", warn: true },
			{ k: "머리", v: "플래티넘 금발" },
			{ k: "성격", v: "냉정하지만 속은 여린" },
			{ k: "능력", v: "마나 친화력 S급" },
		],
		note: "회귀 전 생에서는 황후였으나 폐위.",
	},
	{
		name: "카이든 아르테온",
		role: "황제",
		avatarColor: "linear-gradient(135deg, oklch(0.35 0.08 260), oklch(0.20 0.04 285))",
		initial: "카",
		attrs: [
			{ k: "나이", v: "27세" },
			{ k: "눈", v: "잿빛 금안" },
			{ k: "머리", v: "흑발" },
			{ k: "성격", v: "오만, 독점적" },
			{ k: "말투", v: "존댓말 + 명령조" },
		],
		note: "리젤을 회귀 전 생에서 폐위시킨 장본인. 기억 없음.",
	},
	{
		name: "세라핀 공작",
		role: "조연",
		avatarColor: "linear-gradient(135deg, oklch(0.55 0.14 35), oklch(0.40 0.16 20))",
		initial: "세",
		attrs: [
			{ k: "나이", v: "32세" },
			{ k: "관계", v: "리젤의 약혼자(파혼)" },
			{ k: "성격", v: "온화, 계산적" },
		],
		note: "",
	},
];

const TW_DIRECTIONS = [
	{
		label: "A 방향 · 감정 고조",
		title: "손끝에서 기억이 번지다",
		summary:
			"황제가 리젤의 손을 잡는 순간, 회귀 전의 단두대 광경이 플래시백처럼 스친다. 리젤은 무의식적으로 손을 빼고, 황제는 그 미세한 떨림을 놓치지 않는다.",
		impact: 82,
		plot: 45,
		reader: "독자 반응 ★★★★☆",
	},
	{
		label: "B 방향 · 대화 밀당",
		title: "폐제라고 부르시오",
		summary:
			"황제가 조용히 자신을 '폐제'라 호칭하라 명한다. 리젤은 그 단어가 회귀 전 자신이 그에게 붙인 멸칭이었음을 깨닫는다.",
		impact: 68,
		plot: 72,
		reader: "독자 반응 ★★★★★",
	},
	{
		label: "C 방향 · 복선 투하",
		title: "같은 향기의 편지",
		summary:
			"시녀가 편지를 가져온다. 세라핀 공작의 것. 리젤은 회귀 전에도 이 순간 같은 편지를 받았음을 기억해낸다.",
		impact: 45,
		plot: 88,
		reader: "독자 반응 ★★★☆☆",
	},
];

const TW_CHAT_SEED = [
	{
		role: "user" as const,
		text: "9화 중반, 황제가 리젤의 손을 처음 잡는 장면을 써줘. 오만한 황제가 한눈에 반하는 로판 클리셰로, 약 200자.",
		draft: undefined as string | undefined,
		quick: undefined as string[] | undefined,
	},
	{
		role: "ai" as const,
		text: "아래 초안을 만들어봤어요. 캐릭터 설정(카이든의 잿빛 금안, 존댓말+명령조)과 세계관(황궁 대리석 복도)을 반영했습니다.",
		draft: "「손.」\n한 단어였다. 명령인지 청원인지 모를 음성이 대리석 복도를 낮게 울렸다. 리젤은 망설였고, 그 망설임을 황제는 기다려주지 않았다. 그의 손가락이 그녀의 손목을 천천히 감아쥐었다. 차갑지 않았다. 오히려 이 폐허 같은 황궁에서 유일하게 온기를 가진 것처럼, 그 손은 뜨거웠다. 잿빛 금안이 내려다본다. ―너는 내 것이다, 아직 모르는 모양이지만.",
		quick: ["더 긴장감 있게", "500자로 줄여", "황제 시점으로"],
	},
];

const TW_REVIEW = {
	scoreBefore: 72,
	scoreAfter: 87,
	engagement: [62, 75, 81, 78, 55, 48, 62, 80, 88, 92],
	engagementLabels: ["도입", "리젤 독백", "복도 묘사", "시녀 등장", "긴 설명", "과거 설명", "침묵", "대화", "손길", "결말"],
	cliff: 91,
	items: [
		{
			tag: "맞춤법",
			tagType: "sp",
			before: "그의 눈빛은 차겁게 식었다.",
			after: "그의 눈빛은 차갑게 식었다.",
			why: "'차겁게'는 '차갑게'의 잘못된 표기입니다.",
		},
		{
			tag: "감정 흐름",
			tagType: "emo",
			before: "리젤은 놀랐다. 그리고 그를 바라보았다. 그는 말이 없었다.",
			after: "리젤의 숨이 멎었다. 시선이 얽힌 순간, 황제는 아무 말도 하지 않았다 ― 그 침묵이 더 무거웠다.",
			why: "감정 서술이 평면적이어서 긴장감이 약합니다. 감각 묘사와 대비로 밀도를 높였어요.",
		},
		{
			tag: "중복 표현",
			tagType: "style",
			before: "천천히, 천천히 그녀의 손을 잡았다.",
			after: "그녀의 손을 잡았다, 아주 느리게.",
			why: "부사 반복이 문체 리듬을 깨뜨립니다.",
		},
		{
			tag: "설명문 과다",
			tagType: "emo",
			before: "대리석 복도는 수백 년 된 황궁의 역사를 담고 있었고, 리젤은 그 역사를 생각하며 걸었다.",
			after: "리젤의 구두 소리가 대리석에 길게 울렸다. 오래된 복도였다.",
			why: "'말하기' 대신 '보여주기'로 다듬었습니다.",
		},
	],
};

const TW_CONSISTENCY = {
	title: "리젤의 눈동자 색 불일치",
	summary: "3화에서 리젤의 눈은 '은청색'으로 묘사되었으나, 현재 9화 본문에서 '옅은 푸른색'으로 표현되었습니다.",
	refs: [
		{ chap: "3화", quote: "은청색 눈동자가 샹들리에 빛을 흡수했다." },
		{ chap: "9화", quote: "옅은 푸른색 눈동자가 황제를 향했다." },
	],
};

const MANUSCRIPT_ORIG = [
	{
		html: `대리석 복도가 끝없이 이어졌다. 리젤은 구두 소리가 자신의 심장보다 큰 소리로 울린다고 생각했다. 회귀한 지 두 달, 그녀는 여전히 이 황궁의 공기가 무거웠다.`,
	},
	{ html: `「폐하께서 기다리십니다.」` },
	{
		html: `시녀의 목소리는 얇았다. 리젤은 고개를 끄덕였다. 대답은 필요하지 않았다. 이 길의 끝에 무엇이 있는지, 그녀는 이미 한 번 알았다. 한 번 걸었고, 한 번 부서졌다.`,
	},
	{
		html: `황제는 창가에 서 있었다. 역광이라 얼굴은 보이지 않았고, 다만 그 실루엣만이 거대한 새처럼 검었다. 그가 천천히 돌아섰을 때, 리젤은 자신의 <span class="warn-mark" data-warn="eye">옅은 푸른색</span> 눈이 흔들리는 것을 느꼈다.`,
	},
	{ html: `「가까이.」` },
	{
		html: `한 단어였다. 명령인지 청원인지 모를 음성이 낮게 울렸다. 리젤은 한 발을 내디뎠다. 그리고 또 한 발.`,
	},
	{ html: `「손.」` },
	{
		html: `또 한 단어였다. 그녀는 망설였고, 황제는 기다려주지 않았다. 그의 손가락이 그녀의 손목을 감아쥐었을 때, 리젤은 깨달았다 ― 회귀 전 마지막 생에서도, 그는 같은 방식으로 그녀의 손을 잡았다는 것을.`,
	},
];

const MANUSCRIPT_REVIEW = [
	{
		html: `대리석 복도가 끝없이 이어졌다. 리젤은 구두 소리가 자신의 심장보다 큰 소리로 울린다고 생각했다. 회귀한 지 두 달, <span class="tc emo" data-rev="3">대리석 복도는 수백 년 된 황궁의 역사를 담고 있었고, 리젤은 그 역사를 생각하며 걸었다.</span>`,
	},
	{ html: `「폐하께서 기다리십니다.」` },
	{
		html: `시녀의 목소리는 얇았다. 리젤은 고개를 끄덕였다. 대답은 필요하지 않았다.`,
	},
	{
		html: `황제는 창가에 서 있었다. 그가 천천히 돌아섰을 때, 그의 눈빛은 <span class="tc sp" data-rev="0">차겁게</span> 식었다. <span class="tc emo" data-rev="1">리젤은 놀랐다. 그리고 그를 바라보았다. 그는 말이 없었다.</span>`,
	},
	{ html: `「가까이.」` },
	{ html: `「손.」` },
	{
		html: `<span class="tc style" data-rev="2">천천히, 천천히 그녀의 손을 잡았다.</span> 리젤은 깨달았다 ― 회귀 전 마지막 생에서도, 그는 같은 방식이었다는 것을.`,
	},
];

// ---------- ICONS ----------
const FocusIcon = () => (
	<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
		<path d="M3 7V3H7M13 3H17V7M17 13V17H13M7 17H3V13" />
	</svg>
);
const GearIcon = () => (
	<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5">
		<circle cx="10" cy="10" r="2.5" />
		<path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M4.3 15.7l1.4-1.4M14.3 5.7l1.4-1.4" />
	</svg>
);
const SparkleIcon = () => (
	<svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor">
		<path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" />
	</svg>
);
const SendIcon = () => (
	<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
		<path d="M2 8L14 2L10 14L8 9L2 8Z" strokeLinejoin="round" />
	</svg>
);
const PlusIcon = () => (
	<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5">
		<path d="M8 3V13M3 8H13" strokeLinecap="round" />
	</svg>
);
const AlertIcon = () => (
	<svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.8">
		<path d="M7 1L13 12H1Z" />
		<path d="M7 5v3M7 10v.5" strokeLinecap="round" />
	</svg>
);
const TabIcon = () => (
	<svg viewBox="0 0 16 12" width="14" height="10" fill="none" stroke="currentColor" strokeWidth="1.5">
		<path d="M2 6H12M12 6L9 3M12 6L9 9" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M14 2V10" strokeLinecap="round" />
	</svg>
);
const ClockIcon = () => (
	<svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5">
		<circle cx="7" cy="7" r="5.5" />
		<path d="M7 4V7L9 8.5" strokeLinecap="round" />
	</svg>
);

// ---------- SUB-COMPONENTS ----------

function Topbar({
	focus,
	setFocus,
	saving,
	tweaksOpen,
	setTweaksOpen,
}: {
	focus: boolean;
	setFocus: (v: boolean) => void;
	saving: boolean;
	tweaksOpen: boolean;
	setTweaksOpen: (v: boolean) => void;
}) {
	return (
		<header className="topbar">
			<div className="brand">
				<div className="brand-mark">T</div>
				Tale Weaver
			</div>
			<div className="project-title">
				<span>{TW_PROJECT.title}</span>
			</div>
			<div className="spacer" />
			<div className={"status" + (saving ? " saving" : "")}>
				<span className="dot" />
				{saving ? "저장 중…" : "자동 저장됨 · 방금 전"}
			</div>
			<div className="deadline">
				<ClockIcon /> 9화 마감 {TW_PROJECT.deadline}
			</div>
			<button className={"iconbtn" + (focus ? " on" : "")} onClick={() => setFocus(!focus)} title="포커스 모드">
				<FocusIcon />
			</button>
			<button
				className={"iconbtn" + (tweaksOpen ? " on" : "")}
				onClick={() => setTweaksOpen(!tweaksOpen)}
				title="Tweaks"
			>
				<GearIcon />
			</button>
		</header>
	);
}

function Sidebar({ activeChap, setActiveChap }: { activeChap: number; setActiveChap: (n: number) => void }) {
	const progress = 76;
	const ring = 44;
	const circ = 2 * Math.PI * 16;
	return (
		<aside className="sidebar">
			<div className="meta">
				{TW_PROJECT.title}
				<small>{TW_PROJECT.genre} · 장편 · 23화 연재 중</small>
			</div>
			<div className="progress-ring">
				<svg width={ring} height={ring} viewBox="0 0 44 44">
					<circle cx="22" cy="22" r="16" stroke="var(--divider)" strokeWidth="4" fill="none" />
					<circle
						cx="22"
						cy="22"
						r="16"
						stroke="var(--accent)"
						strokeWidth="4"
						fill="none"
						strokeDasharray={circ}
						strokeDashoffset={circ * (1 - progress / 100)}
						transform="rotate(-90 22 22)"
						strokeLinecap="round"
					/>
					<text
						x="22"
						y="25"
						textAnchor="middle"
						fontSize="10"
						fontWeight="600"
						fill="var(--ink)"
						fontFamily="var(--font-mono)"
					>
						{progress}%
					</text>
				</svg>
				<div>
					<div className="pr-num">142,580자</div>
					<div className="pr-sub">목표 180,000자 · 23/30화</div>
				</div>
			</div>

			<h3>챕터 {TW_CHAPTERS.length}</h3>
			<div>
				{TW_CHAPTERS.map((c) => (
					<div
						key={c.n}
						className={"chap" + (c.n === activeChap ? " active" : "")}
						onClick={() => setActiveChap(c.n)}
					>
						<span className="num">{String(c.n).padStart(2, "0")}</span>
						<span className="title">{c.title}</span>
						<span className={"stat " + c.status} />
						<span className="count">{c.chars > 0 ? (c.chars / 1000).toFixed(1) + "k" : "—"}</span>
					</div>
				))}
			</div>
			<button className="add-chap">
				<PlusIcon /> 챕터 추가
			</button>
		</aside>
	);
}

function EditorPane({
	reviewMode,
	onClickTC,
	ghostVisible,
	warnBadge,
	onWarnClick,
	alertOpen,
	onAlertAction,
}: {
	reviewMode: boolean;
	onClickTC: (i: number) => void;
	ghostVisible: boolean;
	warnBadge: boolean;
	onWarnClick: () => void;
	alertOpen: boolean;
	onAlertAction: (act: "fix" | "intent" | "dismiss") => void;
}) {
	const blocks = reviewMode ? MANUSCRIPT_REVIEW : MANUSCRIPT_ORIG;


	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		const tc = (e.target as HTMLElement).closest("[data-rev]") as HTMLElement | null;
		if (tc && tc.dataset.rev !== undefined) onClickTC(parseInt(tc.dataset.rev, 10));
	};

	return (
		<main className="editor">
			{warnBadge && (
				<button className="warn-badge" onClick={onWarnClick}>
					<AlertIcon /> 설정 일관성 경고 <span className="n">1</span>
				</button>
			)}
			{alertOpen && (
				<div className="alert on-editor">
					<div className="a-tag">CONSISTENCY</div>
					<h5>{TW_CONSISTENCY.title}</h5>
					<p>{TW_CONSISTENCY.summary}</p>
					<div className="refs">
						{TW_CONSISTENCY.refs.map((r, i) => (
							<div key={i}>
								<strong>{r.chap}</strong> ·{" "}
								<span className={i === 0 ? "diff-old" : "diff-new"}>"{r.quote}"</span>
							</div>
						))}
					</div>
					<div className="actions">
						<button className="primary" onClick={() => onAlertAction("fix")}>
							수정하기
						</button>
						<button onClick={() => onAlertAction("intent")}>의도적 변경</button>
						<button onClick={() => onAlertAction("dismiss")}>닫기</button>
					</div>
				</div>
			)}

			<div className="editor-inner">
				<div className="chap-head">
					<div className="label">Chapter 09 · 작업 중</div>
					<h1>폐제의 손길</h1>
					<div className="meta-row">
						<span>3,820자 / 목표 5,500자</span>
						<span>·</span>
						<span>예상 독자 소요 12분</span>
						<span>·</span>
						<span>최근 저장 14:32</span>
					</div>
				</div>

				<div className="manuscript" onClick={handleClick}>
					{blocks.map((b, i) => (
						<p key={i} dangerouslySetInnerHTML={{ __html: b.html }} />
					))}
					{!reviewMode && (
						<p>
							그녀의 손목에 닿은 체온은 낯설지 않았다.{" "}
							{ghostVisible && (
								<>
									<span className="ghost">
										기억이 번진다. 단두대, 흰 천, 그리고 이 같은 손이 그녀를 떠밀던 그 차가운 새벽.
									</span>
									<span className="ghost-hint">
										AI · <kbd>Tab</kbd> 수락 <kbd>Esc</kbd> 거절 <kbd>⌃R</kbd> 다시
									</span>
								</>
							)}
							{!ghostVisible && <span style={{ color: "var(--ink-4)" }}>│</span>}
						</p>
					)}
					{reviewMode && (
						<div
							className="alert"
							style={{ background: "var(--accent-soft)", borderColor: "var(--accent-border)" }}
						>
							<div className="a-tag" style={{ color: "var(--accent-ink)" }}>
								AI 편집자 모드
							</div>
							<p style={{ color: "var(--ink-2)" }}>
								하이라이트된 구간을 클릭하면 우측 패널에서 제안과 근거를 확인할 수 있어요. 맞춤법{" "}
								<strong style={{ color: "var(--danger)" }}>빨강</strong>, 감정 흐름{" "}
								<strong style={{ color: "var(--warn-ink)" }}>노랑</strong>, 문체{" "}
								<strong style={{ color: "var(--accent-ink)" }}>보라</strong>.
							</p>
						</div>
					)}
				</div>
			</div>

			<div className="botbar">
				<span>단어 {reviewMode ? 1260 : 1140} · 문단 {reviewMode ? 9 : 8}</span>
				<span>자동 저장 · 30초마다</span>
				<div className="goal" style={{ marginLeft: "auto" }}>
					<div className="goalbar">
						<div style={{ width: `${(3820 / 5500) * 100}%` }} />
					</div>
					<span>
						<strong>3,820</strong> / 5,500자
					</span>
				</div>
			</div>
		</main>
	);
}

function PanelSuggestions({ onGhost, onInsert }: { onGhost: () => void; onInsert: (d: (typeof TW_DIRECTIONS)[0]) => void }) {
	const [selected, setSelected] = useState<number | null>(null);
	const [regenKey, setRegenKey] = useState(0);

	return (
		<>
			<div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
				<div
					style={{
						width: 28,
						height: 28,
						borderRadius: "50%",
						background: "var(--accent-soft)",
						color: "var(--accent)",
						display: "grid",
						placeItems: "center",
						flexShrink: 0,
					}}
				>
					<SparkleIcon />
				</div>
				<div>
					<div style={{ fontWeight: 600, fontSize: 13 }}>AI 이어쓰기 · 방향 제안</div>
					<div style={{ fontSize: 11, color: "var(--ink-3)" }}>현재 커서 위치 · 3,820자 지점</div>
				</div>
			</div>

			<button
				className="btn"
				style={{
					width: "100%",
					justifyContent: "center",
					marginBottom: 16,
					background: "var(--accent)",
					color: "#fff",
					borderColor: "var(--accent)",
				}}
				onClick={onGhost}
			>
				<TabIcon /> 다음 문장 이어쓰기{" "}
				<kbd style={{ background: "rgba(255,255,255,0.2)", borderColor: "transparent", color: "rgba(255,255,255,0.9)" }}>
					Tab
				</kbd>
			</button>

			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
				<div className="rp-section-title" style={{ margin: 0 }}>
					다음 장면 방향 · 3가지
				</div>
				<button
					className="btn ghost sm"
					onClick={() => {
						setSelected(null);
						setRegenKey((k) => k + 1);
					}}
					style={{ fontSize: 11, padding: "4px 10px" }}
				>
					↻ 재생성
				</button>
			</div>

			<div key={regenKey}>
				{TW_DIRECTIONS.map((d, i) => (
					<div
						key={i}
						className={"dircard" + (selected === i ? " selected" : "")}
						onClick={() => setSelected(i)}
					>
						<div className="dir-label">{d.label}</div>
						<h4>{d.title}</h4>
						<p>{d.summary}</p>
						<div className="meters">
							<div className="meter">
								<div className="meter-lbl">감정 충격</div>
								<div className="meter-bar warm">
									<div style={{ width: d.impact + "%" }} />
								</div>
							</div>
							<div className="meter">
								<div className="meter-lbl">플롯 진행</div>
								<div className="meter-bar">
									<div style={{ width: d.plot + "%" }} />
								</div>
							</div>
						</div>
						<div style={{ marginTop: 10, fontSize: 11, color: "var(--ink-3)", display: "flex", justifyContent: "space-between" }}>
							<span>{d.reader}</span>
							{selected === i && (
								<button
									onClick={(e) => {
										e.stopPropagation();
										onInsert(d);
									}}
									style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600 }}
								>
									에디터에 삽입 →
								</button>
							)}
						</div>
					</div>
				))}
			</div>

			<div style={{ fontSize: 11, color: "var(--ink-4)", textAlign: "center", marginTop: 10 }}>
				오늘 사용 · 방향 제안 2/5회 · 이어쓰기 14/20회
			</div>
		</>
	);
}

type ChatMessage = {
	role: "user" | "ai";
	text: string;
	draft?: string;
	quick?: string[];
};

function PanelChat({ onInsertChat }: { onInsertChat: (draft: string) => void }) {
	const [thread, setThread] = useState<ChatMessage[]>(TW_CHAT_SEED);
	const [input, setInput] = useState("");
	const [pending, setPending] = useState(false);
	const bodyRef = useRef<HTMLDivElement>(null);

	const send = () => {
		if (!input.trim()) return;
		const next: ChatMessage[] = [...thread, { role: "user", text: input.trim() }];
		setThread(next);
		setInput("");
		setPending(true);
		setTimeout(() => {
			setThread([
				...next,
				{
					role: "ai",
					text: "요청 반영했어요. 아래 초안을 확인해보세요.",
					draft: "차가운 밤공기가 대리석을 핥고 지나갔다. 리젤의 손끝이 떨렸고, 황제는 그 떨림을 오래 바라보았다. ―두려운가. 그가 물었다. 리젤은 답하지 않았다. 다만, 자신의 맥박 소리가 황궁 전체를 흔드는 것만 같았다.",
					quick: ["더 짧게", "황제의 시점으로", "대사 늘리기"],
				},
			]);
			setPending(false);
		}, 900);
	};

	useEffect(() => {
		if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
	}, [thread]);

	return (
		<div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
			<div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 10 }}>
				<div
					style={{
						width: 28,
						height: 28,
						borderRadius: "50%",
						background: "var(--accent-soft)",
						color: "var(--accent)",
						display: "grid",
						placeItems: "center",
					}}
				>
					<SparkleIcon />
				</div>
				<div>
					<div style={{ fontWeight: 600, fontSize: 13 }}>AI 장면 요청 · 채팅</div>
					<div style={{ fontSize: 11, color: "var(--ink-3)" }}>캐릭터 3명 · 세계관 참조 중</div>
				</div>
			</div>

			<div ref={bodyRef} className="chat-thread" style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
				{thread.map((m, i) => (
					<div key={i} className={"msg " + m.role}>
						<div>{m.text}</div>
						{m.draft && (
							<>
								<div className="msg-draft" style={{ whiteSpace: "pre-wrap" }}>
									{m.draft}
								</div>
								<button className="insert-btn" onClick={() => onInsertChat(m.draft!)}>
									에디터에 삽입 →
								</button>
								{m.quick && (
									<div className="quick">
										{m.quick.map((q, j) => (
											<button key={j} onClick={() => setInput(q)}>
												{q}
											</button>
										))}
									</div>
								)}
							</>
						)}
					</div>
				))}
				{pending && (
					<div className="msg ai" style={{ opacity: 0.7, fontStyle: "italic", fontSize: 12 }}>
						AI가 생성 중… · 약 2초
					</div>
				)}
			</div>

			<div className="composer" style={{ marginTop: 10 }}>
				<textarea
					placeholder="예: 황제가 리젤에게 첫 키스를 시도하는 장면을 써줘…"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							send();
						}
					}}
				/>
				<button className="send" onClick={send} disabled={!input.trim() || pending}>
					<SendIcon />
				</button>
			</div>
		</div>
	);
}

function PanelReview({
	resolved,
	onResolve,
	activeRev,
	scrollToRev,
}: {
	resolved: boolean[];
	onResolve: (i: number, kind: string) => void;
	activeRev: number | null;
	scrollToRev: (i: number) => void;
}) {
	const r = TW_REVIEW;
	const resolvedCount = resolved.filter(Boolean).length;
	const dynScore = r.scoreBefore + Math.round((r.scoreAfter - r.scoreBefore) * (resolvedCount / r.items.length));

	const W = 320,
		H = 88,
		P = 8;
	const pts = r.engagement.map((v, i) => [
		P + (i * (W - P * 2)) / (r.engagement.length - 1),
		H - P - ((v - 40) / 60) * (H - P * 2),
	]);
	const pathD = pts.map(([x, y], i) => (i === 0 ? "M" : "L") + x + "," + y).join(" ");
	const areaD = pathD + ` L ${W - P},${H - P} L ${P},${H - P} Z`;
	const minIdx = r.engagement.indexOf(Math.min(...r.engagement));

	return (
		<>
			<div style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
				<div
					style={{
						width: 28,
						height: 28,
						borderRadius: "50%",
						background: "var(--accent-soft)",
						color: "var(--accent)",
						display: "grid",
						placeItems: "center",
					}}
				>
					<SparkleIcon />
				</div>
				<div>
					<div style={{ fontWeight: 600, fontSize: 13 }}>AI 편집자 검토</div>
					<div style={{ fontSize: 11, color: "var(--ink-3)" }}>
						9화 · 지적사항 {r.items.length}건 · 처리 {resolvedCount}건
					</div>
				</div>
			</div>

			<div className="score-box">
				<div className="score-label">챕터 품질 점수</div>
				<div className="score-row">
					<div className="score-now">{dynScore}</div>
					<div style={{ color: "var(--ink-3)", fontSize: 12 }}>/ 100</div>
					<div className="score-delta" style={{ marginLeft: "auto" }}>
						{resolvedCount > 0 ? `+${dynScore - r.scoreBefore} 개선됨` : "검토 전"}
					</div>
				</div>
				<div style={{ fontSize: 11, color: "var(--ink-3)" }}>
					처리 전 <strong style={{ color: "var(--ink-2)" }}>{r.scoreBefore}</strong>
					{"  →  "}
					처리 후 예상 <strong style={{ color: "var(--accent-ink)" }}>{r.scoreAfter}</strong>
				</div>
			</div>

			<div className="rp-section-title">독자 몰입도 곡선</div>
			<div className="curve">
				<svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
					<defs>
						<linearGradient id="engFill" x1="0" x2="0" y1="0" y2="1">
							<stop offset="0%" stopColor="var(--accent)" stopOpacity="0.25" />
							<stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
						</linearGradient>
					</defs>
					<line
						x1={P}
						y1={H - P - ((60 - 40) / 60) * (H - P * 2)}
						x2={W - P}
						y2={H - P - ((60 - 40) / 60) * (H - P * 2)}
						stroke="var(--danger)"
						strokeDasharray="2 3"
						strokeWidth="1"
						opacity="0.5"
					/>
					<path d={areaD} fill="url(#engFill)" />
					<path d={pathD} stroke="var(--accent)" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
					{pts.map(([x, y], i) => (
						<circle
							key={i}
							cx={x}
							cy={y}
							r={i === minIdx ? 4 : 2.5}
							fill={r.engagement[i] < 60 ? "var(--danger)" : "var(--accent)"}
						/>
					))}
					<text
						x={pts[minIdx][0]}
						y={pts[minIdx][1] + 16}
						fontSize="9"
						textAnchor="middle"
						fill="var(--danger)"
						fontFamily="var(--font-mono)"
					>
						이탈 위험
					</text>
				</svg>
			</div>
			<div style={{ fontSize: 11, color: "var(--ink-3)", marginBottom: 14, padding: "0 2px" }}>
				<strong style={{ color: "var(--danger)" }}>{r.engagementLabels[minIdx]}</strong> 구간(48점) — 과거 설명이
				길어 몰입이 떨어집니다.
			</div>

			<div
				className="rp-section-title"
				style={{ display: "flex", justifyContent: "space-between" }}
			>
				<span>지적사항 {r.items.length}건</span>
				<button className="btn ghost sm" style={{ fontSize: 10, padding: "2px 8px" }}>
					맞춤법만 일괄 수락
				</button>
			</div>

			{r.items.map((it, i) => (
				<div
					key={i}
					className={"review-item" + (resolved[i] ? " resolved" : "")}
					id={"rev-" + i}
					style={activeRev === i ? { boxShadow: "0 0 0 2px var(--accent)" } : {}}
				>
					<span className={"r-tag " + it.tagType}>{it.tag}</span>
					<div style={{ fontFamily: "var(--font-serif)", fontSize: 13, lineHeight: 1.6, marginBottom: 6 }}>
						<del>{it.before}</del>
						<br />
						<ins>{it.after}</ins>
					</div>
					<div className="why">{it.why}</div>
					<div className="actions">
						<button className="primary" onClick={() => onResolve(i, "accept")}>
							수락
						</button>
						<button onClick={() => onResolve(i, "skip")}>무시</button>
						<button onClick={() => scrollToRev(i)}>본문 보기</button>
					</div>
				</div>
			))}

			<div
				style={{
					marginTop: 16,
					padding: 12,
					background: "var(--surface-2)",
					borderRadius: "var(--radius)",
					fontSize: 12,
				}}
			>
				<div style={{ fontWeight: 600, marginBottom: 4, color: "var(--ink)" }}>
					클리프행어 강도 · {r.cliff}/100
				</div>
				<div style={{ color: "var(--ink-3)" }}>마지막 단락의 긴장감이 우수합니다. 8화 대비 +18점.</div>
			</div>
		</>
	);
}

function PanelCharacters() {
	return (
		<>
			<div style={{ marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<div>
					<div style={{ fontWeight: 600, fontSize: 13 }}>캐릭터 시트</div>
					<div style={{ fontSize: 11, color: "var(--ink-3)" }}>이 챕터 등장 인물 · 3명</div>
				</div>
				<button className="btn sm">
					<PlusIcon /> 추가
				</button>
			</div>

			{TW_CHARACTERS.map((c, i) => (
				<div key={i} className="char-card">
					<div className="row">
						<div className="char-ava" style={{ background: c.avatarColor }}>
							{c.initial}
						</div>
						<div style={{ flex: 1 }}>
							<h4>{c.name}</h4>
							<div className="role">{c.role}</div>
						</div>
					</div>
					<dl style={{ margin: 0 }}>
						{c.attrs.map((a, j) => (
							<div key={j} className="char-attr">
								<dt>{a.k}</dt>
								<dd className={a.warn ? "warn" : ""}>
									{a.v}{" "}
									{a.warn && (
										<AlertIcon />
									)}
								</dd>
							</div>
						))}
					</dl>
					{c.note && (
						<div
							style={{
								marginTop: 10,
								padding: 8,
								background: "var(--surface-2)",
								borderRadius: 6,
								fontSize: 11,
								color: "var(--ink-3)",
								lineHeight: 1.5,
							}}
						>
							※ {c.note}
						</div>
					)}
				</div>
			))}
		</>
	);
}

// ---------- MAIN EDITOR PAGE ----------
export default function EditorPage() {
	const [rightPanel, setRightPanel] = useState<"suggestions" | "chat" | "review" | "characters">("suggestions");
	const [activeChap, setActiveChap] = useState(9);
	const [focus, setFocus] = useState(false);
	const [tweaksOpen, setTweaksOpen] = useState(false);
	const [theme, setTheme] = useState("light");

	const [ghostVisible, setGhostVisible] = useState(true);

	const [warnBadge, setWarnBadge] = useState(true);
	const [alertOpen, setAlertOpen] = useState(false);

	const [resolved, setResolved] = useState(() => TW_REVIEW.items.map(() => false));
	const [activeRev, setActiveRev] = useState<number | null>(null);

	const [saving, setSaving] = useState(false);
	const [toast, setToast] = useState<string | null>(null);

	useEffect(() => {
		document.documentElement.dataset.theme = theme;
	}, [theme]);

	useEffect(() => {
		const t = setInterval(() => {
			setSaving(true);
			setTimeout(() => setSaving(false), 800);
		}, 22000);
		return () => clearInterval(t);
	}, []);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (!ghostVisible) return;
			if (e.key === "Tab") {
				e.preventDefault();
				handleGhostAccept();
			} else if (e.key === "Escape") {
				setGhostVisible(false);
			} else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r") {
				e.preventDefault();
				setGhostVisible(false);
				setTimeout(() => setGhostVisible(true), 400);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [ghostVisible]);

	const handleGhostAccept = () => {
		setGhostVisible(false);
		showToast("AI 제안이 삽입되었습니다 · +48자");
	};

	const showToast = (msg: string) => {
		setToast(msg);
		setTimeout(() => setToast(null), 2200);
	};

	const onResolve = (i: number, kind: string) => {
		setResolved((r) => r.map((v, j) => (j === i ? true : v)));
		showToast(kind === "accept" ? "제안 수락됨" : "건너뛰기");
	};

	const scrollToRev = (i: number) => {
		setActiveRev(i);
		const el = document.querySelector(`.manuscript [data-rev="${i}"]`) as HTMLElement | null;
		if (el) {
			el.scrollIntoView({ block: "center", behavior: "smooth" });
		}
		setTimeout(() => setActiveRev(null), 1200);
	};

	const reviewMode = rightPanel === "review";
	const panelW = focus ? "0px" : "400px";

	return (
		<>
			<div className={"app" + (focus ? " focus" : "")} style={{ "--panel-w": panelW } as React.CSSProperties}>
				<Topbar
					focus={focus}
					setFocus={setFocus}
					saving={saving}
					tweaksOpen={tweaksOpen}
					setTweaksOpen={setTweaksOpen}
				/>
				<Sidebar activeChap={activeChap} setActiveChap={setActiveChap} />
				<EditorPane
					reviewMode={reviewMode}
					onClickTC={scrollToRev}
					ghostVisible={ghostVisible && !reviewMode}
					warnBadge={warnBadge}
					onWarnClick={() => setAlertOpen((v) => !v)}
					alertOpen={alertOpen}
					onAlertAction={(act) => {
						setAlertOpen(false);
						if (act === "fix") {
							setWarnBadge(false);
							showToast("3화 설정 기준으로 수정됨 · 은청색");
						} else if (act === "intent") {
							setWarnBadge(false);
							showToast("의도적 변경으로 표시됨");
						}
					}}
				/>
				<aside className="rightpanel">
					<div className="rp-tabs">
						<button
							className={"rp-tab" + (rightPanel === "suggestions" ? " active" : "")}
							onClick={() => setRightPanel("suggestions")}
						>
							이어쓰기 <span className="badge">AI</span>
						</button>
						<button
							className={"rp-tab" + (rightPanel === "chat" ? " active" : "")}
							onClick={() => setRightPanel("chat")}
						>
							채팅
						</button>
						<button
							className={"rp-tab" + (rightPanel === "review" ? " active" : "")}
							onClick={() => setRightPanel("review")}
						>
							편집자
						</button>
						<button
							className={"rp-tab" + (rightPanel === "characters" ? " active" : "")}
							onClick={() => setRightPanel("characters")}
						>
							캐릭터
						</button>
					</div>
					<div className="rp-body">
						{rightPanel === "suggestions" && (
							<PanelSuggestions
								onGhost={() => setGhostVisible(true)}
								onInsert={(d) => showToast(`"${d.title}" 방향으로 초고 삽입됨`)}
							/>
						)}
						{rightPanel === "chat" && (
							<PanelChat onInsertChat={() => showToast("채팅 초고가 본문에 삽입되었습니다")} />
						)}
						{rightPanel === "review" && (
							<PanelReview
								resolved={resolved}
								onResolve={onResolve}
								activeRev={activeRev}
								scrollToRev={scrollToRev}
							/>
						)}
						{rightPanel === "characters" && <PanelCharacters />}
					</div>
				</aside>
			</div>

			<div className={"tweaks" + (tweaksOpen ? " open" : "")}>
				<div className="t-head">
					<h4>
						Tweaks <span>DESIGN</span>
					</h4>
					<button
						className="iconbtn"
						onClick={() => setTweaksOpen(false)}
						style={{ width: 24, height: 24 }}
					>
						✕
					</button>
				</div>
				<div className="t-body">
					<div className="t-group">
						<div className="t-label">에디터 테마</div>
						<div className="seg" style={{ "--cols": 3 } as React.CSSProperties}>
							{(["light", "dark", "paper"] as const).map((t) => (
								<button key={t} className={theme === t ? "on" : ""} onClick={() => setTheme(t)}>
									{t === "light" ? "라이트" : t === "dark" ? "다크" : "원고지"}
								</button>
							))}
						</div>
					</div>
					<div className="t-group">
						<div className="t-label">우측 패널</div>
						<div className="seg" style={{ "--cols": 2, gridTemplateColumns: "1fr 1fr" } as React.CSSProperties}>
							{(
								[
									{ k: "suggestions", l: "이어쓰기" },
									{ k: "chat", l: "AI 채팅" },
									{ k: "review", l: "편집자" },
									{ k: "characters", l: "캐릭터" },
								] as const
							).map((o) => (
								<button
									key={o.k}
									className={rightPanel === o.k ? "on" : ""}
									onClick={() => setRightPanel(o.k)}
								>
									{o.l}
								</button>
							))}
						</div>
					</div>
					<div
						style={{
							fontSize: 11,
							color: "var(--ink-3)",
							background: "var(--surface-2)",
							padding: 10,
							borderRadius: 8,
							marginBottom: 0,
						}}
					>
						💡 에디터에서 <kbd>Tab</kbd>으로 AI 이어쓰기를 수락하거나 <kbd>Esc</kbd>로 거절해보세요.
					</div>
				</div>
			</div>

			{toast && <div className="toast">{toast}</div>}
		</>
	);
}
