import { useCallback } from 'react'

import { showCustomToast } from '@/shared/lib/toaster'

import { useCloneGroupMutation } from '@/entities/contacts'

export type CloneGroupParams = {
	id: string
	newName: string
	includeMembers?: boolean
	sourceName?: string
}

type CloneGroupResponse = {
	success?: boolean
	newGroupId?: string
	newGroupName?: string
	contactsCopied?: number
}

export function useCloneGroup() {
	const mutate = useCloneGroupMutation()

	const clone = useCallback(
		async ({
			id,
			newName,
			includeMembers = true,
			sourceName
		}: CloneGroupParams) => {
			try {
				const res = (await mutate.mutateAsync({
					id,
					payload: { newName, includeMembers }
				} as unknown as {
					id: string
					payload: { newName: string; includeMembers: boolean }
				})) as CloneGroupResponse
				const displaySource = sourceName ? `"${sourceName}"` : 'группа'
				const displayName = res?.newGroupName || newName
				const copied =
					typeof res?.contactsCopied === 'number'
						? res.contactsCopied
						: undefined
				const copiedPart =
					includeMembers && copied !== undefined
						? `, скопировано участников: ${copied}`
						: ''
				const ok = res?.success !== false
				const msg = `Группа ${displaySource} клонирована как "${displayName}"${copiedPart}`
				showCustomToast({
					title: msg,
					type: ok ? 'success' : 'error'
				})
				return res
			} catch (e) {
				const err = e as Error
				showCustomToast({
					title: err?.message || 'Не удалось клонировать группу',
					type: 'error'
				})
				throw e
			}
		},
		[mutate]
	)

	return { clone, isPending: mutate.isPending }
}
