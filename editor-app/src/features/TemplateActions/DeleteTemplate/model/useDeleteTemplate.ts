import { useState } from 'react'

import { deleteTemplate } from '@/features/TemplateActions/api'

import { showCustomToast } from '@/shared/lib'

import { useEditorTemplateStore } from '@/entities/EditorTemplate'

export const useDeleteTemplate = () => {
	const { template } = useEditorTemplateStore()
	const [isLoading, setIsLoading] = useState(false)

	const handleDelete = async () => {
		if (!template?.id) {
			showCustomToast({ description: 'ID шаблона не найден.', type: 'error', title: 'Ошибка' })
			return
		}

		setIsLoading(true)

		try {
			await deleteTemplate(template.id)
			showCustomToast({ title: 'Шаблон успешно удален!', type: 'success' })
			window.location.href = '/templates'
		} catch {
			showCustomToast({
				description: 'Произошла ошибка при удалении шаблона.',
				type: 'error',
				title: 'Ошибка'
			})
		} finally {
			setIsLoading(false)
		}
	}

	return {
		isLoading,
		handleDelete
	}
}
