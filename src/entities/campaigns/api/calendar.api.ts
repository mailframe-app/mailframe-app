import { apiInstance, handleApiError } from '@/shared/api'

import type {
	CampaignCalendarResponse,
	GetCampaignCalendarQuery
} from './types'

// GET /v1/campaigns/calendar
export const getCampaignCalendar = async (
	params: GetCampaignCalendarQuery
): Promise<CampaignCalendarResponse> => {
	try {
		const { data } = await apiInstance.get<CampaignCalendarResponse>(
			`/v1/campaigns/calendar`,
			{ params }
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
