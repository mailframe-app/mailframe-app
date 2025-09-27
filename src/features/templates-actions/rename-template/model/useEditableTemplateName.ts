import { useCallback, useState } from 'react'

import { showCustomToast } from '@/shared/lib'

import { useUpdateTemplate } from '@/entities/templates'

interface UseEditableTemplateNameParams {
	templateId: string
	initialName: string
	onNameUpdate: (newName: string) => void
}

export function useEditableTemplateName({
	templateId,
	initialName,
	onNameUpdate
}: UseEditableTemplateNameParams) {
	const [isEditing, setIsEditing] = useState(false)
	const [localName, setLocalName] = useState(initialName)
	const updateTemplate = useUpdateTemplate()

	const startEditing = () => {
		setLocalName(initialName)
		setIsEditing(true)
	}

	const handleNameSubmit = useCallback(async () => {
		if (localName.trim() && localName !== initialName) {
			try {
				const updatedTemplate = await updateTemplate(templateId, {
					name: localName
				})
				showCustomToast({
					title: 'Успешно',
					description: 'Название шаблона обновлено',
					type: 'success'
				})
				onNameUpdate(updatedTemplate.name)
			} catch (error) {
				showCustomToast({
					title: 'Ошибка',
					description: 'Произошла ошибка при обновлении названия',
					type: 'error'
				})
				setLocalName(initialName) // Revert on error
			}
		}
		setIsEditing(false)
	}, [localName, initialName, templateId, updateTemplate, onNameUpdate])

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			if (event.key === 'Enter') {
				handleNameSubmit()
			} else if (event.key === 'Escape') {
				setLocalName(initialName)
				setIsEditing(false)
			}
		},
		[handleNameSubmit, initialName]
	)

	return {
		isEditing,
		localName,
		setLocalName,
		handleNameSubmit,
		handleKeyDown,
		startEditing
	}
}
