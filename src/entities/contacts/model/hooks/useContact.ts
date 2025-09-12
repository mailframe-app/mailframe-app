import { useQuery } from '@tanstack/react-query'

import { getContactById } from '../../api/base.api'
import type { ContactResponseDto } from '../../api/types'
import { contactsKeys } from '../queryKeys'

export const useContact = (id: string | undefined) =>
	useQuery<ContactResponseDto>({
		queryKey: id ? contactsKeys.detail(id) : contactsKeys.detail(''),
		queryFn: () => getContactById(id as string),
		enabled: Boolean(id),
		staleTime: 60_000
	})
