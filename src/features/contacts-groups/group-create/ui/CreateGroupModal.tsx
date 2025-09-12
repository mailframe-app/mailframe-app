import {
	GroupForm,
	type GroupFormValues
} from '@/features/contacts-groups/shared/group-form'

import { useCreateGroup } from '../model/useCreateGroup'

export type CreateGroupModalProps = {
	isOpen: boolean
	onClose: () => void
	onCreated?: (group: any) => void
}

export function CreateGroupModal({
	isOpen,
	onClose,
	onCreated
}: CreateGroupModalProps) {
	const { create, isPending } = useCreateGroup()

	const handleSubmit = async (values: GroupFormValues) => {
		const group = await create(values)
		onCreated?.(group)
		onClose()
	}

	return (
		<GroupForm
			isOpen={isOpen}
			onClose={onClose}
			title='Создать группу'
			submitLabel='Создать'
			isSubmitting={isPending}
			onSubmit={handleSubmit}
		/>
	)
}
