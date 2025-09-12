import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { queryClient } from '@/shared/api'

export function AppProvider({ children }: { children?: React.ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools
				initialIsOpen={false}
				buttonPosition='bottom-right'
				position='bottom'
			/>
		</QueryClientProvider>
	)
}
