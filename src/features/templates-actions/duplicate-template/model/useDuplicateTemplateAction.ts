import { showCustomToast } from '@/shared/lib'

import { useDuplicateTemplate } from '@/entities/templates'

export function useDuplicateTemplateAction() {
	const duplicateTemplate = useDuplicateTemplate()

	const handleDuplicate = async (templateId: string) => {
		try {
			await duplicateTemplate(templateId)
			showCustomToast({
				title: 'Шаблон успешно скопирован!',
				type: 'success'
			})
		} catch (error) {
			showCustomToast({
				title: 'Произошла ошибка при копировании шаблона.',
				type: 'error'
			})
		}
	}

	return { handleDuplicate }
}
