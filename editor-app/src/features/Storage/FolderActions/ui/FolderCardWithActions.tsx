import { ContextMenu } from '@consta/uikit/ContextMenu'
import React from 'react'

import { DeleteConfirmationModal } from '../../FileActions/ui/DeleteConfirmationModal'
import { MoveItemModal } from '../../FileActions/ui/MoveItemModal'
import { useFolderActions } from '../model/useFolderActions'

import { RenameFolderModal } from './RenameFolderModal'
import { FolderCard, type StorageFolder, useStorageStore } from '@/entities/Storage'

interface FolderCardWithActionsProps {
	folder: StorageFolder
	onClick?: (folder: StorageFolder) => void
	onSelect?: (folder: StorageFolder) => void
	isSelected?: boolean
}

export const FolderCardWithActions = ({
	folder,
	onClick,
	onSelect,
	isSelected
}: FolderCardWithActionsProps) => {
	const { isBulkMode, moveFolder, deleteFolder } = useStorageStore()
	const {
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
	} = useFolderActions()

	const handleMove = async (targetFolderId: string | null) => {
		await moveFolder(folder.id, targetFolderId)
	}

	const handleDelete = () => {
		deleteFolder(folder.id)
	}

	return (
		<>
			<FolderCard
				ref={menuAnchorRef}
				folder={folder}
				onClick={onClick}
				onSelect={onSelect}
				isSelected={isSelected}
				isBulkMode={isBulkMode}
				onMenuClick={onMenuClick}
				menu={
					<ContextMenu
						isOpen={isMenuOpen}
						items={menuItems}
						getItemLabel={item => item.label}
						getItemStatus={item => item.status}
						getItemLeftIcon={item => item.leftIcon}
						onItemClick={(item, { e }) => item.onClick(e)}
						anchorRef={menuAnchorRef as React.RefObject<HTMLElement>}
						onClickOutside={() => setIsMenuOpen(false)}
						size='s'
					/>
				}
			/>

			<RenameFolderModal
				isOpen={isRenameModalOpen}
				folderId={folder.id}
				folderName={folder.name}
				onClose={() => setIsRenameModalOpen(false)}
			/>
			<MoveItemModal
				isOpen={isMoveModalOpen}
				itemName={folder.name}
				itemType='папку'
				onMove={handleMove}
				onClose={() => setIsMoveModalOpen(false)}
			/>
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				itemName={folder.name}
				itemType='папку'
				onConfirm={handleDelete}
				onClose={() => setIsDeleteModalOpen(false)}
			/>
		</>
	)
}
