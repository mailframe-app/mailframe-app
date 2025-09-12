import { apiInstance, handleApiError } from '@/shared/api'

import type { GetCampaignLogsQuery, GetCampaignLogsResponse } from './types'

// GET /v1/campaigns/{id}/logs
export const getCampaignLogs = async (
	id: string,
	params?: GetCampaignLogsQuery
): Promise<GetCampaignLogsResponse> => {
	try {
		const { data } = await apiInstance.get<GetCampaignLogsResponse>(
			`/v1/campaigns/${id}/logs`,
			{ params }
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
