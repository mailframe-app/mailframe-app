import { useCallback } from 'react'

import { modals } from '@/shared/lib/modals'

import { TrashModalContent } from '../../ui/TrashModalContent'

export function useTrashModal() {
	const openTrashModal = useCallback(() => {
		const modalId = modals.openContent({
			title: 'Корзина контактов',
			description:
				'Здесь отображаются удаленные контакты, которые можно восстановить или удалить окончательно.',
			content: <TrashModalContent onClose={() => modals.close(modalId)} />,
			containerClassName: 'w-[800px] max-w-[80vw]',
			hasOverlay: true,
			closeButton: true
		})
	}, [])

	return { openTrashModal }
}
