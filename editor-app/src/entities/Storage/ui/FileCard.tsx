import { IconKebab } from '@consta/icons/IconKebab'
import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { Star } from 'lucide-react'
import React, { useState } from 'react'

import type { StorageFile } from '../api'
import { formatFileSize, getExtensionFromMimeType } from '../model/utils'

import { FileTypeIcon } from './FileTypeIcon'

interface FileCardProps {
	file: StorageFile
	onClick?: (file: StorageFile) => void
	onSelect?: (file: StorageFile) => void
	isSelected?: boolean
	isBulkMode?: boolean
	menu?: React.ReactNode
	onMenuClick?: (e: React.MouseEvent) => void
}

export const FileCard = React.forwardRef<HTMLButtonElement, FileCardProps>(
	({ file, onClick, onSelect, isSelected = false, isBulkMode = false, menu, onMenuClick }, ref) => {
		const [isHovered, setIsHovered] = useState(false)

		const handleClick = () => {
			if (isBulkMode) {
				if (onSelect) onSelect(file)
				return
			}
			if (onClick) onClick(file)
		}

		const fileExtension = getExtensionFromMimeType(file.mimeType)

		return (
			<div
				className={`flex h-full flex-col rounded-md border p-2 transition-all ${
					isSelected
						? 'border-blue-500'
						: 'border-[var(--color-bg-ghost)] hover:border-[var(--color-bg-ghost)]'
				}`}
				onClick={handleClick}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{/* Превью или иконка файла */}
				<div className='relative mb-2 flex h-[120px] items-center justify-center overflow-hidden rounded !bg-[var(--color-bg-secondary)]'>
					{file.isImage && file.thumbnailUrl ? (
						<img
							src={file.thumbnailUrl || file.url}
							alt={file.name}
							className='h-full w-full object-contain'
						/>
					) : (
						<FileTypeIcon mimeType={file.mimeType} size={48} />
					)}

					{/* Элементы управления (только меню вне bulk-режима) */}
					{(isHovered || isSelected) && !isBulkMode && (
						<div className='absolute top-2 right-2'>
							<Button
								ref={ref}
								onlyIcon
								iconLeft={IconKebab}
								view='clear'
								size='s'
								onClick={onMenuClick}
								className='text-gray-600 hover:text-gray-900'
								style={{
									boxShadow: '0px 2px 8px 0px rgba(0,32,51,0.16)'
								}}
							/>
						</div>
					)}

					{/* Иконка избранного */}
					{file.isFavorite && (
						<div className='absolute top-2 left-2'>
							<Star size={16} fill='#FFD700' color='#FFD700' />
						</div>
					)}
				</div>

				{/* Информация о файле */}
				<div className='flex flex-1 flex-col'>
					<div className='flex items-center justify-between'>
						<Text size='s' truncate className='font-medium' view='primary'>
							{file.name}
						</Text>
						<Text size='xs' view='secondary'>
							{fileExtension}
						</Text>
					</div>
					<div className='mt-1 flex items-center justify-between'>
						<Text size='xs' view='secondary'>
							{file.metadata?.width}x{file.metadata?.height}px
						</Text>
						<Text size='xs' view='secondary'>
							{formatFileSize(file.size)}
						</Text>
					</div>
				</div>
				{menu}
			</div>
		)
	}
)

FileCard.displayName = 'FileCard'
