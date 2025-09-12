import React from 'react'

import { showCustomToast } from '@/shared/lib/toaster'

import { FieldFormModal } from '../FieldForm'

import type { ContactFieldDefinitionDto } from '@/entities/contacts'
import { useRefetchFields, useUpdateField } from '@/entities/contacts'

export type FieldEditModalProps = {
	isOpen: boolean
	onClose: () => void
	loading?: boolean
	initial: ContactFieldDefinitionDto
}

const FieldEditModal: React.FC<FieldEditModalProps> = ({
	isOpen,
	onClose,
	initial
}) => {
	const updateMutation = useUpdateField()
	const refetchFields = useRefetchFields()

	const handleSubmit = (payload: any) => {
		updateMutation.mutate(
			{ id: initial.id, dto: payload },
			{
				onSuccess: async (res: any) => {
					const msg =
						res?.message ??
						res?.data?.message ??
						`Поле ${initial?.name} обновлено`
					showCustomToast({
						title: 'Успешно',
						description: msg,
						type: 'success'
					})
					await refetchFields()
					onClose()
				},
				onError: (e: any) =>
					showCustomToast({
						title: 'Ошибка',
						description:
							e?.response?.data?.message ?? e?.message ?? 'Ошибка обновления',
						type: 'error'
					})
			}
		)
	}

	return (
		<FieldFormModal
			isOpen={isOpen}
			onClose={onClose}
			loading={updateMutation.isPending}
			title='Редактирование поля'
			description={`Измените параметры поля "${initial?.name}" и сохраните изменения.`}
			initial={initial as any}
			onSubmit={handleSubmit}
			confirmLabel='Сохранить'
			cancelLabel='Отмена'
		/>
	)
}

export default FieldEditModal
