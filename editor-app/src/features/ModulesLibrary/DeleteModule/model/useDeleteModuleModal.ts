import { useCallback } from 'react'

import { modals } from '@/shared/lib/modals'

import { useReusableBlocksStore } from '@/entities/ReusableBlocks'

export const useDeleteModuleModal = () => {
	const { removeBlock } = useReusableBlocksStore()

	const openDeleteModal = useCallback(
		(moduleId: string, moduleName: string) => {
			modals.openDeleteModal({
				title: 'Удалить модуль',
				description: `Удалить модуль «${moduleName}»? Это действие нельзя будет отменить.`,
				onConfirm: () => removeBlock(moduleId),
				confirmLabel: 'Удалить',
				cancelLabel: 'Отмена'
			})
		},
		[removeBlock]
	)

	return { openDeleteModal }
}
