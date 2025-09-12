import { apiInstance, handleApiError } from '@/shared/api'

import type {
	ActionSuccessResponse,
	RetryFailedResponse,
	ScheduleCampaignRequest
} from './types'

// POST /v1/campaigns/{id}/start
export const startCampaign = async (
	id: string
): Promise<ActionSuccessResponse> => {
	try {
		const { data } = await apiInstance.post<ActionSuccessResponse>(
			`/v1/campaigns/${id}/start`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /v1/campaigns/{id}/schedule
export const scheduleCampaign = async (
	id: string,
	payload: ScheduleCampaignRequest
): Promise<ActionSuccessResponse> => {
	try {
		const { data } = await apiInstance.post<ActionSuccessResponse>(
			`/v1/campaigns/${id}/schedule`,
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /v1/campaigns/{id}/retry-failed
export const retryFailed = async (id: string): Promise<RetryFailedResponse> => {
	try {
		const { data } = await apiInstance.post<RetryFailedResponse>(
			`/v1/campaigns/${id}/retry-failed`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /v1/campaigns/{id}/cancel
export const cancelCampaign = async (
	id: string
): Promise<ActionSuccessResponse> => {
	try {
		const { data } = await apiInstance.post<ActionSuccessResponse>(
			`/v1/campaigns/${id}/cancel`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /v1/campaigns/{id}/reopen
export const reopenCampaign = async (
	id: string
): Promise<ActionSuccessResponse> => {
	try {
		const { data } = await apiInstance.post<ActionSuccessResponse>(
			`/v1/campaigns/${id}/reopen`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
