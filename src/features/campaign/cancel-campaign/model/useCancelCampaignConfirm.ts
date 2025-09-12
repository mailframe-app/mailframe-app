import { useCallback } from 'react'

import { modals, showCustomToast } from '@/shared/lib'

import {
	type CampaignListItem,
	useCancelCampaignMutation
} from '@/entities/campaigns'

export function useCancelCampaignConfirm() {
	const cancelCampaignMutation = useCancelCampaignMutation()

	const openCancelConfirm = useCallback(
		(campaign: CampaignListItem) => {
			modals.openConfirm({
				title: 'Отмена рассылки',
				description: `Вы уверены, что хотите отменить рассылку "${campaign.name}"?`,
				confirmLabel: 'Отменить',
				onConfirm: async () => {
					try {
						await cancelCampaignMutation.mutateAsync({
							id: campaign.id
						})
						showCustomToast({
							title: `Рассылка "${campaign.name}" успешно отменена`,
							type: 'success'
						})
					} catch (error) {
						showCustomToast({
							title: 'Ошибка при отмене рассылки',
							type: 'error'
						})
					}
				}
			})
		},
		[cancelCampaignMutation]
	)

	return {
		openCancelConfirm,
		isPending: cancelCampaignMutation.isPending
	}
}
