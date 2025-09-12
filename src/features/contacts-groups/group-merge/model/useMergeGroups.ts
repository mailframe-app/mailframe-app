import { useCallback } from 'react'

import { showCustomToast } from '@/shared/lib/toaster'

import { useMergeGroupsMutation } from '@/entities/contacts'

export type MergeGroupsParams = {
	targetId: string
	sourceIds: string[]
	deleteSources: boolean
}

export function useMergeGroups() {
	const mutate = useMergeGroupsMutation()

	const merge = useCallback(
		async ({ targetId, sourceIds, deleteSources }: MergeGroupsParams) => {
			try {
				const res = await mutate.mutateAsync({
					sourceGroupIds: sourceIds,
					targetGroupId: targetId,
					deleteSourceGroups: deleteSources
				})

				const processed: number = Number(res?.processed ?? 0)
				const failed: number = Number(res?.failed ?? 0)
				const errors: readonly string[] = Array.isArray(res?.errors)
					? res.errors
					: []

				const head = `Объединение групп завершено. Контактов в новой группе: ${processed} ${failed > 0 ? `, ошибок: ${failed}` : ''}`
				const preview = errors.slice(0, 3).join('\n')
				const more = errors.length > 3 ? `\n…и ещё ${errors.length - 3}` : ''
				const details = errors.length ? `\n${preview}${more}` : ''
				const msg = `${head}${details}`

				showCustomToast({
					title: msg,
					type: failed > 0 ? 'error' : 'success'
				})
				return res
			} catch (e) {
				const err = e as Error
				showCustomToast({
					title: err?.message || 'Не удалось объединить группы',
					type: 'error'
				})
				throw e
			}
		},
		[mutate]
	)

	return { merge, isPending: mutate.isPending }
}
