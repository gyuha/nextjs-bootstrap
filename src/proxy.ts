import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
	AUTH_PROTECTED_ROUTES,
	AUTH_PUBLIC_ROUTES,
	AUTH_SESSION_COOKIE,
} from "@/features/auth/lib/auth-session";

function isExactRoute(pathname: string, routes: string[]) {
	return routes.some((route) => route === pathname);
}

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const hasSession = request.cookies.get(AUTH_SESSION_COOKIE)?.value === "1";
	const isProtectedRoute = isExactRoute(pathname, AUTH_PROTECTED_ROUTES);
	const isPublicRoute = isExactRoute(pathname, AUTH_PUBLIC_ROUTES);

	if (!hasSession && isProtectedRoute) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	if (hasSession && isPublicRoute) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/", "/login", "/signup"],
};
