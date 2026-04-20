import { AuthShell } from "@/components/layout/auth-shell";
import { SignupForm } from "@/features/auth/components/signup-form";

export default function SignupPage() {
	return (
		<AuthShell>
			<SignupForm />
		</AuthShell>
	);
}
