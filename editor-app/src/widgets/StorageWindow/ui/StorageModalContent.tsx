import { Layout } from '@consta/uikit/Layout'
import { Pagination } from '@consta/uikit/Pagination'
import { Text } from '@consta/uikit/Text'

import {
	FileCardWithActions,
	FolderCardWithActions,
	TrashFileCardWithActions,
	useStorageModalProvider
} from '@/features/Storage'

import type { SelectedFileData } from '@/shared/types'

import { StorageModalSkeleton } from './StorageModalSkeleton'
import {
	type StorageFile,
	type StorageFolder,
	useStorageNavigation,
	useStorageStore
} from '@/entities/Storage'

export const StorageModalContent = () => {
	const {
		items,
		loading,
		activeView,
		trashedFiles,
		selectFile,
		selectFolder,
		selectedItems,
		setPage
	} = useStorageStore()
	const { navigateToFolder } = useStorageNavigation()
	const { onFileSelectCallback, closeModal } = useStorageModalProvider()

	const isLoading = activeView === 'trash' ? loading.trashedFiles : loading.items
	const currentItems =
		activeView === 'trash' ? trashedFiles.items : [...items.folders, ...items.files]
	const isEmpty = !currentItems.length

	const paginationMeta = activeView === 'trash' ? trashedFiles.meta : items.meta
	const currentPage = paginationMeta.page ?? 1
	const totalPages = paginationMeta.totalPages ?? 1

	// Обработчики для выбора файлов и папок
	const handleSelectFile = (file: StorageFile) => {
		selectFile(file.id)
	}

	const handleSelectFolder = (folder: StorageFolder) => {
		selectFolder(folder.id)
	}

	const handleFileCardClick = (file: StorageFile) => {
		if (onFileSelectCallback) {
			const selectedFile: SelectedFileData = {
				url: file.url,
				name: file.name,
				size: file.size,
				width: file.metadata?.width as number | undefined,
				height: file.metadata?.height as number | undefined
			}
			onFileSelectCallback(selectedFile)
			closeModal()
		} else {
			// Логика по умолчанию, если не в режиме выбора
			// console.log('Открыть файл для предпросмотра:', file)
		}
	}

	return (
		<Layout
			flex={1}
			direction='column'
			className='scroll-inset overflow-y-auto'
			style={{
				backgroundColor: 'var(--color-bg-secondary)'
			}}
		>
			<Layout
				direction='column'
				className='m-8 rounded-xl'
				style={{
					backgroundColor: 'var(--color-bg-default)'
				}}
			>
				{isLoading ? (
					<StorageModalSkeleton />
				) : isEmpty ? (
					<div className='flex h-full items-center justify-center p-8'>
						<div className='text-center'>
							<Text size='l' view='primary'>
								Здесь ничего нет
							</Text>
						</div>
					</div>
				) : (
					<>
						<div className='p-8'>
							<div className='flex flex-wrap'>
								{/* Отображаем сначала папки */}
								{activeView === 'files' &&
									items.folders.map((folder: StorageFolder) => (
										<div
											key={folder.id}
											className='mb-6 px-3'
											style={{ width: '16.666%', minWidth: '180px' }}
										>
											<FolderCardWithActions
												folder={folder}
												onClick={() => navigateToFolder(folder.id)}
												onSelect={handleSelectFolder}
												isSelected={selectedItems.folders.includes(folder.id)}
											/>
										</div>
									))}

								{/* Затем отображаем файлы */}
								{(activeView === 'trash' ? trashedFiles.items : items.files).map(
									(file: StorageFile) => (
										<div
											key={file.id}
											className='mb-6 px-3'
											style={{ width: '16.666%', minWidth: '180px' }}
										>
											{activeView === 'trash' ? (
												<TrashFileCardWithActions
													file={file}
													onClick={handleFileCardClick}
													onSelect={handleSelectFile}
													isSelected={selectedItems.files.includes(file.id)}
												/>
											) : (
												<FileCardWithActions
													file={file}
													onClick={handleFileCardClick}
													onSelect={handleSelectFile}
													isSelected={selectedItems.files.includes(file.id)}
												/>
											)}
										</div>
									)
								)}
							</div>
						</div>

						{!isLoading && totalPages > 1 && (
							<div className='flex justify-end px-8 pb-8'>
								<Pagination
									items={totalPages}
									value={currentPage}
									onChange={setPage}
									showFirstPage
									showLastPage
									arrows={[true, true]}
								/>
							</div>
						)}
					</>
				)}
			</Layout>
		</Layout>
	)
}
