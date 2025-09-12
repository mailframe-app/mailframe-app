import { Button } from '@consta/uikit/Button'
import { Combobox } from '@consta/uikit/Combobox'
import { Modal } from '@consta/uikit/Modal'
import { Text } from '@consta/uikit/Text'
import { Folder, FolderUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { type FolderTree, useStorageStore } from '@/entities/Storage'

interface RestoreFileModalProps {
	isOpen: boolean
	fileId: string
	fileName: string
	onClose: () => void
}

interface FolderOption {
	id: string | null
	label: string
	ancestorHasSibling: boolean[]
	isLast: boolean
}

const flattenTreeForDisplay = (
	nodes: FolderTree[],
	parentLineage: boolean[] = [],
	includeRoot = true
): FolderOption[] => {
	let options: FolderOption[] = includeRoot
		? [{ id: null, label: 'Корневая папка', ancestorHasSibling: [], isLast: true }]
		: []

	nodes.forEach((node, index) => {
		const isLast = index === nodes.length - 1
		options.push({
			id: node.id,
			label: node.name,
			ancestorHasSibling: parentLineage,
			isLast: isLast
		})

		if (node.children && node.children.length > 0) {
			const nextLineage = [...parentLineage, !isLast]
			options = options.concat(flattenTreeForDisplay(node.children, nextLineage, false))
		}
	})

	return options
}

export const RestoreFileModal = ({ isOpen, fileId, fileName, onClose }: RestoreFileModalProps) => {
	const { folderTree, restoreFile, fetchFolderTree } = useStorageStore()
	const [selectedFolder, setSelectedFolder] = useState<FolderOption | null>(null)
	const [folderOptions, setFolderOptions] = useState<FolderOption[]>([])
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (isOpen) {
			fetchFolderTree()
		}
	}, [isOpen, fetchFolderTree])

	useEffect(() => {
		const flatFolders = flattenTreeForDisplay(folderTree)
		setFolderOptions(flatFolders)
		if (flatFolders.length > 0) {
			setSelectedFolder(flatFolders[0])
		}
	}, [folderTree])

	const handleRestore = async () => {
		setIsLoading(true)
		try {
			const result = await restoreFile(fileId, { folderId: selectedFolder?.id ?? null })
			if (result.success) {
				toast.success(`Файл "${fileName}" восстановлен`)
				onClose()
			} else {
				toast.error(result.error || 'Ошибка при восстановлении файла')
			}
		} catch {
			toast.error('Произошла ошибка при восстановлении файла')
		} finally {
			setIsLoading(false)
		}
	}

	const handleClose = () => {
		setSelectedFolder(null)
		onClose()
	}

	return (
		<Modal isOpen={isOpen} hasOverlay onClickOutside={handleClose} className='max-w-md'>
			<div className='p-6'>
				<Text size='l' weight='semibold' className='mb-4'>
					Восстановить файл
				</Text>

				<Text size='s' view='secondary' className='mb-4'>
					Файл "{fileName}" будет восстановлен в выбранную папку
				</Text>

				<div className='mb-6'>
					<Text size='s' weight='medium' className='mb-2'>
						Выберите папку для восстановления:
					</Text>
					<Combobox
						items={folderOptions}
						value={selectedFolder}
						onChange={value => setSelectedFolder(value)}
						getItemLabel={item => item.label}
						getItemKey={item => item.id ?? 'root'}
						renderItem={({ item, active, hovered, onClick, onMouseEnter, ref }) => (
							<div
								ref={ref}
								onMouseEnter={onMouseEnter}
								onClick={onClick}
								className={`flex cursor-pointer items-center p-2 ${active ? 'bg-blue-100' : ''} ${
									hovered ? 'bg-gray-100' : ''
								}`}
							>
								{item.id === null ? (
									<>
										<FolderUp size={16} className='mr-2' />
										<span>{item.label}</span>
									</>
								) : (
									<>
										{item.ancestorHasSibling.map((hasSibling, i) => (
											<span
												key={i}
												className='inline-block w-5 text-center font-mono text-gray-400'
											>
												{hasSibling ? '│' : ' '}
											</span>
										))}
										<span className='inline-block w-5 text-center font-mono text-gray-400'>
											{item.isLast ? '└' : '├'}─
										</span>
										<Folder size={16} className='mr-2' />
										<span>{item.label}</span>
									</>
								)}
							</div>
						)}
						placeholder='Выберите папку'
						size='s'
					/>
				</div>

				<div className='flex justify-end gap-3'>
					<Button label='Отмена' view='clear' size='s' onClick={handleClose} disabled={isLoading} />
					<Button label='Восстановить' view='primary' onClick={handleRestore} loading={isLoading} />
				</div>
			</div>
		</Modal>
	)
}
