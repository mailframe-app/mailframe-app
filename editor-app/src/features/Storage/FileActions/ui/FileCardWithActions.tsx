import { ContextMenu } from '@consta/uikit/ContextMenu'
import React from 'react'

import { useFileActions } from '../model/useFileActions'

import { DeleteConfirmationModal } from './DeleteConfirmationModal'
import { MoveItemModal } from './MoveItemModal'
import { PreviewFileModal } from './PreviewFileModal'
import { RenameFileModal } from './RenameFileModal'
import { FileCard, type StorageFile, useStorageStore } from '@/entities/Storage'

interface FileCardWithActionsProps {
	file: StorageFile
	onClick?: (file: StorageFile) => void
	onSelect?: (file: StorageFile) => void
	isSelected?: boolean
}

export const FileCardWithActions = ({
	file,
	onClick,
	onSelect,
	isSelected
}: FileCardWithActionsProps) => {
	const { isBulkMode, moveFile, deleteFile } = useStorageStore()
	const {
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
	} = useFileActions(file)

	const handleMove = async (targetFolderId: string | null) => {
		await moveFile(file.id, targetFolderId)
	}

	const handleDelete = () => {
		deleteFile(file.id)
	}

	return (
		<>
			<FileCard
				ref={menuAnchorRef}
				file={file}
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

			<RenameFileModal
				isOpen={isRenameModalOpen}
				fileId={file.id}
				fileName={file.name}
				onClose={() => setIsRenameModalOpen(false)}
			/>
			<MoveItemModal
				isOpen={isMoveModalOpen}
				itemName={file.name}
				onMove={handleMove}
				onClose={() => setIsMoveModalOpen(false)}
			/>
			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				itemName={file.name}
				onConfirm={handleDelete}
				onClose={() => setIsDeleteModalOpen(false)}
			/>

			{isPreviewModalOpen && (
				<PreviewFileModal
					isOpen={isPreviewModalOpen}
					file={file}
					onClose={() => setIsPreviewModalOpen(false)}
					onAdd={() => onClick?.(file)}
				/>
			)}
		</>
	)
}
