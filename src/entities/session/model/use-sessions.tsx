import { useQuery } from '@tanstack/react-query'

import { type SessionResponse } from '../api'

import { sessionQuery } from './queries'

export const useSessions = (): SessionResponse[] => {
	const { data } = useQuery({
		...sessionQuery()
	})

	return data ?? []
}
