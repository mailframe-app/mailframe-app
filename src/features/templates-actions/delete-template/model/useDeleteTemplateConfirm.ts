import { useCallback } from 'react'

import { modals } from '@/shared/lib/modals'

import { type TemplateListItem, useDeleteTemplate } from '@/entities/templates'

export function useDeleteTemplateConfirm(): {
	openDeleteConfirm: (template: TemplateListItem) => void
} {
	const deleteTemplate = useDeleteTemplate()

	const openDeleteConfirm = useCallback(
		(template: TemplateListItem) => {
			modals.openDeleteModal({
				title: 'Удаление шаблона',
				description: `Вы уверены, что хотите удалить шаблон "${template.name}"? Это действие необратимо.`,
				onConfirm: () => deleteTemplate(template.id)
			})
		},
		[deleteTemplate]
	)

	return { openDeleteConfirm }
}
