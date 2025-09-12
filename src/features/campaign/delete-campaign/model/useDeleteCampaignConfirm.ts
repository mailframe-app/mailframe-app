import { useCallback } from 'react'

import { modals } from '@/shared/lib/modals'

import {
	type CampaignListItem,
	type CampaignResponse,
	useDeleteCampaignMutation
} from '@/entities/campaigns'

export function useDeleteCampaignConfirm(options?: {
	onSuccess?: () => void
}): {
	openDeleteConfirm: (campaign: CampaignResponse | CampaignListItem) => void
} {
	const deleteCampaignMutation = useDeleteCampaignMutation()

	const openDeleteConfirm = useCallback(
		(campaign: CampaignResponse | CampaignListItem) => {
			modals.openDeleteModal({
				title: 'Удаление рассылки',
				description: `Вы уверены, что хотите удалить рассылку "${campaign.name}"?`,
				onConfirm: async () => {
					await deleteCampaignMutation.mutateAsync({
						id: campaign.id,
						name: campaign.name
					})
					options?.onSuccess?.()
				}
			})
		},
		[deleteCampaignMutation, options]
	)

	return { openDeleteConfirm }
}
