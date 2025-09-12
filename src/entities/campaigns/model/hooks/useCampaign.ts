import { useQuery } from '@tanstack/react-query'

import type { CampaignResponse } from '../../api/types'
import { campaignDetailQuery } from '../queries'

export function useCampaign(id: string) {
	return useQuery<CampaignResponse>(campaignDetailQuery(id))
}
