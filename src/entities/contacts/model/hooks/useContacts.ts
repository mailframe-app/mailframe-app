import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getContacts } from '../../api/base.api'
import type {
	GetContactsQueryDto,
	GetContactsResponseDto
} from '../../api/types'
import { contactsKeys } from '../queryKeys'

export const useContacts = (params?: GetContactsQueryDto) =>
	useQuery<GetContactsResponseDto>({
		queryKey: contactsKeys.list(params as unknown as Record<string, unknown>),
		queryFn: () => getContacts(params),
		staleTime: 60_000,
		gcTime: 5 * 60_000,
		placeholderData: keepPreviousData,
		retry: 1
	})
