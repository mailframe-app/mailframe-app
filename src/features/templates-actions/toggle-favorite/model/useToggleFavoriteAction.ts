import { showCustomToast } from '@/shared/lib'

import { useToggleFavorite } from '@/entities/templates'

export function useToggleFavoriteAction() {
	const toggleFavorite = useToggleFavorite()

	const handleToggleFavorite = async (templateId: string) => {
		try {
			const data = await toggleFavorite(templateId)
			showCustomToast({
				description: data.isFavorite
					? 'Шаблон добавлен в избранное'
					: 'Шаблон был удален из избранного',
				title: 'Успешно',
				type: 'success'
			})
		} catch (error) {
			showCustomToast({
				title: 'Ошибка',
				description: 'Произошла ошибка при изменении статуса избранного.',
				type: 'error'
			})
		}
	}

	return { handleToggleFavorite }
}
