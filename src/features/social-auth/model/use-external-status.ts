import { useQuery } from '@tanstack/react-query'

import { fetchExternalStatus } from '../api'

export const externalStatusQuery = () => ({
	queryKey: ['fetch external status'],
	queryFn: () => fetchExternalStatus()
})

export function useExternalStatus() {
	return useQuery(externalStatusQuery())
}
