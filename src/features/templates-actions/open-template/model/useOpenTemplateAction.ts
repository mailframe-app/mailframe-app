import { CONFIG, showCustomToast } from '@/shared/lib'

import {
	type TemplateListItem,
	useDuplicateTemplate
} from '@/entities/templates'

export function useOpenTemplateAction() {
	const duplicateTemplate = useDuplicateTemplate()

	const getEditorUrl = (templateId: string) => {
		if (import.meta.env.DEV) {
			return `${CONFIG.EDITOR_URL}/editor/${templateId}`
		}
		return `/editor/${templateId}`
	}

	const handleOpen = async (template: TemplateListItem) => {
		if (template.isSystem) {
			try {
				const newTemplate = await duplicateTemplate(template.id)
				window.location.href = getEditorUrl(newTemplate.id)
			} catch (error) {
				showCustomToast({
					title:
						'Не удалось создать копию системного шаблона. Попробуйте еще раз.',
					type: 'error'
				})
			}
		} else {
			window.location.href = getEditorUrl(template.id)
		}
	}

	return { handleOpen }
}
