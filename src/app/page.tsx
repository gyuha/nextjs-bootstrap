"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Project {
	id: string;
	title: string;
	subtitle: string;
	genre: string;
	genreColor: string;
	status: string;
	statusTone: "ok" | "warn" | "muted" | "done";
	cover: "roman" | "fantasy" | "modern" | "muhyeop" | "cozy" | "draft";
	coverHue: number;
	chapters: number;
	totalWords: number;
	todayWords: number;
	goalWords: number;
	streak: number;
	lastEdit: string;
	lastChapter: string;
	collaborators: number;
	aiActive: boolean;
	readers: number;
	rating: number | null;
	pinned: boolean;
	unreadReview: number;
}

interface Template {
	id: string;
	title: string;
	sub: string;
	chapters: number;
	color: string;
	hue: number;
}

const PROJECTS: Project[] = [
	{
		id: "n1",
		title: "폐황녀의 회귀",
		subtitle: "단두대 위에서 눈을 뜬 그녀의 복수극",
		genre: "로맨스판타지",
		genreColor: "rosefantasy",
		status: "연재 중",
		statusTone: "ok",
		cover: "roman",
		coverHue: 310,
		chapters: 47,
		totalWords: 184200,
		todayWords: 3820,
		goalWords: 5500,
		streak: 12,
		lastEdit: "14분 전",
		lastChapter: "9화 폐제의 손길",
		collaborators: 1,
		aiActive: true,
		readers: 24380,
		rating: 4.7,
		pinned: true,
		unreadReview: 3,
	},
	{
		id: "n2",
		title: "검은 숲의 유물",
		subtitle: "사라진 마법사들이 남긴 단서를 쫓아서",
		genre: "판타지",
		genreColor: "fantasy",
		status: "초안",
		statusTone: "warn",
		cover: "fantasy",
		coverHue: 170,
		chapters: 14,
		totalWords: 42110,
		todayWords: 0,
		goalWords: 5000,
		streak: 0,
		lastEdit: "3일 전",
		lastChapter: "14화 회색 탑",
		collaborators: 2,
		aiActive: false,
		readers: 0,
		rating: null,
		pinned: true,
		unreadReview: 0,
	},
	{
		id: "n3",
		title: "헌터 아카데미 7기",
		subtitle: "하위 각성자의 최상위 포식자 만들기",
		genre: "현대판타지",
		genreColor: "modern",
		status: "연재 중",
		statusTone: "ok",
		cover: "modern",
		coverHue: 40,
		chapters: 82,
		totalWords: 340500,
		todayWords: 2120,
		goalWords: 4000,
		streak: 34,
		lastEdit: "어제 22:10",
		lastChapter: "82화 각성의 대가",
		collaborators: 1,
		aiActive: false,
		readers: 58920,
		rating: 4.8,
		pinned: false,
		unreadReview: 1,
	},
	{
		id: "n4",
		title: "무명검의 귀환",
		subtitle: "중원을 떠났던 검객이 돌아온 이유",
		genre: "무협",
		genreColor: "muhyeop",
		status: "휴재",
		statusTone: "muted",
		cover: "muhyeop",
		coverHue: 200,
		chapters: 28,
		totalWords: 98700,
		todayWords: 0,
		goalWords: 4500,
		streak: 0,
		lastEdit: "3주 전",
		lastChapter: "28화 풍운회",
		collaborators: 0,
		aiActive: false,
		readers: 8410,
		rating: 4.3,
		pinned: false,
		unreadReview: 0,
	},
	{
		id: "n5",
		title: "이세계 편의점 운영기",
		subtitle: "엘프와 드래곤에게 삼각김밥 파는 법",
		genre: "판타지",
		genreColor: "fantasy",
		status: "완결",
		statusTone: "done",
		cover: "cozy",
		coverHue: 90,
		chapters: 120,
		totalWords: 456000,
		todayWords: 0,
		goalWords: 0,
		streak: 0,
		lastEdit: "2개월 전",
		lastChapter: "완결 후기",
		collaborators: 1,
		aiActive: false,
		readers: 142300,
		rating: 4.9,
		pinned: false,
		unreadReview: 0,
	},
	{
		id: "n6",
		title: "새 프로젝트 · 제목 미정",
		subtitle: "캐릭터 시트만 작성된 초기 단계",
		genre: "로맨스",
		genreColor: "romance",
		status: "구상",
		statusTone: "muted",
		cover: "draft",
		coverHue: 350,
		chapters: 0,
		totalWords: 1240,
		todayWords: 540,
		goalWords: 3000,
		streak: 2,
		lastEdit: "1시간 전",
		lastChapter: "캐릭터 노트 · 하린",
		collaborators: 0,
		aiActive: false,
		readers: 0,
		rating: null,
		pinned: false,
		unreadReview: 0,
	},
];

