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
					title: `Успешно`,
					type: 'success',
					description: `Рассылка "${displayName}" создана`
				})
				return campaign
			} catch (e: any) {
				const msg = e?.message || 'Не удалось создать рассылку'
				showCustomToast({
					title: `Ошибка`,
					type: 'error',
					description: msg
				})
				throw e
			}
		},
		[mutate]
	)

	return { create, isPending: mutate.isPending }
}
