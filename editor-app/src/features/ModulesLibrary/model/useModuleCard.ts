import { useFlag } from '@consta/uikit/useFlag'
import { useCallback, useRef, useState } from 'react'

import { useDeleteModuleModal } from '../DeleteModule'
import { useEditModuleModal } from '../EditModule'

import type { Module } from './types'
import { useReusableBlocksStore } from '@/entities/ReusableBlocks'

interface UseModuleCardProps {
	module: Module
}

export const useModuleCard = ({ module }: UseModuleCardProps) => {
	const [isHovered, { on, off }] = useFlag(false)
	const { toggleFavoriteBlock } = useReusableBlocksStore()
	const { openDeleteModal } = useDeleteModuleModal()
	const { openEditModal } = useEditModuleModal()

	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const menuAnchorRef = useRef<HTMLButtonElement>(null)

	const handleFavoriteClick = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation()
			toggleFavoriteBlock(module.id)
			setIsMenuOpen(false)
		},
		[module.id, toggleFavoriteBlock]
	)

	const handleEditClick = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation()
			setIsMenuOpen(false)
			openEditModal(module)
		},
		[module, openEditModal]
	)

	const handleDeleteClick = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation()
			setIsMenuOpen(false)
			openDeleteModal(module.id, module.name)
		},
		[module.id, module.name, openDeleteModal]
	)

	return {
		isHovered,
		isMenuOpen,
		menuAnchorRef,
		on,
		off,
		setIsMenuOpen,
		handleFavoriteClick,
		handleEditClick,
		handleDeleteClick
	}
}
