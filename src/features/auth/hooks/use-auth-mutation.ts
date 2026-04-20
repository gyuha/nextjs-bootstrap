import { useMutation } from "@tanstack/react-query";
import { mockLogin, mockSignup } from "../lib/mock-auth-api";
import { useAuthStore } from "../store/auth.store";
import type { LoginInput, SignupInput } from "../types/auth";

export function useLoginMutation() {
	const setUser = useAuthStore((s) => s.setUser);

	return useMutation({
		mutationFn: (input: LoginInput) => mockLogin(input),
		onSuccess: (response) => {
			if (response.success && response.user) {
				setUser(response.user);
			}
		},
	});
}

export function useSignupMutation() {
	return useMutation({
		mutationFn: (input: SignupInput) => mockSignup(input),
	});
}
