import { useEffect, useState } from 'react'

import { showCustomToast } from '@/shared/lib/toaster'

import {
	type ContactListItemDto,
	type UpdateContactDto,
	useBulkSoftDeleteContactsMutation,
	useUpdateContactMutation
} from '@/entities/contacts'

export const useContactRowEdit = (
	contact: ContactListItemDto,
	isEditing: boolean,
	onEditComplete: () => void,
	selectedGroups?: { id: string; name: string }[]
) => {
	// Состояние формы
	const [formData, setFormData] = useState<any>({})

	// Отслеживание изменений формы
	const [isDirty, setIsDirty] = useState(false)

	// Отслеживание изменений в группах
	const initialGroupIds = ((contact as any).groups || [])
		.map((g: any) => g.id)
		.sort()
	const currentGroupIds = (selectedGroups || []).map(g => g.id).sort()
	const groupsChanged =
		JSON.stringify(initialGroupIds) !== JSON.stringify(currentGroupIds)

	// Общий isDirty: изменения в форме ИЛИ в группах
	const isFormDirty = isDirty || groupsChanged

	// Получение функций мутации из сущности
	const updateMutation = useUpdateContactMutation()
	const deleteMutation = useBulkSoftDeleteContactsMutation()

	// Сброс формы при изменении исходного контакта или режима редактирования
	useEffect(() => {
		if (isEditing) {
			setFormData({
				email: contact.email,
				status: contact.status,
				// fields теперь Record<string, string> как в EditContactModal
				fields: {}
			})
			setIsDirty(false)
		}
	}, [contact, isEditing])

	// Обработчик изменения полей
	const handleChange = (field: string, value: any) => {
		setFormData((prev: any) => {
			const newData = { ...prev, [field]: value }
			return newData
		})
		setIsDirty(true)
	}

	// Сохранение изменений
	const handleSave = async () => {
		try {
			// Преобразуем fields в формат, который ожидает API (как в EditContactModal)
			const fieldsArray = Object.entries(formData.fields || {})
				.filter(([, v]) => typeof v === 'string')
				.map(([fieldKey, value]) => ({
					fieldKey,
					value: value as string
				}))

			const payload: UpdateContactDto = {
				email: formData.email,
				status: formData.status,
				fields: fieldsArray,
				groupIds: selectedGroups?.map(g => g.id)
			}

			await updateMutation.mutateAsync({
				id: contact.id,
				payload
			})

			showCustomToast({
				title: 'Контакт обновлен',
				description: 'Все изменения успешно сохранены',
				type: 'success'
			})

			onEditComplete()
		} catch (error) {
			console.error('Error updating contact:', error)
			showCustomToast({
				title: 'Ошибка сохранения',
				description: 'Не удалось сохранить изменения контакта',
				type: 'error'
			})
		}
	}

	// Отмена изменений
	const handleCancel = () => {
		setFormData({})
		setIsDirty(false)
		showCustomToast({
			title: 'Изменения отменены',
			description: 'Все несохраненные изменения отменены',
			type: 'info'
		})
		onEditComplete()
	}

	const handleDelete = async () => {
		try {
			await deleteMutation.mutateAsync({
				contactIds: [contact.id]
			})

			showCustomToast({
				title: 'Контакт удален',
				description: 'Контакт перемещен в корзину',
				type: 'success'
			})

			onEditComplete()
		} catch (error) {
			console.error('Error deleting contact:', error)
			showCustomToast({
				title: 'Ошибка удаления',
				description: 'Не удалось удалить контакт',
				type: 'error'
			})
		}
	}

	return {
		formData,
		handleChange,
		handleSave,
		handleCancel,
		handleDelete,
		isDirty: isFormDirty,
		isLoading: updateMutation.isPending || deleteMutation.isPending
	}
}