const TEMPLATES: Template[] = [
	{ id: "t1", title: "회귀·빙의 템플릿", sub: "로맨스판타지 · 3막 구조", chapters: 10, color: "rosefantasy", hue: 310 },
	{ id: "t2", title: "각성 아카데미", sub: "현대판타지 · 성장 서사", chapters: 12, color: "modern", hue: 40 },
	{ id: "t3", title: "단일 에피소드", sub: "SF · 1만 자 단편", chapters: 1, color: "sf", hue: 230 },
	{ id: "t4", title: "빈 프로젝트", sub: "처음부터 자유롭게", chapters: 0, color: "blank", hue: 0 },
];

const TEMPLATE_GLYPHS: Record<string, string> = { t1: "◈", t2: "✦", t3: "◇", t4: "○" };

const ACTIVITY = [
	{
		t: "14:32",
		icon: "save",
		text: (
			<>
				<b>폐황녀의 회귀</b> · 9화 자동 저장됨 <em>+624자</em>
			</>
		),
	},
	{
		t: "14:28",
		icon: "ai",
		text: (
			<>
				AI가 <b>폐황녀의 회귀</b> 9화에서 설정 일관성 경고 1건을 감지했어요
			</>
		),
	},
	{
		t: "13:50",
		icon: "chap",
		text: (
			<>
				<b>헌터 아카데미 7기</b> 82화 초고 완료 <em>4,120자</em>
			</>
		),
	},
	{
		t: "어제",
		icon: "pub",
		text: (
			<>
				<b>헌터 아카데미 7기</b> 81화 발행 · 예상 조회 <em>18k</em>
			</>
		),
	},
	{
		t: "어제",
		icon: "ai",
		text: (
			<>
				AI 편집자가 <b>검은 숲의 유물</b> 13화 품질 점수를 87점으로 상향
			</>
		),
	},
];

