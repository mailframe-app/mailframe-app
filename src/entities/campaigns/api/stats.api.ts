import { apiInstance, handleApiError } from '@/shared/api'

import type { CampaignStatsResponse, GetCampaignStatsQuery } from './types'

// GET /v1/campaigns/{id}/stats
export const getCampaignStats = async (
	id: string,
	params?: GetCampaignStatsQuery
): Promise<CampaignStatsResponse> => {
	try {
		const { data } = await apiInstance.get<CampaignStatsResponse>(
			`/v1/campaigns/${id}/stats`,
			{ params }
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
