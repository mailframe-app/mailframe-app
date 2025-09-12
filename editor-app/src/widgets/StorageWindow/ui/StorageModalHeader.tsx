import { IconClose } from '@consta/icons/IconClose'
import { IconEdit } from '@consta/icons/IconEdit'
import { IconTrash } from '@consta/icons/IconTrash'
import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { useState } from 'react'

import { BulkInlineActions, EmptyTrashModal, StorageSearch } from '@/features/Storage'

import { StorageBreadcrumbs } from './StorageBreadcrumbs'
import { useStorageStore } from '@/entities/Storage'

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
			<header className='flex w-full items-center justify-between border-b border-gray-200 bg-white px-8 py-5 shadow-sm'>
				<div className='flex min-w-0 items-center gap-4'>
					<Button
						view='secondary'
						iconLeft={IconClose}
						size='s'
						className='rounded-full border border-gray-200'
						style={{
							boxShadow: '0px 2px 8px 0px rgba(0,32,51,0.16)',
							border: '1px solid #E5E6EB',
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
