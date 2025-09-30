import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { useNode } from '@craftjs/core'
import React from 'react'

import { useFileUpload } from '@/shared/lib/UploadFile'
import { startFileSelectionHelper } from '@/shared/lib/startFileSelectionHelper'
import type { SelectedFileData } from '@/shared/types'
import { AlignButtons } from '@/shared/ui/AlignButtons/AlignButtons'
import { ImagePreviewWithActions } from '@/shared/ui/ImagePreviewWithActions'
import { ImageUpload } from '@/shared/ui/ImageUpload'
import { PaddingsControl } from '@/shared/ui/PaddingControl'
import { RadiusField } from '@/shared/ui/RadiusField'
import { StepperField } from '@/shared/ui/StepperField'

import { ALIGN_OPTIONS, DEFAULT_IMAGE } from '../constants.editor'

import type { MjmlImageProps } from './MjmlImage.types'

interface MjmlImageSettingsProps {
	startFileSelection?: (callback: (file: SelectedFileData) => void) => void
	formatFileSize?: (bytes: number) => string
}

export const MjmlImageSettings: React.FC<MjmlImageSettingsProps> = ({
	startFileSelection,
	formatFileSize
}) => {
	const { upload, isLoading } = useFileUpload()
	const {
		actions: { setProp },
		src,
		alt,
		width,
		height,
		borderRadius,
		align,
		paddingTop,
		paddingBottom,
		paddingLeft,
		paddingRight,
		href,
		fileDetails
	} = useNode<
		MjmlImageProps & {
			paddingTop: string
			paddingBottom: string
			paddingLeft: string
			paddingRight: string
		}
	>(node => ({
		src: node.data.props.src,
		alt: node.data.props.alt,
		width: node.data.props.width,
		height: node.data.props.height,
		borderRadius: node.data.props.borderRadius,
		align: node.data.props.align,
		paddingTop: node.data.props.paddingTop,
		paddingBottom: node.data.props.paddingBottom,
		paddingLeft: node.data.props.paddingLeft,
		paddingRight: node.data.props.paddingRight,
		href: node.data.props.href,
		fileDetails: node.data.props.fileDetails
	}))

	const handleFileUpload = async (file: File) => {
		const uploadedFile = await upload(file)
		if (uploadedFile) {
			setProp((props: MjmlImageProps) => {
				props.src = uploadedFile.url
				props.alt = uploadedFile.name
				props.width = '200px'
				props.height = 'auto'
				props.fileDetails = {
					name: uploadedFile.name,
					size: uploadedFile.size,
					width: uploadedFile.metadata?.width || 0,
					height: uploadedFile.metadata?.height || 0
				}
			})
		}
	}

	// Выбор из библиотеки
	const handleSelectFromLibrary = () => {
		startFileSelectionHelper(startFileSelection, file => {
			setProp((props: MjmlImageProps) => {
				props.src = file.url
				props.alt = file.name
				props.width = '200px'
				props.height = 'auto'
				props.fileDetails = {
					name: file.name,
					size: file.size,
					width: file.width || 0,
					height: file.height || 0
				}
			})
		})
	}

	const handleRemoveImage = () => {
		setProp((props: MjmlImageProps) => {
			props.src = DEFAULT_IMAGE
			props.alt = ''
			props.fileDetails = undefined
		})
	}

	// Первоначальная панель выбора изображения
	const isDefaultImage = !src || src === DEFAULT_IMAGE

	if (isDefaultImage) {
		return (
			<ImageUpload
				onFileSelect={handleFileUpload}
				onLibrarySelect={handleSelectFromLibrary}
				isLoading={isLoading}
			/>
		)
	}

	// Основные настройки картинки
	return (
		<div>
			<ImagePreviewWithActions
				src={src}
				alt={alt}
				onReplace={handleSelectFromLibrary}
				onDelete={handleRemoveImage}
				fileDetails={fileDetails}
				formatFileSize={formatFileSize}
			/>

			{/* URL (disabled, для копирования/просмотра) */}
			<div className='mb-3'>
				<Text size='s' view='primary' weight='light' className='mb-2 block text-gray-500' required>
					URL
				</Text>
				<TextField
					value={href}
					size='s'
					view='default'
					onChange={value => setProp((props: MjmlImageProps) => (props.href = value || ''), 500)}
					className='consta-gray-placeholder w-full'
					placeholder='Введите ссылку'
				/>
			</div>

			{/* Размеры */}
			<div className='mb-3'>
				<Text size='s' view='primary' weight='light' className='mb-2 block text-gray-500'>
					Размер картинки
				</Text>
				<div className='flex justify-between'>
					<StepperField
						label='Ширина'
						value={width === 'auto' ? '' : String(width).replace(/px$/, '')}
						onChange={n =>
							setProp((props: MjmlImageProps) => (props.width = n ? `${n}px` : 'auto'))
						}
						placeholder='auto'
					/>
					<StepperField
						label='Высота'
						value={height === 'auto' ? '' : String(height).replace(/px$/, '')}
						onChange={n =>
							setProp((props: MjmlImageProps) => (props.height = n ? `${n}px` : 'auto'))
						}
						placeholder='auto'
					/>
				</div>
			</div>

			{/* Радиус скругления */}
			<RadiusField
				label='Радиус скругления'
				value={borderRadius}
				allowAuto={true}
				onChange={next =>
					setProp((props: MjmlImageProps) => {
						props.borderRadius = next
					})
				}
				className='mb-3'
			/>

			{/* Выравнивание */}
			<div className='mb-3 flex items-center justify-between'>
				<Text size='s' view='primary' weight='light' className='mb-2 block text-gray-500'>
					Выравнивание
				</Text>{' '}
				<AlignButtons
					options={ALIGN_OPTIONS}
					value={align}
					onChange={newAlign => setProp((props: MjmlImageProps) => (props.align = newAlign))}
				/>
			</div>

			{/* Внешние отступы */}
			<PaddingsControl
				value={{
					paddingTop,
					paddingRight,
					paddingBottom,
					paddingLeft
				}}
				onChange={paddings => {
					setProp((p: MjmlImageProps) => {
						p.paddingTop = paddings.paddingTop
						p.paddingRight = paddings.paddingRight
						p.paddingBottom = paddings.paddingBottom
						p.paddingLeft = paddings.paddingLeft
					})
				}}
			/>
		</div>
	)
}
