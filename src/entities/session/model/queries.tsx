import { type UseQueryOptions, useQueryClient } from '@tanstack/react-query'

import { getSessions } from '../api'

const sessionQueryKey = 'session'

export const sessionQuery = () =>
	({
		queryKey: [sessionQueryKey, 'active-sessions'],
		queryFn: () => getSessions()
	}) satisfies UseQueryOptions

export const useInvalidateSessionsList = () => {
	const queryClient = useQueryClient()

	return () => {
		queryClient.invalidateQueries({
			queryKey: [sessionQueryKey, 'active-sessions']
		})
	}
}
