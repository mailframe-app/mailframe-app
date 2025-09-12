import { IconAttach } from '@consta/icons/IconAttach'
import { Button } from '@consta/uikit/Button'
import { Loader } from '@consta/uikit/Loader'
import { Text } from '@consta/uikit/Text'
import React, { useRef, useState } from 'react'

import { startFileSelectionHelper } from '@/shared/lib/startFileSelectionHelper'
import type { SelectedFileData } from '@/shared/types'

interface ImageUploadProps {
	onFileSelect: (file: File) => void
	onLibrarySelect?: (callback: (file: SelectedFileData) => void) => void
	accept?: string
	maxSizeMb?: number
	isLoading?: boolean
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
	onFileSelect,
	onLibrarySelect,
	accept = 'image/png,image/jpeg,image/jpg,image/tiff',
	maxSizeMb = 5,
	isLoading = false
}) => {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [isDragging, setIsDragging] = useState(false)

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			if (file.size > maxSizeMb * 1024 * 1024) {
				alert(`Размер файла превышает ${maxSizeMb} Мб`)
				return
			}
			onFileSelect(file)
		}
	}

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsDragging(false)

		const file = event.dataTransfer.files?.[0]
		if (file) {
			if (file.size > maxSizeMb * 1024 * 1024) {
				alert(`Размер файла превышает ${maxSizeMb} Мб`)
				return
			}
			onFileSelect(file)
		}
	}

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => event.preventDefault()
	const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsDragging(true)
	}
	const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault()
		setIsDragging(false)
	}

	const dropzoneClassName = `relative flex flex-col items-center rounded-lg border border-dashed p-6 text-center transition-colors ${
		isDragging ? 'border-green-500 bg-green-50' : 'border-blue-300'
	}`

	return (
		<div
			className={dropzoneClassName}
			onDrop={handleDrop}
			onDragOver={handleDragOver}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
		>
			{isLoading && (
				<div className='absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/80'>
					<Loader />
				</div>
			)}

			<div className='pointer-events-none'>
				<IconAttach size='m' view='secondary' className='mb-3' />
				<Text size='m' view='secondary' weight='light' className='mb-2 font-medium'>
					Перетащите сюда файл для загрузки
				</Text>
				<Text size='s' view='secondary' weight='light' className='mb-4'>
					Поддерживаемые форматы: PNG, TIFF, JPG. До {maxSizeMb} Мб.
				</Text>
			</div>
			<div className='flex w-full flex-col gap-2'>
				<Button
					view='primary'
					label='Из библиотеки'
					size='m'
					onClick={() =>
						startFileSelectionHelper(onLibrarySelect, file => {
							// Здесь можно сделать установку src, alt, fileDetails
							// но для ImageUpload достаточно только передать в родитель
							console.log('Выбрано из библиотеки:', file)
						})
					}
					disabled={isLoading}
				/>
				<Button
					view='secondary'
					label='С компьютера'
					size='m'
					onClick={() => fileInputRef.current?.click()}
					disabled={isLoading}
				/>
				<input
					type='file'
					accept={accept}
					style={{ display: 'none' }}
					ref={fileInputRef}
					onChange={handleFileChange}
				/>
			</div>
		</div>
	)
}
