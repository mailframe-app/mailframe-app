import { DeleteConfirmModal } from '@/shared/ui/Modals'

import { useDeleteGroups } from '../model/useDeleteGroups'

export type DeleteGroupsModalProps = {
	isOpen: boolean
	onClose: () => void
	groupIds: string[]
	groupName?: string
}

export function DeleteGroupsModal({
	isOpen,
	onClose,
	groupIds,
	groupName
}: DeleteGroupsModalProps) {
	const { deleteGroups, isPending } = useDeleteGroups()

	const title =
		groupIds.length === 1
			? 'Вы уверены, что хотите удалить выбранную группу?'
			: 'Вы уверены, что хотите удалить выбранные группы?'
	const description =
		groupIds.length === 1
			? `Это действие необратимо и приведет к потере всей статистики, связанной с группой`
			: `Это действие необратимо и приведет к потере всей статистики, связанной с группами. Будет удалено групп: ${groupIds.length}`

	return (
		<DeleteConfirmModal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			description={description}
			confirmLabel='Удалить'
			loading={isPending}
			onConfirm={async () => {
				await deleteGroups(groupIds, { name: groupName })
				onClose()
			}}
		/>
	)
}
