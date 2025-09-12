import {
	GroupForm,
	type GroupFormValues
} from '@/features/contacts-groups/shared/group-form'

import { useEditGroup } from '../model/useEditGroup'

export type EditGroupModalProps = {
	isOpen: boolean
	onClose: () => void
	groupId: string
	initial: { name: string; description?: string }
	onUpdated?: (group: any) => void
}

export function EditGroupModal({
	isOpen,
	onClose,
	groupId,
	initial,
	onUpdated
}: EditGroupModalProps) {
	const { update, isPending } = useEditGroup()

	const handleSubmit = async (values: GroupFormValues) => {
		const group = await update(groupId, values)
		onUpdated?.(group)
		onClose()
	}

	return (
		<GroupForm
			isOpen={isOpen}
			onClose={onClose}
			title='Редактировать группу'
			submitLabel='Сохранить'
			isSubmitting={isPending}
			initial={initial}
			onSubmit={handleSubmit}
		/>
	)
}
