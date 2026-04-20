"use client";

import Link from "next/link";
import { ShowcasePane } from "./showcase-pane";

interface AuthShellProps {
	children: React.ReactNode;
}

export function AuthShell({ children }: AuthShellProps) {
	return (
		<div className="tw-auth-root">
			<ShowcasePane />

			<main className="tw-auth-main">
				<nav className="tw-auth-topnav">
					<span className="tw-tnav-brand">
						<svg
							width="20"
							height="20"
							viewBox="0 0 32 32"
							fill="none"
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
						Tale Weaver
					</span>
					<div className="tw-tnav-right">
						<Link href="/" className="tw-tnav-link">
							에디터 프로토타입 →
						</Link>
					</div>
				</nav>

				<div className="tw-auth-center">
					<div className="tw-auth-card">{children}</div>
				</div>
			</main>
		</div>
	);
}
