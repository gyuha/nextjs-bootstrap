"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import ModalManager from "@/components/ui/modal/modal-manager";
import { getQueryClient } from "@/lib/query-client";

export function Providers({ children }: { children: React.ReactNode }) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ModalManager />
		</QueryClientProvider>
	);
}
