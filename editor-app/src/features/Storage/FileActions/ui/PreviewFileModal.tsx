import { IconClose } from '@consta/icons/IconClose'
import { Button } from '@consta/uikit/Button'
import { Layout } from '@consta/uikit/Layout'
import { Modal } from '@consta/uikit/Modal'
import { Text } from '@consta/uikit/Text'
import React, { useMemo } from 'react'

import {
	type StorageFile,
	formatFileSize,
	getExtensionFromMimeType,
	useStorageStore
} from '@/entities/Storage'

interface PreviewFileModalProps {
	isOpen: boolean
	file: StorageFile
	onClose: () => void
	onAdd?: () => void
}

export const PreviewFileModal: React.FC<PreviewFileModalProps> = ({
	isOpen,
	file,
	onClose,
	onAdd
}) => {
	const { folderTree } = useStorageStore()

	const folderPath = useMemo(() => {
		if (!file.folderId) return ['Домашняя папка']

		const path: string[] = []
		const dfs = (nodes: typeof folderTree, targetId: string, trail: string[]): boolean => {
			for (const node of nodes) {
				const nextTrail = [...trail, node.name]
				if (node.id === targetId) {
					path.push(...nextTrail)
					return true
				}
				if (node.children && node.children.length > 0) {
					if (dfs(node.children, targetId, nextTrail)) return true
				}
			}
			return false
		}
		dfs(folderTree, file.folderId, [])
		return ['Домашняя папка', ...(path.length ? path : [])]
	}, [file.folderId, folderTree])

	const ext = useMemo(() => getExtensionFromMimeType(file.mimeType), [file.mimeType])

	const isPortrait = useMemo(() => {
		const w = (file.metadata?.width as number | undefined) ?? undefined
		const h = (file.metadata?.height as number | undefined) ?? undefined
		return !!(file.isImage && w && h && h > w)
	}, [file.isImage, file.metadata])

	const modalSizeClass = isPortrait ? 'w-[60vw] max-w-[720px]' : 'w-[80vw] max-w-[960px]'
	const detailsWidthClass = isPortrait ? 'w-[44%]' : 'w-[36%]'

	return (
		<Modal isOpen={isOpen} hasOverlay onEsc={onClose} className={`h-[80vh] ${modalSizeClass}`}>
			<Layout direction='column' className='h-full w-full overflow-hidden rounded-xl bg-white'>
				<Layout
					direction='row'
					className='items-center justify-between border-b border-gray-200 px-6 py-4'
				>
					<Text size='l' weight='bold'>
						Просмотр файла
					</Text>
					<Button
						view='secondary'
						onClick={onClose}
						iconLeft={IconClose}
						size='s'
						className='rounded-full border border-gray-200'
						style={{
							boxShadow: '0px 2px 8px 0px rgba(0,32,51,0.16)',
							border: '1px solid #E5E6EB',
							width: '40px',
							height: '40px'
						}}
					/>
				</Layout>

				<Layout direction='row' className='h-full w-full'>
					<Layout className='flex h-full flex-1 items-center justify-center bg-gray-50 p-6'>
						{file.isImage ? (
							<div className='flex h-[60vh] w-full items-center justify-center'>
								<img
									loading='eager'
									width={(file.metadata?.width as number | undefined) ?? undefined}
									height={(file.metadata?.height as number | undefined) ?? undefined}
									src={file.url}
									alt={file.name}
									className='max-h-full max-w-full object-contain'
								/>
							</div>
						) : (
							<div className='flex h-[60vh] w-full items-center justify-center'>
								<Text view='secondary'>Предпросмотр недоступен</Text>
							</div>
						)}
					</Layout>

					<Layout direction='column' className={`h-full ${detailsWidthClass} gap-0 border-l p-6`}>
						<Layout direction='column' className='mb-4 gap-1'>
							<Text view='secondary' size='s'>
								Имя файла
							</Text>
							<Text size='s' weight='medium' className='truncate'>
								{file.name}
							</Text>
						</Layout>

						<Layout direction='column' className='mb-4 gap-2'>
							<Layout direction='row' className='justify-between'>
								<Text view='secondary' size='s'>
									Размер
								</Text>
								<Text size='s'>{formatFileSize(file.size)}</Text>
							</Layout>
							<Layout direction='row' className='justify-between'>
								<Text view='secondary' size='s'>
									Тип
								</Text>
								<Text size='s'>{file.mimeType}</Text>
							</Layout>
							<Layout direction='row' className='justify-between'>
								<Text view='secondary' size='s'>
									Расширение
								</Text>
								<Text size='s'>.{ext}</Text>
							</Layout>
							<Layout direction='row' className='justify-between'>
								<Text view='secondary' size='s'>
									Ширина
								</Text>
								<Text size='s'>{(file.metadata?.width as number | undefined) ?? '—'}</Text>
							</Layout>
							<Layout direction='row' className='justify-between'>
								<Text view='secondary' size='s'>
									Высота
								</Text>
								<Text size='s'>{(file.metadata?.height as number | undefined) ?? '—'}</Text>
							</Layout>
						</Layout>

						<Layout direction='column' className='mb-4 gap-1'>
							<Text view='secondary' size='s'>
								Расположение
							</Text>
							<Text size='s' className='truncate'>
								{folderPath.join(' / ')}
							</Text>
						</Layout>

						<Layout direction='row' className='mt-auto justify-end gap-2'>
							{onAdd && <Button view='primary' label='Добавить' onClick={onAdd} />}
						</Layout>
					</Layout>
				</Layout>
			</Layout>
		</Modal>
	)
}
