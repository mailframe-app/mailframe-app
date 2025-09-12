import { useState } from 'react'

import { useDeleteSmtpSettings } from '@/features/mail-settings/delete-smtp-settings'

import { useEditSmtpSettings } from '../model/use-edit-smtp-settings'

import { EditSmtpSettingsHeader } from './EditSmtpSettingsHeader'
import {
	SmtpSettingsCard,
	type SmtpSettingsResponse
} from '@/entities/mail-settings'

interface EditableSmtpSettingsCardProps {
	settings: SmtpSettingsResponse
	onTest: (id: string) => void
}

export const EditableSmtpSettingsCard = ({
	settings,
	onTest
}: EditableSmtpSettingsCardProps) => {
	const [isEditing, setIsEditing] = useState(false)
	const { openDeleteConfirm } = useDeleteSmtpSettings()

	const {
		formData,
		handleChange,
		handleSave,
		handleCancel,
		isDirty,
		isLoading
	} = useEditSmtpSettings(settings, isEditing, () => setIsEditing(false))

	// Обработчики для передачи в SmtpSettingsCard
	const handleEditToggle = () => setIsEditing(!isEditing)

	// Обработчик для передачи изменений из SmtpSettingsCard в модель
	const handleFieldChange = (field: string, value: any) => {
		handleChange(field, value)
	}

	// Обработчик удаления
	const handleDelete = () => {
		openDeleteConfirm(settings.id, settings.smtpFromName)
	}

	// Рендеринг заголовка в зависимости от режима
	const renderHeader = () => {
		if (isEditing) {
			return (
				<EditSmtpSettingsHeader
					isDirty={isDirty}
					isLoading={isLoading}
					onSave={handleSave}
					onCancel={handleCancel}
					onDelete={handleDelete}
				/>
			)
		}

		return null
	}

	// Объединяем данные настроек с данными формы для редактирования
	const displaySettings = isEditing ? { ...settings, ...formData } : settings

	return (
		<SmtpSettingsCard
			settings={displaySettings}
			onTest={onTest}
			onEditToggle={handleEditToggle}
			isEditing={isEditing}
			headerActions={renderHeader()}
			onFieldChange={handleFieldChange}
		/>
	)
}
