export const AUTH_SESSION_COOKIE = "auth-session";
export const AUTH_SESSION_STORAGE_KEY = "auth-session-storage";
export const AUTH_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export const AUTH_PROTECTED_ROUTES = ["/"];
export const AUTH_PUBLIC_ROUTES = ["/login", "/signup"];

export function syncAuthSessionCookie(isAuthenticated: boolean) {
	if (typeof document === "undefined") {
		return;
	}

	if (isAuthenticated) {
		// biome-ignore lint/suspicious/noDocumentCookie: proxy.ts reads this lightweight client-managed session hint.
		document.cookie = [
			`${AUTH_SESSION_COOKIE}=1`,
			"Path=/",
			`Max-Age=${AUTH_SESSION_MAX_AGE}`,
			"SameSite=Lax",
		].join("; ");
		return;
	}

	// biome-ignore lint/suspicious/noDocumentCookie: clearing the mirrored auth cookie keeps proxy redirects in sync.
	document.cookie = [
		`${AUTH_SESSION_COOKIE}=`,
		"Path=/",
		"Max-Age=0",
		"SameSite=Lax",
	].join("; ");
}
