import { type UseQueryOptions, keepPreviousData } from '@tanstack/react-query'

import {
	getEngagementDistribution,
	getErrorsTop,
	getFunnel,
	getSendingPerformance,
	getSummary,
	getTimeseries
} from '../api'
import type {
	GetEngagementDistributionQuery,
	GetEngagementDistributionResponse,
	GetErrorsTopQuery,
	GetErrorsTopResponse,
	GetFunnelQuery,
	GetFunnelResponse,
	GetSendingPerformanceQuery,
	GetSendingPerformanceResponse,
	GetSummaryQuery,
	GetSummaryResponse,
	GetTimeseriesQuery,
	GetTimeseriesResponse
} from '../api/types'

import { analyticsKeys } from './queryKeys'

export const errorsTopQuery = (params?: GetErrorsTopQuery) =>
	({
		queryKey: analyticsKeys.errorsTop(
			params as unknown as Record<string, unknown>
		),
		queryFn: () => getErrorsTop(params),
		staleTime: 60_000,
		gcTime: 5 * 60_000
	}) satisfies UseQueryOptions<GetErrorsTopResponse>

export const funnelQuery = (params?: GetFunnelQuery) =>
	({
		queryKey: analyticsKeys.funnel(
			params as unknown as Record<string, unknown>
		),
		queryFn: () => getFunnel(params),
		staleTime: 60_000,
		gcTime: 5 * 60_000
	}) satisfies UseQueryOptions<GetFunnelResponse>

export const summaryQuery = (params?: GetSummaryQuery) =>
	({
		queryKey: analyticsKeys.summary(
			params as unknown as Record<string, unknown>
		),
		queryFn: () => getSummary(params),
		staleTime: 60_000,
		gcTime: 5 * 60_000
	}) satisfies UseQueryOptions<GetSummaryResponse>

export const timeseriesQuery = (params: GetTimeseriesQuery) =>
	({
		queryKey: analyticsKeys.timeseries(
			params as unknown as Record<string, unknown>
		),
		queryFn: () => getTimeseries(params),
		staleTime: 60_000,
		gcTime: 5 * 60_000,
		placeholderData: keepPreviousData
	}) satisfies UseQueryOptions<GetTimeseriesResponse>

export const engagementDistributionQuery = (
	params?: GetEngagementDistributionQuery
) =>
	({
		queryKey: analyticsKeys.engagementDistribution(
			params as unknown as Record<string, unknown>
		),
		queryFn: () => getEngagementDistribution(params),
		staleTime: 60_000,
		gcTime: 5 * 60_000
	}) satisfies UseQueryOptions<GetEngagementDistributionResponse>

export const sendingPerformanceQuery = (params: GetSendingPerformanceQuery) =>
	({
		queryKey: analyticsKeys.sendingPerformance(
			params as unknown as Record<string, unknown>
		),
		queryFn: () => getSendingPerformance(params),
		staleTime: 60_000,
		gcTime: 5 * 60_000,
		placeholderData: keepPreviousData
	}) satisfies UseQueryOptions<GetSendingPerformanceResponse>
