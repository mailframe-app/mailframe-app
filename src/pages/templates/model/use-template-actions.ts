import { IconCopy } from '@consta/icons/IconCopy'
import { IconEye } from '@consta/icons/IconEye'
import { IconFavoriteFilled } from '@consta/icons/IconFavoriteFilled'
import { IconFavoriteStroked } from '@consta/icons/IconFavoriteStroked'
import { IconOpenInNew } from '@consta/icons/IconOpenInNew'
import { IconTrash } from '@consta/icons/IconTrash'
import { useMemo } from 'react'

import { useDeleteTemplateConfirm } from '@/features/templates-actions/delete-template'
import { useDuplicateTemplateAction } from '@/features/templates-actions/duplicate-template'
import { useOpenTemplateAction } from '@/features/templates-actions/open-template'
import { usePreviewTemplate } from '@/features/templates-actions/preview-template'
import { useToggleFavoriteAction } from '@/features/templates-actions/toggle-favorite'

import type { TemplateListItem } from '@/entities/templates'
import { buildItems } from '@/widgets/contextMenu'

export function useTemplateActions(
	template: TemplateListItem,
	tabId: 'library' | 'my-templates'
) {
	const { openDeleteConfirm } = useDeleteTemplateConfirm()
	const { handleDuplicate } = useDuplicateTemplateAction()
	const { handleToggleFavorite } = useToggleFavoriteAction()
	const { handleOpen } = useOpenTemplateAction()
	const { openPreview } = usePreviewTemplate()

	const menuItems = useMemo(() => {
		const favoriteItem = template.isFavorite
			? {
					key: 'unfavorite',
					label: 'Убрать из избранного',
					leftIcon: IconFavoriteStroked,
					onClick: () => handleToggleFavorite(template.id)
				}
			: {
					key: 'favorite',
					label: 'Добавить в избранное',
					leftIcon: IconFavoriteFilled,
					onClick: () => handleToggleFavorite(template.id)
				}

		const myTemplatesItems =
			tabId === 'my-templates'
				? [
						{
							key: 'copy',
							label: 'Копировать',
							leftIcon: IconCopy,
							onClick: () => handleDuplicate(template.id)
						},
						{
							key: 'delete',
							label: 'Удалить',
							leftIcon: IconTrash,
							status: 'alert',
							onClick: () => openDeleteConfirm(template)
						}
					]
				: []

		const baseItems = [
			{
				key: 'open',
				label: 'Открыть',
				leftIcon: IconOpenInNew,
				onClick: () => handleOpen(template)
			},
			{
				key: 'preview',
				label: 'Просмотр',
				leftIcon: IconEye,
				onClick: () => openPreview(template)
			}
		]

		return buildItems(template, [
			...baseItems,
			favoriteItem,
			...myTemplatesItems
		])
	}, [
		tabId,
		template,
		openDeleteConfirm,
		handleDuplicate,
		handleToggleFavorite,
		handleOpen,
		openPreview
	])

	return menuItems
}
