import { useQuery } from '@tanstack/react-query'

import type { ListCampaignsQuery, ListCampaignsResponse } from '../../api/types'
import { campaignsListQuery } from '../queries'

export function useCampaigns(params?: ListCampaignsQuery) {
	return useQuery<ListCampaignsResponse>(campaignsListQuery(params))
}
