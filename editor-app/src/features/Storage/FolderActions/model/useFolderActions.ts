import { IconArrowRight } from '@consta/icons/IconArrowRight'
import { IconEdit } from '@consta/icons/IconEdit'
import { IconTrash } from '@consta/icons/IconTrash'
import { useCallback, useMemo, useRef, useState } from 'react'

export const useFolderActions = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const menuAnchorRef = useRef<HTMLButtonElement>(null)

	// Состояния для модальных окон
	const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
	const [isMoveModalOpen, setIsMoveModalOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

	const onMenuClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation()
		setIsMenuOpen(prev => !prev)
	}, [])

	const handleRenameClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation()
		setIsRenameModalOpen(true)
		setIsMenuOpen(false)
	}, [])

	const handleMoveClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation()
		setIsMoveModalOpen(true)
		setIsMenuOpen(false)
	}, [])

	const handleDeleteClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation()
		setIsDeleteModalOpen(true)
		setIsMenuOpen(false)
	}, [])

	const menuItems = useMemo(
		() => [
			{ label: 'Переименовать', onClick: handleRenameClick, leftIcon: IconEdit },
			{ label: 'Переместить', onClick: handleMoveClick, leftIcon: IconArrowRight },
			{
				label: 'Удалить',
				onClick: handleDeleteClick,
				status: 'alert' as const,
				leftIcon: IconTrash
			}
		],
		[handleRenameClick, handleMoveClick, handleDeleteClick]
	)

	return {
		isMenuOpen,
		menuAnchorRef,
		menuItems,
		isRenameModalOpen,
		isMoveModalOpen,
		isDeleteModalOpen,
		onMenuClick,
		setIsMenuOpen,
		setIsRenameModalOpen,
		setIsMoveModalOpen,
		setIsDeleteModalOpen
	}
}
