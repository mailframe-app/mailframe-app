import { useQuery } from '@tanstack/react-query'

import { getContactFields } from '../../api/fields.api'
import type { GetContactFieldsResponseDto } from '../../api/types'
import { fieldsKeys } from '../queryKeys'

export const useContactFields = () =>
	useQuery<GetContactFieldsResponseDto>({
		queryKey: fieldsKeys.list(),
		queryFn: () => getContactFields(),
		staleTime: 600_000
	})
