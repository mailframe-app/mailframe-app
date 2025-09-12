import { modals } from '@/shared/lib/modals'

import { useDeleteTemplate } from './useDeleteTemplate'

export const useDeleteTemplateModal = () => {
	const { handleDelete } = useDeleteTemplate()

	const openModal = () => {
		modals.openDeleteModal({
			title: 'Удаление шаблона',
			description: 'Вы уверены, что хотите удалить шаблон? Это действие необратимо.',
			onConfirm: handleDelete
		})
	}

	return {
		openModal
	}
}
