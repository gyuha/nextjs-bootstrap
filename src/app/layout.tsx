import type { Metadata } from "next";
import { Providers } from "./providers";
import "./tailwind.css";
import "./globals.scss";

export const metadata: Metadata = {
	title: "Auth Bootstrap",
	description: "Next.js 프론트엔드 시작 템플릿",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko" className="h-full antialiased">
			<body className="min-h-full flex flex-col">
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
