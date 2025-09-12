import { useState } from 'react'

import { duplicateTemplate } from '@/features/TemplateActions/api'

import { showCustomToast } from '@/shared/lib'

import { useEditorTemplateStore } from '@/entities/EditorTemplate'

export const useDuplicateTemplate = () => {
	const { template } = useEditorTemplateStore()
	const [isLoading, setIsLoading] = useState(false)

	const handleDuplicate = async (): Promise<string | null> => {
		if (!template?.id) {
			showCustomToast({ description: 'ID шаблона не найден.', type: 'error', title: 'Ошибка' })
			return null
		}

		setIsLoading(true)

		try {
			const newTemplate = await duplicateTemplate(template.id)
			if (newTemplate && newTemplate.id) {
				showCustomToast({ title: 'Шаблон успешно скопирован!', type: 'success' })
				return newTemplate.id
			}
			showCustomToast({
				description: 'Не удалось получить ID нового шаблона.',
				type: 'error',
				title: 'Ошибка'
			})
			return null
		} catch {
			showCustomToast({
				description: 'Произошла ошибка при копировании шаблона.',
				type: 'error',
				title: 'Ошибка'
			})
			return null
		} finally {
			setIsLoading(false)
		}
	}

	return {
		isLoading,
		handleDuplicate
	}
}
