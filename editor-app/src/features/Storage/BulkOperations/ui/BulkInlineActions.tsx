import { IconAllDone } from '@consta/icons/IconAllDone'
import { IconFavoriteFilled } from '@consta/icons/IconFavoriteFilled'
import { IconFavoriteStroked } from '@consta/icons/IconFavoriteStroked'
import { IconReply } from '@consta/icons/IconReply'
import { IconRevert } from '@consta/icons/IconRevert'
import { IconTrash } from '@consta/icons/IconTrash'
import { IconUpload } from '@consta/icons/IconUpload'
import { Button } from '@consta/uikit/Button'
import React, { useMemo, useState } from 'react'

import { DeleteConfirmationModal, MoveItemModal } from '@/features/Storage'

import { useStorageStore } from '@/entities/Storage'

export const BulkInlineActions: React.FC = () => {
	const {
		activeView,
		items,
		trashedFiles,
		isBulkMode,
		selectedItems,
		selectFile,
		selectFolder,
		clearSelection,
		deleteSelectedItems,
		moveSelectedItems,
		toggleFavoriteForSelectedFiles,
		restoreSelectedFiles
	} = useStorageStore()
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [isRestoreMoveOpen, setIsRestoreMoveOpen] = useState(false)
	const [isMoveModalOpen, setIsMoveModalOpen] = useState(false)

	const visibleFileIds = useMemo(() => {
		if (activeView === 'trash') return trashedFiles.items.map(f => f.id)
		return items.files.map(f => f.id)
	}, [activeView, trashedFiles.items, items.files])

	const visibleFolderIds = useMemo(() => {
		return activeView === 'files' ? items.folders.map(f => f.id) : []
	}, [activeView, items.folders])

	const selectedCount = useMemo(
		() => selectedItems.files.length + selectedItems.folders.length,
		[selectedItems.files.length, selectedItems.folders.length]
	)

	const selectedVisibleFiles = useMemo(() => {
		const pool = activeView === 'trash' ? trashedFiles.items : items.files
		const sel = new Set(selectedItems.files)
		return pool.filter(f => sel.has(f.id))
	}, [activeView, items.files, trashedFiles.items, selectedItems.files])

	const willRemoveFromFavorites = useMemo(() => {
		if (activeView === 'trash') return false
		if (selectedVisibleFiles.length === 0) return false
		return selectedVisibleFiles.every(f => f.isFavorite)
	}, [activeView, selectedVisibleFiles])

	const starIcon = willRemoveFromFavorites ? IconFavoriteFilled : IconFavoriteStroked
	const starTitle = willRemoveFromFavorites ? 'Убрать из избранного' : 'Добавить в избранное'
	const handleStarClick = () => toggleFavoriteForSelectedFiles(!willRemoveFromFavorites)

	const handleSelectAll = () => {
		visibleFileIds.forEach(id => {
			if (!selectedItems.files.includes(id)) selectFile(id)
		})
		visibleFolderIds.forEach(id => {
			if (!selectedItems.folders.includes(id)) selectFolder(id)
		})
	}

	if (!isBulkMode) return null

	const isTrash = activeView === 'trash'

	return (
		<>
			<div className='flex items-center gap-2'>
				{!isTrash && (
					<>
						<Button
							view='clear'
							size='s'
							onlyIcon
							iconLeft={starIcon}
							onClick={handleStarClick}
							title={starTitle}
						/>
						<Button
							view='clear'
							size='s'
							onlyIcon
							iconLeft={IconReply}
							onClick={() => setIsMoveModalOpen(true)}
							title='Переместить'
						/>
						<Button
							view='clear'
							size='s'
							onlyIcon
							iconLeft={IconTrash}
							onClick={() => setIsDeleteModalOpen(true)}
							title='Удалить'
						/>
					</>
				)}

				{isTrash && (
					<Button
						view='clear'
						size='s'
						onlyIcon
						iconLeft={IconUpload}
						label='Восстановить'
						onClick={() => setIsRestoreMoveOpen(true)}
					/>
				)}

				<Button
					view='clear'
					size='s'
					onlyIcon
					iconLeft={IconRevert}
					onClick={clearSelection}
					title='Отменить выделение'
				/>
				<Button
					view='clear'
					size='s'
					iconLeft={IconAllDone}
					label={`${selectedCount}`}
					onClick={handleSelectAll}
					title='Выделить все'
				/>
			</div>

			<DeleteConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={async () => {
					await deleteSelectedItems()
					setIsDeleteModalOpen(false)
				}}
				itemName={'выбранные элементы'}
				itemType={'файл'}
			/>

			<MoveItemModal
				isOpen={isMoveModalOpen}
				onClose={() => setIsMoveModalOpen(false)}
				onMove={async targetFolderId => {
					await moveSelectedItems(targetFolderId)
					setIsMoveModalOpen(false)
				}}
				itemName={'выбранные элементы'}
				itemType={'файл'}
			/>

			<MoveItemModal
				isOpen={isRestoreMoveOpen}
				onClose={() => setIsRestoreMoveOpen(false)}
				onMove={async targetFolderId => {
					await restoreSelectedFiles(targetFolderId)
					setIsRestoreMoveOpen(false)
				}}
				itemName={'выбранные файлы'}
				itemType={'файл'}
			/>
		</>
	)
}
