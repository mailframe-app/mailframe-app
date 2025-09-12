import { ContextMenu } from '@consta/uikit/ContextMenu'
import React from 'react'

import { useTrashActions } from '../model/useTrashActions'

import { PermanentDeleteModal } from './PermanentDeleteModal'
import { RestoreFileModal } from './RestoreFileModal'
import { FileCard, type StorageFile, useStorageStore } from '@/entities/Storage'

interface TrashFileCardWithActionsProps {
	file: StorageFile
	onClick?: (file: StorageFile) => void
	onSelect?: (file: StorageFile) => void
	isSelected?: boolean
}

export const TrashFileCardWithActions = ({
	file,
	onClick,
	onSelect,
	isSelected
}: TrashFileCardWithActionsProps) => {
	const { isBulkMode } = useStorageStore()
	const {
		isMenuOpen,
		menuAnchorRef,
		menuItems,
		isRestoreModalOpen,
		isDeleteModalOpen,
		onMenuClick,
		setIsMenuOpen,
		setIsRestoreModalOpen,
		setIsDeleteModalOpen
	} = useTrashActions()

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

			<RestoreFileModal
				isOpen={isRestoreModalOpen}
				fileId={file.id}
				fileName={file.name}
				onClose={() => setIsRestoreModalOpen(false)}
			/>
			<PermanentDeleteModal
				isOpen={isDeleteModalOpen}
				fileId={file.id}
				fileName={file.name}
				onClose={() => setIsDeleteModalOpen(false)}
			/>
		</>
	)
}
