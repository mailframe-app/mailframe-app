import { useCallback } from 'react'

import { modals, showCustomToast } from '@/shared/lib'

import {
	type CampaignListItem,
	useReopenCampaignMutation
} from '@/entities/campaigns'

export function useReopenCampaignConfirm() {
	const reopenCampaignMutation = useReopenCampaignMutation()

	const openReopenConfirm = useCallback(
		(campaign: CampaignListItem) => {
			modals.openConfirm({
				title: 'Восстановить рассылку',
				description: `Вы уверены, что хотите восстановить рассылку "${campaign.name}"? Она будет переведена в статус "Черновик".`,
				confirmLabel: 'Восстановить',
				onConfirm: async () => {
					try {
						await reopenCampaignMutation.mutateAsync({
							id: campaign.id
						})
						showCustomToast({
							title: `Рассылка "${campaign.name}" успешно восстановлена`,
							type: 'success'
						})
					} catch (error) {
						showCustomToast({
							title: 'Ошибка при восстановлении рассылки',
							type: 'error'
						})
					}
				}
			})
		},
		[reopenCampaignMutation]
	)

	return {
		openReopenConfirm,
		isPending: reopenCampaignMutation.isPending
	}
}