// ---------- ICONS ----------
const SearchIcon = () => (
	<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
		<circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.6" />
		<path d="M17 17l-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
	</svg>
);
const PlusIcon = () => (
	<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
		<path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
	</svg>
);
const PinIcon = () => (
	<svg width="14" height="14" viewBox="0 0 20 20" fill="none">
		<path d="M12 3l5 5-3 1-2 5-3-3-4 4 1-5-3-2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
	</svg>
);
const PinFillIcon = () => (
	<svg width="14" height="14" viewBox="0 0 20 20">
		<path fill="currentColor" d="M12 3l5 5-3 1-2 5-3-3-4 4 1-5-3-2z" />
	</svg>
);
const FireIcon = () => (
	<svg width="13" height="13" viewBox="0 0 20 20" fill="none">
		<path d="M10 2c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4 0 2 1 2 2 1 0-2 0-3 0-5z" fill="currentColor" />
	</svg>
);
const StarIcon = () => (
	<svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
		<path d="M10 2l2.5 5 5.5.8-4 3.9 1 5.5L10 14.6l-5 2.6 1-5.5-4-3.9 5.5-.8z" />
	</svg>
);
const BellIcon = () => (
	<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
		<path d="M4 15h12l-2-2V9a4 4 0 0 0-8 0v4l-2 2zM8 17a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
	</svg>
);
const GridIcon = () => (
	<svg width="15" height="15" viewBox="0 0 20 20" fill="none">
		<rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
		<rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
		<rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
		<rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
	</svg>
);
const ListIcon = () => (
	<svg width="15" height="15" viewBox="0 0 20 20" fill="none">
		<path d="M6 5h12M6 10h12M6 15h12M3 5h.01M3 10h.01M3 15h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
	</svg>
);
const ArrowIcon = () => (
	<svg width="14" height="14" viewBox="0 0 20 20" fill="none">
		<path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
	</svg>
);
const SparkIcon = () => (
	<svg width="16" height="16" viewBox="0 0 20 20" fill="none">
		<path d="M10 2v4M10 14v4M2 10h4M14 10h4M5 5l2.5 2.5M12.5 12.5L15 15M5 15l2.5-2.5M12.5 7.5L15 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
	</svg>
);
const CalendarIcon = () => (
	<svg width="14" height="14" viewBox="0 0 20 20" fill="none">
		<rect x="3" y="5" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.4" />
		<path d="M3 9h14M7 3v4M13 3v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
	</svg>
);
const SaveIcon = () => (
	<svg width="14" height="14" viewBox="0 0 20 20" fill="none">
		<path d="M4 4h10l2 2v10H4z M4 4v4h8V4M6 12h8" stroke="currentColor" strokeWidth="1.4" />
	</svg>
);
const AiIcon = () => (
	<svg width="14" height="14" viewBox="0 0 20 20" fill="none">
		<path d="M10 2v4M10 14v4M2 10h4M14 10h4M5 5l2.5 2.5M12.5 12.5L15 15M5 15l2.5-2.5M12.5 7.5L15 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
	</svg>
);
const ChapIcon = () => (
	<svg width="14" height="14" viewBox="0 0 20 20" fill="none">
		<path d="M4 4h9a3 3 0 0 1 3 3v9H7a3 3 0 0 1-3-3V4z M4 13h12" stroke="currentColor" strokeWidth="1.4" />
	</svg>
);
const PubIcon = () => (
	<svg width="14" height="14" viewBox="0 0 20 20" fill="none">
		<path d="M3 11l7 5 7-12-14 7z M10 16V9" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
	</svg>
);

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
	save: <SaveIcon />,
	ai: <AiIcon />,
	chap: <ChapIcon />,
	pub: <PubIcon />,
};

// ---------- COVER ART ----------
function Cover({ project, size = "card" }: { project: Project; size?: "card" | "mini" }) {
	const hue = project.coverHue;
	const hue2 = (hue + 40) % 360;
	const style = {
		background: `linear-gradient(135deg, oklch(0.52 0.16 ${hue}) 0%, oklch(0.32 0.12 ${hue2}) 100%)`,
	};
	const glyphs: Record<string, string> = {
		roman: "❦",
		fantasy: "✦",
		modern: "◈",
		muhyeop: "剣",
		cozy: "☕",
		draft: "○",
	};
	return (
		<div className={"cover cover-" + size} style={style}>
			<div className="cover-pattern" />
			<div className="cover-glyph" style={{ color: `oklch(0.88 0.15 ${hue})` }}>
				{glyphs[project.cover] || "✦"}
			</div>
			<div className="cover-title">
				<div className="ct-t">{project.title}</div>
				<div className="ct-g">{project.genre}</div>
			</div>
		</div>
	);
}

