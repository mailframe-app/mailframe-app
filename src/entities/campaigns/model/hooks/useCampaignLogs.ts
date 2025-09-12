import { useQuery } from '@tanstack/react-query'

import type {
	GetCampaignLogsQuery,
	GetCampaignLogsResponse
} from '../../api/types'
import { campaignLogsQuery } from '../queries'

export function useCampaignLogs(id: string, params?: GetCampaignLogsQuery) {
	return useQuery<GetCampaignLogsResponse>(campaignLogsQuery(id, params))
}
