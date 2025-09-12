import { IconArrowRight } from '@consta/icons/IconArrowRight'
import { IconTrash } from '@consta/icons/IconTrash'
import { useCallback, useMemo, useRef, useState } from 'react'

export const useTrashActions = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const menuAnchorRef = useRef<HTMLButtonElement>(null)

	// Состояния для модальных окон
	const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

	const onMenuClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation()
		setIsMenuOpen(prev => !prev)
	}, [])

	const handleRestoreClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation()
		setIsRestoreModalOpen(true)
		setIsMenuOpen(false)
	}, [])

	const handleDeleteClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation()
		setIsDeleteModalOpen(true)
		setIsMenuOpen(false)
	}, [])

	const menuItems = useMemo(
		() => [
			{ label: 'Восстановить', onClick: handleRestoreClick, leftIcon: IconArrowRight },
			{
				label: 'Удалить навсегда',
				onClick: handleDeleteClick,
				status: 'alert' as const,
				leftIcon: IconTrash
			}
		],
		[handleRestoreClick, handleDeleteClick]
	)

	return {
		isMenuOpen,
		menuAnchorRef,
		menuItems,
		isRestoreModalOpen,
		isDeleteModalOpen,
		onMenuClick,
		setIsMenuOpen,
		setIsRestoreModalOpen,
		setIsDeleteModalOpen
	}
}
