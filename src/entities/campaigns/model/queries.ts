import {
	type UseQueryOptions,
	keepPreviousData,
	useQueryClient
} from '@tanstack/react-query'

import {
	getCampaign,
	getCampaignCalendar,
	getCampaignLogs,
	getCampaignStats,
	listCampaigns
} from '../api'
import type {
	CampaignResponse,
	CampaignStatsResponse,
	GetCampaignCalendarQuery,
	GetCampaignLogsQuery,
	GetCampaignLogsResponse,
	GetCampaignStatsQuery,
	ListCampaignsQuery,
	ListCampaignsResponse
} from '../api/types'

import { campaignsKeys } from './queryKeys'

export const campaignsListQuery = (params?: ListCampaignsQuery) =>
	({
		queryKey: campaignsKeys.list(params as unknown as Record<string, unknown>),
		queryFn: () => listCampaigns(params),
		staleTime: 60_000,
		gcTime: 5 * 60_000,
		placeholderData: keepPreviousData,
		retry: 1,
		refetchOnMount: 'always'
	}) satisfies UseQueryOptions<ListCampaignsResponse>

export const campaignDetailQuery = (id: string) =>
	({
		queryKey: campaignsKeys.detail(id),
		queryFn: () => getCampaign(id),
		staleTime: 60_000,
		retry: 1
	}) satisfies UseQueryOptions<CampaignResponse>

export const campaignStatsQuery = (
	id: string,
	params?: GetCampaignStatsQuery
) =>
	({
		queryKey: campaignsKeys.stats(
			id,
			params as unknown as Record<string, unknown>
		),
		queryFn: () => getCampaignStats(id, params),
		staleTime: 60_000,
		gcTime: 5 * 60_000
	}) satisfies UseQueryOptions<CampaignStatsResponse>

export const campaignLogsQuery = (id: string, params?: GetCampaignLogsQuery) =>
	({
		queryKey: campaignsKeys.logs(
			id,
			params as unknown as Record<string, unknown>
		),
		queryFn: () => getCampaignLogs(id, params),
		staleTime: 60_000,
		gcTime: 5 * 60_000,
		placeholderData: keepPreviousData
	}) satisfies UseQueryOptions<GetCampaignLogsResponse>

export const campaignCalendarQuery = (params: GetCampaignCalendarQuery) =>
	({
		queryKey: campaignsKeys.calendar(
			params as unknown as Record<string, unknown>
		),
		queryFn: () => getCampaignCalendar(params),
		staleTime: 10 * 60_000,
		gcTime: 30 * 60_000
	}) satisfies UseQueryOptions<unknown>

export const useInvalidateCampaigns = () => {
	const queryClient = useQueryClient()
	return () => {
		queryClient.invalidateQueries({ queryKey: campaignsKeys.all })
	}
}

export const useRefetchCampaignDetail = () => {
	const queryClient = useQueryClient()
	return (id: string) =>
		queryClient.refetchQueries({ queryKey: campaignsKeys.detail(id) })
}
