import { IconArrowRight } from '@consta/icons/IconArrowRight'
import { IconEdit } from '@consta/icons/IconEdit'
import { IconEye } from '@consta/icons/IconEye'
import { IconFavoriteFilled } from '@consta/icons/IconFavoriteFilled'
import { IconFavoriteStroked } from '@consta/icons/IconFavoriteStroked'
import { IconTrash } from '@consta/icons/IconTrash'
import { useCallback, useMemo, useRef, useState } from 'react'

import type { StorageFile } from '@/entities/Storage'
import { useStorageStore } from '@/entities/Storage'

export const useFileActions = (file: StorageFile) => {
	const { toggleFavorite } = useStorageStore()
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const menuAnchorRef = useRef<HTMLButtonElement>(null)

	// Состояния для модальных окон
	const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
	const [isMoveModalOpen, setIsMoveModalOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)

	const onMenuClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation()
		setIsMenuOpen(prev => !prev)
	}, [])

	const handleFavoriteClick = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation()
			toggleFavorite(file.id, !file.isFavorite)
			setIsMenuOpen(false)
		},
		[file.id, file.isFavorite, toggleFavorite]
	)

	const handlePreviewClick = useCallback((e: React.MouseEvent) => {
		e.stopPropagation()
		setIsPreviewModalOpen(true)
		setIsMenuOpen(false)
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
			{
				label: 'Просмотр',
				onClick: handlePreviewClick,
				leftIcon: IconEye
			},
			{
				label: file.isFavorite ? 'Убрать из избранного' : 'В избранное',
				onClick: handleFavoriteClick,
				leftIcon: file.isFavorite ? IconFavoriteFilled : IconFavoriteStroked
			},
			{ label: 'Переименовать', onClick: handleRenameClick, leftIcon: IconEdit },
			{ label: 'Переместить', onClick: handleMoveClick, leftIcon: IconArrowRight },
			{
				label: 'Удалить',
				onClick: handleDeleteClick,
				status: 'alert' as const,
				leftIcon: IconTrash
			}
		],
		[
			file.isFavorite,
			handlePreviewClick,
			handleFavoriteClick,
			handleRenameClick,
			handleMoveClick,
			handleDeleteClick
		]
	)

	return {
		isMenuOpen,
		menuAnchorRef,
		menuItems,
		isRenameModalOpen,
		isMoveModalOpen,
		isDeleteModalOpen,
		isPreviewModalOpen,
		onMenuClick,
		setIsMenuOpen,
		setIsRenameModalOpen,
		setIsMoveModalOpen,
		setIsDeleteModalOpen,
		setIsPreviewModalOpen
	}
}
