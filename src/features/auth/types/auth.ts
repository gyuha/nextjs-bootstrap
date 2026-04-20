export interface AuthUser {
	name: string;
	email: string;
}

export interface LoginInput {
	email: string;
	password: string;
}

export interface SignupInput {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

export interface AuthResponse {
	success: boolean;
	user?: AuthUser;
	message?: string;
}
