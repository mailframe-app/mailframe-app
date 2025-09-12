import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { showCustomToast } from '@/shared/lib'

import {
	type CampaignListItem,
	campaignDetailQuery,
	useCreateCampaignMutation
} from '@/entities/campaigns'

export function useCopyCampaign() {
	const createCampaignMutation = useCreateCampaignMutation()
	const queryClient = useQueryClient()
	const navigate = useNavigate()

	const copyCampaign = useCallback(
		async (campaign: CampaignListItem) => {
			if (createCampaignMutation.isPending) return
			try {
				const campaignToCopy = await queryClient.fetchQuery(
					campaignDetailQuery(campaign.id)
				)

				const { contactGroupId, smtpSettingsId, subject, templateId, name } =
					campaignToCopy

				const newCampaign = await createCampaignMutation.mutateAsync({
					contactGroupId: contactGroupId || undefined,
					smtpSettingsId: smtpSettingsId || undefined,
					subject: subject || undefined,
					templateId: templateId || undefined,
					name: `${name} (копия)`
				})

				showCustomToast({
					title: `Рассылка "${name}" успешно скопирована`,
					type: 'success'
				})

				navigate(`/campaigns/${newCampaign.id}/edit`)
			} catch (error) {
				showCustomToast({
					title: 'Ошибка при копировании рассылки',
					type: 'error'
				})
			}
		},
		[createCampaignMutation, queryClient, navigate]
	)

	return {
		copyCampaign,
		isPending: createCampaignMutation.isPending
	}
}
