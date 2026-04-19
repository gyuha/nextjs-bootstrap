import { QueryClient } from '@tanstack/react-query';

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      mutations: {
        retry: 0,
      },
      queries: {
        refetchOnWindowFocus: false,
        retry: 0,
      },
    },
  });
}