// ---------- PROJECT CARD ----------
function ProjectCard({
	p,
	onOpen,
	onPin,
	view,
}: {
	p: Project & { pinned: boolean };
	onOpen: () => void;
	onPin: () => void;
	view: "grid" | "list";
}) {
	const prog = p.goalWords ? Math.min(100, Math.round((p.todayWords / p.goalWords) * 100)) : 0;

	if (view === "list") {
		return (
			<div className="pcard pcard-list" onClick={onOpen}>
				<Cover project={p} size="mini" />
				<div className="pl-body">
					<div className="pl-top">
						<h3>{p.title}</h3>
						<span className={"chip status " + p.statusTone}>{p.status}</span>
						{p.aiActive && (
							<span className="chip ai">
								<span className="pulse" /> AI 작업 중
							</span>
						)}
					</div>
					<div className="pl-meta">
						<span>
							<b>{p.chapters}</b>화
						</span>
						<span>·</span>
						<span>
							<b>{(p.totalWords / 10000).toFixed(1)}</b>만자
						</span>
						<span>·</span>
						<span>{p.lastChapter}</span>
						{p.readers > 0 && (
							<>
								<span>·</span>
								<span>
									독자 <b>{(p.readers / 1000).toFixed(1)}k</b>
								</span>
							</>
						)}
					</div>
				</div>
				<div className="pl-right">
					<div className="pl-when">{p.lastEdit}</div>
					{p.goalWords > 0 && (
						<div className="pl-goal">
							<div className="pl-gbar">
								<div style={{ width: prog + "%" }} />
							</div>
							<span>
								{p.todayWords.toLocaleString()} / {p.goalWords.toLocaleString()}
							</span>
						</div>
					)}
				</div>
				<button
					className="pl-pin"
					onClick={(e) => {
						e.stopPropagation();
						onPin();
					}}
					aria-label="고정"
				>
					{p.pinned ? <PinFillIcon /> : <PinIcon />}
				</button>
			</div>
		);
	}

	return (
		<article className="pcard" onClick={onOpen} tabIndex={0}>
			<Cover project={p} />
			<button
				className={"pc-pin" + (p.pinned ? " on" : "")}
				onClick={(e) => {
					e.stopPropagation();
					onPin();
				}}
				aria-label="고정"
			>
				{p.pinned ? <PinFillIcon /> : <PinIcon />}
			</button>
			{p.aiActive && (
				<div className="pc-ai-badge">
					<span className="pulse" /> AI 작업 중
				</div>
			)}

			<div className="pc-body">
				<div className="pc-top">
					<span className={"chip status " + p.statusTone}>{p.status}</span>
					<span className={"chip genre g-" + p.genreColor}>{p.genre}</span>
				</div>

				<h3 className="pc-title">{p.title}</h3>
				<p className="pc-sub">{p.subtitle}</p>

				<div className="pc-stats">
					<div>
						<b>{p.chapters}</b>
						<span>화</span>
					</div>
					<div>
						<b>{(p.totalWords / 10000).toFixed(1)}</b>
						<span>만자</span>
					</div>
					{p.streak > 0 ? (
						<div className="streak">
							<FireIcon />
							<b>{p.streak}</b>
							<span>일 연속</span>
						</div>
					) : p.readers > 0 ? (
						<div>
							<StarIcon />
							<b>{p.rating}</b>
							<span>({(p.readers / 1000).toFixed(0)}k)</span>
						</div>
					) : (
						<div className="muted">
							<span>아직 발행 전</span>
						</div>
					)}
				</div>

				{p.goalWords > 0 ? (
					<div className="pc-goal">
						<div className="pcg-head">
							<span>오늘 집필</span>
							<span>
								<b>{p.todayWords.toLocaleString()}</b> / {p.goalWords.toLocaleString()}자
							</span>
						</div>
						<div className="pcg-bar">
							<div style={{ width: prog + "%" }} />
						</div>
					</div>
				) : (
					<div className="pc-goal-placeholder">{p.status === "완결" ? "완결된 작품" : "목표 미설정"}</div>
				)}

				<footer className="pc-foot">
					<span className="pc-when">
						{p.lastEdit} · {p.lastChapter}
					</span>
					{p.unreadReview > 0 && (
						<span className="review-pill">
							<AiIcon /> 검토 {p.unreadReview}
						</span>
					)}
				</footer>
			</div>
		</article>
	);
}

