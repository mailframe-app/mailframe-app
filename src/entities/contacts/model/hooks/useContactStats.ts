import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getContactEmailLogs, getContactEmailStats } from '../../api/stats.api'
import type {
	ContactEmailStatsDto,
	GetEmailLogsQueryDto,
	GetEmailLogsResponseDto
} from '../../api/types'
import { contactsKeys } from '../queryKeys'

export const useContactEmailStats = (id: string | undefined) =>
	useQuery<ContactEmailStatsDto>({
		queryKey: id ? contactsKeys.emailStats(id) : contactsKeys.emailStats(''),
		queryFn: () => getContactEmailStats(id as string),
		enabled: Boolean(id),
		staleTime: 60_000
	})

export const useContactEmailLogs = (
	id: string | undefined,
	params?: GetEmailLogsQueryDto
) =>
	useQuery<GetEmailLogsResponseDto>({
		queryKey: id
			? contactsKeys.emailLogs(id, params as unknown as Record<string, unknown>)
			: contactsKeys.emailLogs(''),
		queryFn: () => getContactEmailLogs(id as string, params),
		enabled: Boolean(id),
		staleTime: 60_000,
		gcTime: 5 * 60_000,
		placeholderData: keepPreviousData
	})
