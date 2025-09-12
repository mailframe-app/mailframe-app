import { CONFIG, showCustomToast } from '@/shared/lib'

import { useCreateTemplate } from '@/entities/templates'

export function useCreateTemplateAction() {
	const createTemplate = useCreateTemplate()

	const getEditorUrl = (templateId: string) => {
		if (import.meta.env.DEV) {
			return `${CONFIG.EDITOR_URL}/editor/${templateId}`
		}
		return `/editor/${templateId}`
	}

	const handleCreate = async () => {
		try {
			const newTemplate = await createTemplate({
				name: 'Новый шаблон'
			})
			window.location.href = getEditorUrl(newTemplate.id)
		} catch (error) {
			showCustomToast({
				title: 'Произошла ошибка при создании шаблона.',
				type: 'error'
			})
		}
	}

	return { handleCreate }
}
