import { useQuery } from '@tanstack/react-query'

import type {
	CampaignStatsResponse,
	GetCampaignStatsQuery
} from '../../api/types'
import { campaignStatsQuery } from '../queries'

export function useCampaignStats(id: string, params?: GetCampaignStatsQuery) {
	return useQuery<CampaignStatsResponse>(campaignStatsQuery(id, params))
}
