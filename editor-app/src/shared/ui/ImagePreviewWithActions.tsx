import { IconEdit } from '@consta/icons/IconEdit'
import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import React, { useEffect, useState } from 'react'

interface FileDetails {
	name?: string
	size?: number
	width?: number
	height?: number
}

interface ImagePreviewWithActionsProps {
	src: string
	alt?: string
	onReplace: () => void
	onDelete: () => void
	previewClassName?: string
	fileDetails?: FileDetails
	formatFileSize?: (bytes: number) => string
	replaceButtonText?: string
	deleteButtonText?: string
	disableActions?: boolean
	isLoading?: boolean
}

export const ImagePreviewWithActions: React.FC<ImagePreviewWithActionsProps> = ({
	src,
	alt,
	onReplace,
	onDelete,
	previewClassName = '',
	fileDetails,
	formatFileSize = bytes => {
		if (bytes < 1024) return bytes + ' B'
		else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
		else return (bytes / 1048576).toFixed(1) + ' MB'
	},
	replaceButtonText = 'Заменить',
	deleteButtonText = 'Удалить',
	disableActions = false,
	isLoading = false
}) => {
	const [showModal, setShowModal] = useState(false)
	const [imageLoaded, setImageLoaded] = useState(false)

	useEffect(() => {
		if (src) {
			setImageLoaded(false)
		}
	}, [src])

	const showSkeleton = isLoading || !imageLoaded

	return (
		<>
			<div className='relative mb-4 flex justify-center'>
				<div className='relative h-[200px] w-[272px]'>
					{/* Скелетон */}
					{showSkeleton && (
						<div className='absolute inset-0 animate-pulse'>
							<div className='h-full w-full rounded border border-dashed border-blue-300 bg-[var(--color-bg-stripe)] p-[20px]'>
								<div className='h-full w-full rounded bg-[var(--color-bg-stripe)]' />
							</div>
						</div>
					)}
					{/* Изображение */}
					<img
						src={src}
						alt={alt}
						className={`absolute top-0 left-0 h-full w-full rounded border border-dashed border-blue-300 bg-[var(--color-bg-stripe)] p-[20px] transition-opacity duration-300 ${previewClassName} ${showSkeleton ? 'opacity-0' : 'opacity-100'}`}
						style={{ objectFit: 'contain' }}
						onLoad={() => setImageLoaded(true)}
						onError={() => setImageLoaded(true)}
					/>
					{/* Карандаш и модальные окна, появляются после загрузки */}
					{!disableActions && !showSkeleton && (
						<>
							<Button
								view='primary'
								size='s'
								iconLeft={IconEdit}
								className='!absolute !top-2 !right-2 cursor-pointer'
								onClick={() => setShowModal(true)}
								title='Заменить изображение'
								onlyIcon
							/>
							{showModal && (
								<>
									<div className='absolute inset-0 z-10 rounded bg-[var(--color-bg-overlay)] backdrop-blur-[6px] transition' />
									<div className='absolute inset-0 z-20 flex flex-col items-center justify-center'>
										<div className='flex flex-col items-center gap-3 rounded-lg bg-transparent px-6 py-4'>
											<Button
												label={replaceButtonText}
												view='primary'
												size='s'
												className='mb-2 w-[92px]'
												onClick={() => {
													setShowModal(false)
													onReplace()
												}}
											/>
											<Button
												label={deleteButtonText}
												view='secondary'
												size='s'
												className='w-[92px]'
												onClick={() => {
													setShowModal(false)
													onDelete()
												}}
											/>
										</div>
									</div>
								</>
							)}
						</>
					)}
				</div>
			</div>

			{/* Отображение метаданных файла */}
			{!showSkeleton && fileDetails && (
				<div className='mb-2'>
					<Text view='primary' size='s' weight='light' className='text-xs text-[var(--color-typo-secondary)]'>
						Параметры изображения
					</Text>
					{fileDetails.name && (
						<Text
							view='secondary'
							size='s'
							weight='light'
							className='truncate text-xs text-gray-500'
						>
							{fileDetails.name}
						</Text>
					)}
					<div className='flex justify-between'>
						{fileDetails.width && fileDetails.height && (
							<Text view='secondary' size='s' weight='light' className='text-xs text-gray-500'>
								{`${fileDetails.width} × ${fileDetails.height} px`}
							</Text>
						)}
						{fileDetails.size && (
							<Text view='secondary' size='s' weight='light' className='text-xs text-gray-500'>
								{formatFileSize(fileDetails.size)}
							</Text>
						)}
					</div>
				</div>
			)}
		</>
	)
}
