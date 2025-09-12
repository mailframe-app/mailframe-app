import { keepPreviousData, useQuery } from '@tanstack/react-query'

import { getGroups } from '../../api/groups.api'
import type { GetGroupsQueryDto, GroupsResponseDto } from '../../api/types'
import { groupsKeys } from '../queryKeys'

export const useGroups = (params?: GetGroupsQueryDto) =>
	useQuery<GroupsResponseDto>({
		queryKey: groupsKeys.list(params as unknown as Record<string, unknown>),
		queryFn: () => getGroups(params),
		staleTime: 10 * 60_000,
		gcTime: 30 * 60_000,
		refetchOnMount: 'always',
		placeholderData: keepPreviousData
	})
