import { IconClose } from '@consta/icons/IconClose'
import { IconEdit } from '@consta/icons/IconEdit'
import { IconTrash } from '@consta/icons/IconTrash'
import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { useState } from 'react'

import { BulkInlineActions, EmptyTrashModal, StorageSearch } from '@/features/Storage'

import { useStorageStore } from '@/entities/Storage'
import { StorageBreadcrumbs } from './StorageBreadcrumbs'

interface StorageModalHeaderProps {
	onClose: () => void
}

export const StorageModalHeader = ({ onClose }: StorageModalHeaderProps) => {
	const { activeView, trashedFiles, isBulkMode, toggleBulkMode } = useStorageStore()
	const [isEmptyTrashModalOpen, setIsEmptyTrashModalOpen] = useState(false)

	const filesCount = trashedFiles.items.length
	const isTrashView = activeView === 'trash'

	return (
		<>
			<header className='flex w-full items-center justify-between bg-[var(--color-bg-default)] px-8 py-5'>
				<div className='flex min-w-0 items-center gap-4'>
					<Button
						view='secondary'
						iconLeft={IconClose}
						size='s'
						className='rounded-full border border-[var(--color-bg-ghost)]'
						style={{
							width: '40px',
							height: '40px'
						}}
						onClick={() => onClose()}
					/>
					<Text size='xl' view='primary' weight='bold'>
						Хранилище
					</Text>
					<StorageBreadcrumbs />
				</div>

				<div className='flex items-center gap-2'>
					{/* Кнопка очистки корзины */}
					{isTrashView && filesCount > 0 && (
						<Button
							view='primary'
							iconLeft={IconTrash}
							label='Очистить'
							onlyIcon
							title='Очистить корзину'
							size='s'
							onClick={() => setIsEmptyTrashModalOpen(true)}
							style={{ background: 'var(--color-bg-alert)' }}
						/>
					)}
					{/* Inline bulk actions (feature) */}
					<BulkInlineActions />

					{/* Edit / Close bulk mode */}
					<Button
						view='ghost'
						size='s'
						onlyIcon
						iconLeft={isBulkMode ? IconClose : IconEdit}
						onClick={toggleBulkMode}
						title='Режим редактирования'
					/>

					<div className='flex items-center'>
						<StorageSearch />
					</div>
				</div>
			</header>

			<EmptyTrashModal
				isOpen={isEmptyTrashModalOpen}
				onClose={() => setIsEmptyTrashModalOpen(false)}
			/>
		</>
	)
}
