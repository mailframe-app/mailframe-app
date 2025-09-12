import React, { useMemo } from 'react'

import { showCustomToast } from '@/shared/lib/toaster'

import { FieldFormModal } from '../FieldForm'

import {
	useContactFields,
	useCreateField,
	useRefetchFields
} from '@/entities/contacts'

export type CreateFieldModalProps = {
	isOpen: boolean
	onClose: () => void
}

const CreateFieldModal: React.FC<CreateFieldModalProps> = ({
	isOpen,
	onClose
}) => {
	const { data: fieldsData } = useContactFields()
	const createMutation = useCreateField()
	const refetchFields = useRefetchFields()

	const initial = useMemo(
		() => ({
			id: 'new',
			name: '',
			key: '',
			fieldType: 'TEXT' as const,
			isRequired: false,
			isVisible: true,
			columnWidth: 150,
			isSystem: false
		}),
		[]
	)

	const handleSubmit = (payload: any) => {
		const key = String(payload.key || '').trim()
		const name = String(payload.name || '').trim()
		const type = String(payload.fieldType || 'TEXT')

		if (!name || !key) {
			showCustomToast({
				title: 'Ошибка',
				description: 'Укажите название и ключ поля',
				type: 'error'
			})
			return
		}

		// client-side uniqueness check among active fields
		const exists = (fieldsData?.fields || []).some(
			(f: any) => String(f.key).toLowerCase() === key.toLowerCase()
		)
		if (exists) {
			showCustomToast({
				title: 'Ошибка',
				description: `Поле с ключом "${key}" уже существует`,
				type: 'error'
			})
			return
		}

		// SELECT requires options
		if (type === 'SELECT') {
			const opts = payload?.fieldMetadata?.options || []
			if (!Array.isArray(opts) || opts.length === 0) {
				showCustomToast({
					title: 'Ошибка',
					description: 'Добавьте хотя бы одну опцию',
					type: 'error'
				})
				return
			}
		}

		const dto = {
			name: name,
			key: key,
			fieldType: type,
			isRequired: Boolean(payload.isRequired),
			isVisible:
				payload.isVisible === undefined ? true : Boolean(payload.isVisible),
			columnWidth: Number(payload.columnWidth ?? 150),
			fieldMetadata: payload.fieldMetadata
		}

		createMutation.mutate(dto as any, {
			onSuccess: async (res: any) => {
				showCustomToast({
					title: 'Успешно',
					description: res?.message ?? 'Поле создано',
					type: 'success'
				})
				await refetchFields()
				onClose()
			},
			onError: (e: any) => {
				const code = e?.response?.status
				if (code === 409) {
					showCustomToast({
						title: 'Ошибка',
						description: 'Поле с таким ключом уже существует',
						type: 'error'
					})
				} else {
					showCustomToast({
						title: 'Ошибка',
						description:
							e?.response?.data?.message ??
							e?.message ??
							'Ошибка создания поля',
						type: 'error'
					})
				}
			}
		})
	}

	return (
		<FieldFormModal
			isOpen={isOpen}
			onClose={onClose}
			loading={createMutation.isPending}
			initial={initial as any}
			onSubmit={handleSubmit}
			title='Создание поля'
			description='Заполните параметры нового поля и сохраните.'
		/>
	)
}

export default CreateFieldModal
