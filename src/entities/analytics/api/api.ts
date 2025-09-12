import { apiInstance, handleApiError } from '@/shared/api'

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
} from './types'

// GET /v1/analytics/errors
export const getErrorsTop = async (
	params?: GetErrorsTopQuery
): Promise<GetErrorsTopResponse> => {
	try {
		const { data } = await apiInstance.get<GetErrorsTopResponse>(
			'/v1/analytics/errors',
			{ params }
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// GET /v1/analytics/funnel
export const getFunnel = async (
	params?: GetFunnelQuery
): Promise<GetFunnelResponse> => {
	try {
		const { data } = await apiInstance.get<GetFunnelResponse>(
			'/v1/analytics/funnel',
			{ params }
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// GET /v1/analytics/summary
export const getSummary = async (
	params?: GetSummaryQuery
): Promise<GetSummaryResponse> => {
	try {
		const { data } = await apiInstance.get<GetSummaryResponse>(
			'/v1/analytics/summary',
			{ params }
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// GET /v1/analytics/timeseries
export const getTimeseries = async (
	params: GetTimeseriesQuery
): Promise<GetTimeseriesResponse> => {
	try {
		const { data } = await apiInstance.get<GetTimeseriesResponse>(
			'/v1/analytics/timeseries',
			{ params }
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// GET /v1/analytics/engagement/distribution
export const getEngagementDistribution = async (
	params?: GetEngagementDistributionQuery
): Promise<GetEngagementDistributionResponse> => {
	try {
		const { data } = await apiInstance.get<GetEngagementDistributionResponse>(
			'/v1/analytics/engagement/distribution',
			{ params }
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// GET /v1/analytics/sending/performance
export const getSendingPerformance = async (
	params: GetSendingPerformanceQuery
): Promise<GetSendingPerformanceResponse> => {
	try {
		const { data } = await apiInstance.get<GetSendingPerformanceResponse>(
			'/v1/analytics/sending/performance',
			{ params }
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
