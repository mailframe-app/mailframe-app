import { useCallback } from 'react'

import { showCustomToast } from '@/shared/lib/toaster'

import { useCreateGroupMutation } from '@/entities/contacts'

export function useCreateGroup() {
	const mutate = useCreateGroupMutation()

	const create = useCallback(
		async (values: { name: string; description?: string }) => {
			try {
				const group: any = await mutate.mutateAsync(values as any)
				const displayName = group?.name || values.name
				showCustomToast({
					title: `Группа "${displayName}" создана`,
					type: 'success'
				})
				return group
			} catch (e: any) {
				const msg = e?.message || 'Не удалось создать группу'
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
