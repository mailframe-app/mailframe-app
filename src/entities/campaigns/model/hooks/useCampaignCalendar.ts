import { useQuery } from '@tanstack/react-query'

import type {
	CampaignCalendarResponse,
	GetCampaignCalendarQuery
} from '../../api/types'
import { campaignCalendarQuery } from '../queries'

export function useCampaignCalendar(params: GetCampaignCalendarQuery) {
	return useQuery<CampaignCalendarResponse>(campaignCalendarQuery(params))
}
