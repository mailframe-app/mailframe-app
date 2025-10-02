import { showCustomToast } from '@/shared/lib'

import { useDuplicateTemplate } from '@/entities/templates'

export function useDuplicateTemplateAction() {
	const duplicateTemplate = useDuplicateTemplate()

	const handleDuplicate = async (templateId: string) => {
		try {
			await duplicateTemplate(templateId)
			showCustomToast({
				description: 'Шаблон успешно скопирован!',
				title: 'Успешно',
				type: 'success'
			})
		} catch (error) {
			showCustomToast({
				title: 'Ошибка',
				description: 'Произошла ошибка при копировании шаблона.',
				type: 'error'
			})
		}
	}

	return { handleDuplicate }
}
