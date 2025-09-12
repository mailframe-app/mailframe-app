import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: Infinity,
			refetchInterval: false,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			refetchOnMount: false
		}
	}
})
