import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
	title: "Tale Weaver — AI 웹소설 공동 집필",
	description: "캐릭터 시트·세계관을 학습한 AI가 작가의 문체로 이어 씁니다",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko" className="h-full antialiased">
			<head>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				<link
					href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
					rel="stylesheet"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap"
					rel="stylesheet"
				/>
			</head>
			<body className="min-h-full flex flex-col font-[family-name:var(--font-ui)] antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
