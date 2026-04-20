"use client";

interface IconProps {
	name:
		| "eye"
		| "eye-off"
		| "warn"
		| "check"
		| "arrow"
		| "back"
		| "spark"
		| "lock"
		| "kakao"
		| "naver"
		| "google"
		| "apple"
		| "email";
	size?: number;
	className?: string;
}

export function Icons({ name, size = 16, className }: IconProps) {
	const paths: Record<string, React.ReactNode> = {
		eye: (
			<>
				<path
					d="M1 10c2.5-4.5 5.5-7 9-7s6.5 2.5 9 7c-2.5 4.5-5.5 7-9 7s-6.5-2.5-9-7Z"
					stroke="currentColor"
					strokeWidth="1.4"
				/>
				<circle cx="10" cy="10" r="2.8" stroke="currentColor" strokeWidth="1.4" />
			</>
		),
		"eye-off": (
			<>
				<path
					d="M3 3l14 14M7 7c-2 1.4-3.8 3.2-5 5 2.5 4.5 5.5 7 9 7 1.7 0 3.2-.6 4.6-1.6M13 5.5c-1-.3-2-.5-3-.5-3.5 0-6.5 2.5-9 7 .9 1.6 2 3 3.2 4.2M10 7a3 3 0 0 1 3 3c0 .4-.1.8-.2 1.2"
					stroke="currentColor"
					strokeWidth="1.4"
					strokeLinecap="round"
				/>
			</>
		),
		warn: (
			<>
				<path
					d="M10 2l8 15H2L10 2z"
					stroke="currentColor"
					strokeWidth="1.4"
					strokeLinejoin="round"
				/>
				<path
					d="M10 8v4M10 14h.01"
					stroke="currentColor"
					strokeWidth="1.6"
					strokeLinecap="round"
				/>
			</>
		),
		check: (
			<>
				<path
					d="M3 10l4 4 10-10"
					stroke="currentColor"
					strokeWidth="1.8"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</>
		),
		arrow: (
			<>
				<path
					d="M4 10h12M11 5l5 5-5 5"
					stroke="currentColor"
					strokeWidth="1.6"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</>
		),
		back: (
			<>
				<path
					d="M16 10H4M9 5l-5 5 5 5"
					stroke="currentColor"
					strokeWidth="1.6"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</>
		),
		spark: (
			<>
				<path
					d="M10 2v4M10 14v4M2 10h4M14 10h4M5 5l2.5 2.5M12.5 12.5L15 15M5 15l2.5-2.5M12.5 7.5L15 5"
					stroke="currentColor"
					strokeWidth="1.4"
					strokeLinecap="round"
				/>
			</>
		),
		lock: (
			<>
				<rect
					x="4"
					y="9"
					width="12"
					height="8"
					rx="2"
					stroke="currentColor"
					strokeWidth="1.4"
				/>
				<path
					d="M7 9V6a3 3 0 0 1 6 0v3"
					stroke="currentColor"
					strokeWidth="1.4"
				/>
			</>
		),
		kakao: (
			<svg width={size} height={size} viewBox="0 0 24 24" fill="#000">
				<path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.82 1.86 5.28 4.62 6.66l-.96 3.54c-.1.36.3.66.6.48l4.2-2.76c.5.06 1 .1 1.54.1 5.52 0 10-3.48 10-7.8S17.52 3 12 3z" />
			</svg>
		),
		naver: (
			<svg width={size} height={size} viewBox="0 0 24 24" fill="#03C75A">
				<path d="M4 4h5l5.2 7.5V4H20v16h-5l-5.2-7.5V20H4z" />
			</svg>
		),
		google: (
			<svg width={size} height={size} viewBox="0 0 24 24">
				<path fill="#4285F4" d="M23 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h6.2c-.3 1.4-1.1 2.6-2.3 3.4v2.8h3.7c2.2-2 3.4-5 3.4-8.2z" />
				<path fill="#34A853" d="M12 24c3.1 0 5.7-1 7.6-2.8l-3.7-2.8c-1 .7-2.3 1.1-3.9 1.1-3 0-5.6-2-6.5-4.8H1.7v3C3.6 21.5 7.5 24 12 24z" />
				<path fill="#FBBC05" d="M5.5 14.7c-.5-1.4-.5-2.9 0-4.3v-3H1.7C.6 9.6 0 11.7 0 14s.6 4.4 1.7 6.5l3.8-3z" />
				<path fill="#EA4335" d="M12 4.8c1.7 0 3.2.6 4.4 1.7l3.3-3.3C17.7 1.2 15.1 0 12 0 7.5 0 3.6 2.5 1.7 6.4l3.8 3C6.4 6.7 9 4.8 12 4.8z" />
			</svg>
		),
		apple: (
			<svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
				<path d="M17.1 12.5c0-2.8 2.3-4.1 2.4-4.2-1.3-1.9-3.3-2.2-4-2.2-1.7-.2-3.3 1-4.2 1-.9 0-2.2-1-3.7-.9-1.9 0-3.7 1.1-4.7 2.8-2 3.4-.5 8.5 1.4 11.3 1 1.4 2.1 2.9 3.6 2.8 1.4-.1 2-.9 3.7-.9s2.2.9 3.7.9c1.5 0 2.5-1.4 3.4-2.7 1.1-1.6 1.5-3.1 1.5-3.2-.1 0-2.9-1.1-2.9-4.4zM14.4 4.2C15.2 3.3 15.7 2 15.5.7c-1.1.1-2.4.8-3.2 1.7-.7.8-1.4 2.1-1.2 3.4 1.3.1 2.5-.6 3.3-1.6z" />
			</svg>
		),
		email: (
			<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
				<rect x="2" y="4" width="20" height="16" rx="2" />
				<path d="M2 6l10 7 10-7" strokeLinecap="round" />
			</svg>
		),
	};

	if (["kakao", "naver", "google", "apple"].includes(name)) {
		return (
			<span className={className} style={{ display: "inline-flex" }}>
				{paths[name]}
			</span>
		);
	}

	return (
		<svg
			width={size}
			height={size}
			viewBox="0 0 20 20"
			fill="none"
			aria-hidden
			className={className}
		>
			{paths[name]}
		</svg>
	);
}
