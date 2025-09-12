import { Button } from '@consta/uikit/Button'
import { Combobox } from '@consta/uikit/Combobox'
import { Layout } from '@consta/uikit/Layout'
import { Modal } from '@consta/uikit/Modal'
import { Text } from '@consta/uikit/Text'
import { Folder, FolderUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { type FolderTree, useStorageStore } from '@/entities/Storage'

interface MoveItemModalProps {
	isOpen: boolean
	onClose: () => void
	onMove: (targetFolderId: string | null) => Promise<void>
	itemName: string
	itemType?: 'файл' | 'папку'
}

type FolderOption = {
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
		? [{ id: null, label: 'В корневую папку', ancestorHasSibling: [], isLast: true }]
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

export const MoveItemModal = ({
	isOpen,
	onClose,
	onMove,
	itemName,
	itemType = 'файл'
}: MoveItemModalProps) => {
	const { folderTree, fetchFolderTree, loading } = useStorageStore()
	const [targetFolder, setTargetFolder] = useState<FolderOption | null>({
		id: null,
		label: 'В корневую папку',
		ancestorHasSibling: [],
		isLast: true
	})
	const [folderOptions, setFolderOptions] = useState<FolderOption[]>([])

	useEffect(() => {
		if (isOpen) {
			fetchFolderTree()
		}
	}, [isOpen, fetchFolderTree])

	useEffect(() => {
		const flatFolders = flattenTreeForDisplay(folderTree)
		setFolderOptions(flatFolders)
		setTargetFolder(flatFolders[0])
	}, [folderTree])

	const handleSubmit = async () => {
		try {
			await onMove(targetFolder?.id ?? null)
			toast.success(
				`${itemType.charAt(0).toUpperCase() + itemType.slice(1)} "${itemName}" успешно перемещен.`
			)
			onClose()
		} catch {
			toast.error(`Ошибка при перемещении.`)
		}
	}

	return (
		<Modal isOpen={isOpen} onEsc={onClose} hasOverlay>
			<Layout direction='column' className='p-6' style={{ width: '400px' }}>
				<Text size='xl' weight='bold' className='mb-4'>
					Переместить {itemType}
				</Text>
				<Text className='mb-4'>
					Выберите папку для перемещения {itemType === 'файл' ? 'файла' : 'папки'} "{itemName}
					":
				</Text>
				<Combobox
					items={folderOptions}
					value={targetFolder}
					onChange={value => setTargetFolder(value)}
					placeholder='Выберите папку'
					size='s'
					getItemLabel={item => item.label}
					getItemKey={item => item.id || 'root'}
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
										<span key={i} className='inline-block w-5 text-center font-mono text-gray-400'>
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
					className='mb-6'
				/>
				<Layout direction='row' className='justify-end gap-2'>
					<Button label='Отмена' view='ghost' onClick={onClose} disabled={loading.operation} />
					<Button
						label='Переместить'
						onClick={handleSubmit}
						disabled={!targetFolder || loading.operation}
						loading={loading.operation}
					/>
				</Layout>
			</Layout>
		</Modal>
	)
}