// ---------- NEW PROJECT CARD ----------
function NewCard({ onNew }: { onNew: () => void }) {
	return (
		<button className="pcard newcard" onClick={onNew}>
			<div className="nc-ic">
				<PlusIcon />
			</div>
			<h3>새 작품 시작하기</h3>
			<p>빈 프로젝트 또는 템플릿에서 시작해요. AI가 장르에 맞춰 세계관·캐릭터 시트를 제안합니다.</p>
			<div className="nc-hint">
				<kbd>⌘</kbd>
				<kbd>N</kbd>
			</div>
		</button>
	);
}

// ---------- NEW PROJECT DIALOG ----------
function NewDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
	const [picked, setPicked] = useState<string | null>(null);
	if (!open) return null;
	return (
		<div className="dlg-scrim" onClick={onClose}>
			<div className="dlg" onClick={(e) => e.stopPropagation()}>
				<header className="dlg-head">
					<div>
						<div className="dlg-kicker">새 작품</div>
						<h2>어디서부터 시작할까요?</h2>
						<p>템플릿은 구조·톤만 제공해요. 문체는 AI가 당신의 글로부터 학습합니다.</p>
					</div>
					<button className="dlg-x" onClick={onClose}>
						✕
					</button>
				</header>

				<div className="tpl-grid">
					{TEMPLATES.map((t) => (
						<button key={t.id} className={"tpl" + (picked === t.id ? " on" : "")} onClick={() => setPicked(t.id)}>
							<div
								className="tpl-cover"
								style={{
									background:
										t.id === "t4"
											? "repeating-linear-gradient(45deg, var(--surface-2) 0 8px, var(--surface-elev) 8px 16px)"
											: `linear-gradient(135deg, oklch(0.55 0.15 ${t.hue}) 0%, oklch(0.32 0.1 ${(t.hue + 30) % 360}) 100%)`,
								}}
							>
								<div className="tpl-glyph">{TEMPLATE_GLYPHS[t.id]}</div>
							</div>
							<div className="tpl-body">
								<h4>{t.title}</h4>
								<p>{t.sub}</p>
								<span className="tpl-chap">{t.chapters > 0 ? `${t.chapters}챕터 스켈레톤` : "자유 구조"}</span>
							</div>
						</button>
					))}
				</div>

				<footer className="dlg-foot">
					<button className="btn-ghost" onClick={onClose}>
						취소
					</button>
					<button className="btn-primary" disabled={!picked}>
						선택한 템플릿으로 시작 <ArrowIcon />
					</button>
				</footer>
			</div>
		</div>
	);
}

