import { useCallback } from 'react'

import { showCustomToast } from '@/shared/lib'

import { useCreateCampaignMutation } from '@/entities/campaigns'

export function useCreateCampaign() {
	const mutate = useCreateCampaignMutation()

	const create = useCallback(
		async (values: { name: string }) => {
			try {
				const campaign: any = await mutate.mutateAsync(values as any)
				const displayName = campaign?.name || values.name
				showCustomToast({
					title: `Рассылка "${displayName}" создана`,
					type: 'success'
				})
				return campaign
			} catch (e: any) {
				const msg = e?.message || 'Не удалось создать рассылку'
				showCustomToast({
					title: msg,
					type: 'error'
				})
				throw e
			}
		},
		[mutate]
	)

	return { create, isPending: mutate.isPending }
}
