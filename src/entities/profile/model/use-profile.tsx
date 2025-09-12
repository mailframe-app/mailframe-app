import { useQuery } from '@tanstack/react-query'

import { type ProfileResponse } from '../api'

import { profileQuery } from './queries'

export const useProfile = (): ProfileResponse | undefined => {
	const { data } = useQuery({
		...profileQuery()
	})

	return data ?? undefined
}