// ---------- PROJECTS PAGE ----------
export default function ProjectsPage() {
	const router = useRouter();
	const [view, setView] = useState<"grid" | "list">("grid");
	const [filter, setFilter] = useState("all");
	const [dlgOpen, setDlgOpen] = useState(false);
	const [pinned, setPinned] = useState(new Set(PROJECTS.filter((p) => p.pinned).map((p) => p.id)));

	const togglePin = (id: string) => {
		const next = new Set(pinned);
		next.has(id) ? next.delete(id) : next.add(id);
		setPinned(next);
	};

	const filtered = PROJECTS.filter((p) => {
		if (filter === "all") return true;
		if (filter === "writing") return p.status === "연재 중" || p.status === "초안";
		if (filter === "draft") return p.status === "초안" || p.status === "구상";
		if (filter === "published") return p.status === "연재 중" || p.status === "완결";
		if (filter === "archived") return p.status === "휴재" || p.status === "완결";
		return true;
	});

	const pinnedItems = filtered.filter((p) => pinned.has(p.id));
	const rest = filtered.filter((p) => !pinned.has(p.id));

	const totalWordsThisMonth = 58420;
	const streakDays = 12;
	const chaptersThisMonth = 8;

	return (
		<div className="proj-root">
			{/* TOP NAV */}
			<header className="proj-nav">
				<div className="pn-left">
					<div className="tnav-brand">
						<svg width="22" height="22" viewBox="0 0 32 32" fill="none">
							<path
								d="M6 6c8 0 14 4 14 12s6 8 6 8"
								stroke="currentColor"
								strokeWidth="2.4"
								strokeLinecap="round"
							/>
							<circle cx="6" cy="6" r="2.4" fill="currentColor" />
							<circle cx="26" cy="26" r="2.4" fill="currentColor" />
						</svg>
						Tale Weaver
					</div>
					<nav className="pn-tabs">
						<button className="on">내 작품</button>
						<button>발견</button>
						<button>커뮤니티</button>
						<button>설정</button>
					</nav>
				</div>
				<div className="pn-right">
					<div className="pn-search">
						<SearchIcon />
						<input placeholder="작품 · 챕터 · 캐릭터 검색  ⌘K" readOnly />
					</div>
					<button className="pn-bell">
						<BellIcon />
						<span className="bell-dot" />
					</button>
					<button className="pn-avatar">
						<div className="avatar-pic">최</div>
						<div>
							<div className="av-name">최서연</div>
							<div className="av-meta">Pro · 다음 결제 5/1</div>
						</div>
					</button>
				</div>
			</header>

			<main className="proj-main">
				{/* HERO */}
				<section className="hero">
					<div className="hero-left">
						<div className="hero-k">오후 2시 12분 · 화요일</div>
						<h1>이어 쓸까요, 서연 작가님?</h1>
						<p>
							어제 9화의 <em>폐제의 손길</em> 마지막 문장에서 멈추셨어요.
						</p>

						<div className="hero-cta">
							<button className="btn-primary big" onClick={() => router.push("/editor")}>
								이어 쓰기 <ArrowIcon />
							</button>
							<button className="btn-ghost big" onClick={() => setDlgOpen(true)}>
								<PlusIcon /> 새 작품
							</button>
						</div>
					</div>

					<div className="hero-right">
						<div className="kpi">
							<div className="kpi-label">이번 달 집필</div>
							<div className="kpi-v">
								<b>{(totalWordsThisMonth / 10000).toFixed(1)}</b>
								<span>만자</span>
							</div>
							<div className="kpi-trend up">▲ 지난달 대비 +18%</div>
						</div>
						<div className="kpi">
							<div className="kpi-label">연속 집필</div>
							<div className="kpi-v">
								<b>{streakDays}</b>
								<span>일</span>
								<FireIcon />
							</div>
							<div className="kpi-spark">
								{[2, 3, 2, 4, 3, 5, 3, 4, 5, 4, 3, 5].map((h, i) => (
									<i key={i} style={{ height: h * 5 + "px" }} />
								))}
							</div>
						</div>
						<div className="kpi">
							<div className="kpi-label">이번 달 챕터</div>
							<div className="kpi-v">
								<b>{chaptersThisMonth}</b>
								<span>화</span>
							</div>
							<div className="kpi-trend">목표 10화 중</div>
						</div>
					</div>
				</section>

				<div className="proj-grid">
					{/* LEFT COLUMN — projects */}
					<section className="proj-col">
						<div className="col-head">
							<div className="ch-left">
								<h2>작품</h2>
								<span className="count">{filtered.length}</span>
							</div>
							<div className="ch-right">
								<div className="seg-tabs">
									{(
										[
											["all", "전체"],
											["writing", "집필 중"],
											["draft", "초안"],
											["published", "발행"],
											["archived", "보관"],
										] as const
									).map(([k, l]) => (
										<button key={k} className={filter === k ? "on" : ""} onClick={() => setFilter(k)}>
											{l}
										</button>
									))}
								</div>
								<div className="seg-tabs ml">
									<button className={view === "grid" ? "on" : ""} onClick={() => setView("grid")}>
										<GridIcon />
									</button>
									<button className={view === "list" ? "on" : ""} onClick={() => setView("list")}>
										<ListIcon />
									</button>
								</div>
							</div>
						</div>

						{pinnedItems.length > 0 && (
							<>
								<div className="sec-label">
									<PinFillIcon />
									<span>고정됨</span>
								</div>
								<div className={view === "grid" ? "cards-grid" : "cards-list"}>
									{pinnedItems.map((p) => (
										<ProjectCard
											key={p.id}
											p={{ ...p, pinned: true }}
											view={view}
											onOpen={() => router.push("/editor")}
											onPin={() => togglePin(p.id)}
										/>
									))}
								</div>
							</>
						)}

						{rest.length > 0 && (
							<>
								<div className="sec-label">
									<CalendarIcon />
									<span>최근 작업 순</span>
								</div>
								<div className={view === "grid" ? "cards-grid" : "cards-list"}>
									{rest.map((p) => (
										<ProjectCard
											key={p.id}
											p={{ ...p, pinned: false }}
											view={view}
											onOpen={() => router.push("/editor")}
											onPin={() => togglePin(p.id)}
										/>
									))}
									{view === "grid" && <NewCard onNew={() => setDlgOpen(true)} />}
								</div>
							</>
						)}
					</section>

					{/* RIGHT COLUMN — sidebar */}
					<aside className="proj-side">
						<div className="side-card ai-card">
							<div className="sc-head">
								<span className="sc-dot">
									<SparkIcon />
								</span>
								<h3>AI 편집자 요약</h3>
							</div>
							<p className="sc-lede">
								지난 7일간 총 <b>12건</b>의 제안 중 <b>9건</b>을 수락하셨어요. 수락률 <b>75%</b>는 로맨스판타지 작가
								평균보다 높은 편이에요.
							</p>
							<div className="insight">
								<div className="ins-ic">◈</div>
								<div>
									<b>클리프행어 강도가 꾸준히 상승 중</b>
									<span>9화 → 8.7점 (이전 평균 7.2점)</span>
								</div>
							</div>
							<div className="insight warn-tone">
								<div className="ins-ic warn">!</div>
								<div>
									<b>3화와 9화의 눈 색 묘사가 충돌</b>
									<span>폐황녀의 회귀 · 확인이 필요해요</span>
								</div>
							</div>
							<button className="sc-link">
								전체 인사이트 보기 <ArrowIcon />
							</button>
						</div>

						<div className="side-card">
							<div className="sc-head">
								<span className="sc-dot muted">
									<CalendarIcon />
								</span>
								<h3>최근 활동</h3>
							</div>
							<ul className="activity">
								{ACTIVITY.map((a, i) => (
									<li key={i}>
										<span className={"a-ic a-" + a.icon}>{ACTIVITY_ICONS[a.icon]}</span>
										<div className="a-body">
											<p>{a.text}</p>
											<span className="a-t">{a.t}</span>
										</div>
									</li>
								))}
							</ul>
						</div>

						<div className="side-card usage">
							<div className="sc-head">
								<span className="sc-dot">
									<SparkIcon />
								</span>
								<h3>AI 사용량</h3>
								<span className="plan-chip">Pro</span>
							</div>
							<div className="usage-row">
								<div>
									<div className="u-label">이어쓰기</div>
									<div className="u-v">
										<b>342</b> / 무제한
									</div>
								</div>
								<div>
									<div className="u-label">편집자 분석</div>
									<div className="u-v">
										<b>28</b> / 50회
									</div>
									<div className="u-bar">
										<div style={{ width: "56%" }} />
									</div>
								</div>
							</div>
							<div className="reset">다음 초기화 5월 1일</div>
						</div>
					</aside>
				</div>
			</main>

			<NewDialog open={dlgOpen} onClose={() => setDlgOpen(false)} />
		</div>
	);
}
