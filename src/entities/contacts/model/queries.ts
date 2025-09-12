import {
	type UseQueryOptions,
	keepPreviousData,
	useQueryClient
} from '@tanstack/react-query'

import { getContactById, getContacts } from '../api/base.api'
import { getContactFields } from '../api/fields.api'
import { getGroups } from '../api/groups.api'
import { getImportHistory, getImportStatus } from '../api/import.api'
import { getContactEmailLogs, getContactEmailStats } from '../api/stats.api'
import { getTrashedContacts } from '../api/trash.api'
import type {
	ContactEmailStatsDto,
	ContactResponseDto,
	GetContactFieldsResponseDto,
	GetContactsQueryDto,
	GetContactsResponseDto,
	GetEmailLogsQueryDto,
	GetEmailLogsResponseDto,
	GetGroupsQueryDto,
	GetImportHistoryQueryDto,
	GetImportHistoryResponseDto,
	GetTrashedContactsResponseDto,
	GroupsResponseDto,
	ImportStatusResponseDto
} from '../api/types'

import { contactsKeys, fieldsKeys, groupsKeys, importKeys } from './queryKeys'

export const contactsListQuery = (params?: GetContactsQueryDto) =>
	({
		queryKey: contactsKeys.list(params as unknown as Record<string, unknown>),
		queryFn: () => getContacts(params),
		staleTime: 60_000,
		gcTime: 5 * 60_000,
		placeholderData: keepPreviousData,
		retry: 1,
		refetchOnMount: 'always'
	}) satisfies UseQueryOptions<GetContactsResponseDto>

export const contactDetailQuery = (id: string) =>
	({
		queryKey: contactsKeys.detail(id),
		queryFn: () => getContactById(id),
		staleTime: 60_000,
		retry: 1
	}) satisfies UseQueryOptions<ContactResponseDto>

export const groupsListQuery = (params?: GetGroupsQueryDto) =>
	({
		queryKey: groupsKeys.list(params as unknown as Record<string, unknown>),
		queryFn: () => getGroups(params),
		staleTime: 10 * 60_000,
		gcTime: 30 * 60_000,
		refetchOnMount: 'always'
	}) satisfies UseQueryOptions<GroupsResponseDto>

export const contactFieldsQuery = () =>
	({
		queryKey: fieldsKeys.list(),
		queryFn: () => getContactFields(),
		staleTime: 30 * 60_000,
		gcTime: 60 * 60_000
	}) satisfies UseQueryOptions<GetContactFieldsResponseDto>

export const trashedContactsQuery = (params?: GetContactsQueryDto) =>
	({
		queryKey: contactsKeys.trash(params as unknown as Record<string, unknown>),
		queryFn: () => getTrashedContacts(params),
		staleTime: 60_000,
		gcTime: 5 * 60_000,
		placeholderData: keepPreviousData
	}) satisfies UseQueryOptions<GetTrashedContactsResponseDto>

export const importStatusQuery = (id: string) =>
	({
		queryKey: importKeys.status(id),
		queryFn: () => getImportStatus(id)
		// refetchInterval будет задаваться в хукe на основе данных
	}) satisfies UseQueryOptions<ImportStatusResponseDto>

export const importHistoryQuery = (params?: GetImportHistoryQueryDto) =>
	({
		queryKey: importKeys.history(params as unknown as Record<string, unknown>),
		queryFn: () => getImportHistory(params),
		staleTime: 30 * 60_000,
		gcTime: 60 * 60_000,
		placeholderData: keepPreviousData
	}) satisfies UseQueryOptions<GetImportHistoryResponseDto>

export const contactEmailStatsQuery = (id: string) =>
	({
		queryKey: contactsKeys.emailStats(id),
		queryFn: () => getContactEmailStats(id),
		staleTime: 60_000,
		retry: 1
	}) satisfies UseQueryOptions<ContactEmailStatsDto>

export const contactEmailLogsQuery = (
	id: string,
	params?: GetEmailLogsQueryDto
) =>
	({
		queryKey: contactsKeys.emailLogs(
			id,
			params as unknown as Record<string, unknown>
		),
		queryFn: () => getContactEmailLogs(id, params),
		staleTime: 60_000,
		gcTime: 5 * 60_000,
		placeholderData: keepPreviousData,
		retry: 1
	}) satisfies UseQueryOptions<GetEmailLogsResponseDto>

export const useInvalidateContacts = () => {
	const queryClient = useQueryClient()
	return () => {
		Promise.all([
			queryClient.invalidateQueries({ queryKey: contactsKeys.all }),
			queryClient.invalidateQueries({ queryKey: fieldsKeys.all }),
			queryClient.refetchQueries({ queryKey: fieldsKeys.all }),
			queryClient.refetchQueries({ queryKey: contactsKeys.all })
		])
	}
}

export const useInvalidateGroups = () => {
	const queryClient = useQueryClient()
	return () => {
		queryClient.invalidateQueries({ queryKey: groupsKeys.all })
	}
}

export const useInvalidateFields = () => {
	const queryClient = useQueryClient()
	return () => {
		queryClient.invalidateQueries({ queryKey: fieldsKeys.all })
	}
}

export const useInvalidateImports = () => {
	const queryClient = useQueryClient()
	return () => {
		queryClient.invalidateQueries({ queryKey: importKeys.all })
	}
}

export const useRefetchFields = () => {
	const queryClient = useQueryClient()
	return () => queryClient.refetchQueries({ queryKey: fieldsKeys.all })
}
