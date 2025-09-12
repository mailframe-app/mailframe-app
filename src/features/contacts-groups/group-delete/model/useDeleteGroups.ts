import { useCallback } from 'react'

import { showCustomToast } from '@/shared/lib/toaster'

import {
	useBulkDeleteGroupsMutation,
	useDeleteGroupMutation
} from '@/entities/contacts'

export function useDeleteGroups() {
	const bulk = useBulkDeleteGroupsMutation()
	const single = useDeleteGroupMutation()

	const isPending = bulk.isPending || single.isPending

	const deleteGroups = useCallback(
		async (ids: string[], options?: { name?: string }) => {
			if (!ids || ids.length === 0) return
			try {
				if (ids.length === 1) {
					await single.mutateAsync(ids[0])
					const postfix = options?.name ? ` "${options.name}"` : ''
					showCustomToast({
						title: `Группа${postfix} успешно удалена`,
						type: 'success'
					})
				} else {
					const res: any = await bulk.mutateAsync({ groupIds: ids })
					const processed = Number(res?.processed ?? 0)
					const failed = Number(res?.failed ?? 0)
					const errors: string[] = Array.isArray(res?.errors) ? res.errors : []

					const head = `Удаление групп завершено. Успешно: ${processed} ${failed > 0 ? `, ошибок: ${failed}` : ''}`
					let details = ''
					if (errors.length) {
						const preview = errors.slice(0, 3).join('\n')
						const more =
							errors.length > 3 ? `\n…и ещё ${errors.length - 3}` : ''
						details = `${preview}${more}`
					}
					showCustomToast({
						title: head,
						description: details || undefined,
						type: failed > 0 ? 'error' : 'success'
					})
				}
			} catch (e: any) {
				showCustomToast({
					title: e?.message || 'Не удалось удалить группу(и)',
					type: 'error'
				})
				throw e
			}
		},
		[bulk, single]
	)

	return { deleteGroups, isPending }
}
