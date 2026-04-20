import type { AuthResponse, LoginInput, SignupInput } from "../types/auth";

function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockLogin(input: LoginInput): Promise<AuthResponse> {
	await delay(750);

	if (input.email === "fail@example.com") {
		return {
			success: false,
			message: "이메일 또는 비밀번호가 올바르지 않습니다",
		};
	}

	return {
		success: true,
		user: { name: "사용자", email: input.email },
	};
}

export async function mockSignup(input: SignupInput): Promise<AuthResponse> {
	await delay(750);

	if (input.email === "taken@example.com") {
		return { success: false, message: "이미 가입된 이메일입니다" };
	}

	return {
		success: true,
		user: { name: input.name, email: input.email },
	};
}
