import { useCallback } from 'react'

import { showCustomToast } from '@/shared/lib/toaster'

import { useUpdateGroupMutation } from '@/entities/contacts'

export function useEditGroup() {
	const mutate = useUpdateGroupMutation()

	const update = useCallback(
		async (id: string, values: { name: string; description?: string }) => {
			try {
				const group: any = await mutate.mutateAsync({
					id,
					payload: values
				} as any)
				const displayName = group?.name || values.name
				showCustomToast({
					title: `Группа "${displayName}" успешно обновлена`,
					type: 'success'
				})
				return group
			} catch (e: any) {
				const msg = e?.message || 'Не удалось обновить группу'
				showCustomToast({
					title: msg,
					type: 'error'
				})
				throw e
			}
		},
		[mutate]
	)

	return { update, isPending: mutate.isPending }
}
