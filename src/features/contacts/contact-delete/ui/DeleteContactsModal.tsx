import DeleteConfirmModal from '@/shared/ui/Modals/DeleteConfirmModal'

import { useBulkSoftDeleteContactsMutation } from '@/entities/contacts'

export type DeleteContactsModalProps = {
	isOpen: boolean
	onClose: () => void
	contactIds: string[]
	contactTitle?: string
	onDeleted?: () => void
}

export function DeleteContactsModal({
	isOpen,
	onClose,
	contactIds,
	contactTitle,
	onDeleted
}: DeleteContactsModalProps) {
	const mutation = useBulkSoftDeleteContactsMutation()

	const isSingle = contactIds.length === 1
	const title = isSingle
		? 'Вы уверены, что хотите удалить контакт?'
		: 'Вы уверены, что хотите удалить контакты?'
	const description = isSingle
		? `Контакт «${contactTitle || contactIds[0]}» будет перемещён в корзину.`
		: `Будут перемещены в корзину контакты: ${contactIds.length}`

	return (
		<DeleteConfirmModal
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			description={description}
			loading={mutation.isPending}
			onConfirm={() =>
				mutation.mutate({ contactIds } as any, {
					onSuccess: () => {
						onDeleted?.()
						onClose()
					}
				})
			}
		/>
	)
}

export default DeleteContactsModal
