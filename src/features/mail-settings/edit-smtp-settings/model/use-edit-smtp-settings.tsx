import { useEffect, useState } from 'react'

import {
	type SmtpSettingsDto,
	type SmtpSettingsResponse,
	useSmtpSettings
} from '@/entities/mail-settings'

export const useEditSmtpSettings = (
	settings: SmtpSettingsResponse,
	isEditing: boolean,
	onEditComplete: () => void
) => {
	// Состояние формы
	const [formData, setFormData] = useState<Partial<SmtpSettingsDto>>({})

	// Отслеживание изменений
	const [isDirty, setIsDirty] = useState(false)

	// Получение функции обновления из сущности
	const { updateSmtpSettings, isUpdating } = useSmtpSettings()

	// Сброс формы при изменении исходных настроек или режима редактирования
	useEffect(() => {
		if (isEditing) {
			setFormData({
				smtpHost: settings.smtpHost,
				smtpPort: settings.smtpPort,
				smtpSecure: settings.smtpSecure,
				smtpUser: settings.smtpUser,
				smtpPassword: '',
				smtpFromEmail: settings.smtpFromEmail,
				smtpFromName: settings.smtpFromName,
				isDefault: settings.isDefault
			})
			setIsDirty(false)
		}
	}, [settings, isEditing])

	// Обработчик изменения полей
	const handleChange = (field: string, value: any) => {
		setFormData(prev => {
			const newData = { ...prev, [field]: value }
			return newData
		})
		setIsDirty(true)
	}

	// Сохранение изменений
	const handleSave = async () => {
		try {
			// Если пароль пустой, не отправляем его
			const dataToSend = { ...formData } as SmtpSettingsDto
			if (!dataToSend.smtpPassword) {
				delete dataToSend.smtpPassword
			}

			await updateSmtpSettings(settings.id, dataToSend)
			onEditComplete()
		} catch (error) {
			console.error('Error updating SMTP settings:', error)
		}
	}

	// Отмена изменений
	const handleCancel = () => {
		setFormData({})
		setIsDirty(false)
		onEditComplete()
	}

	return {
		formData,
		handleChange,
		handleSave,
		handleCancel,
		isDirty,
		isLoading: isUpdating
	}
}
