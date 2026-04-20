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
			<body className="min-h-full flex flex-col font-[family-name:var(--font-ui)] antialiased">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
