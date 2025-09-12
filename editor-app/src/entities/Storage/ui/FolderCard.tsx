import { IconKebab } from '@consta/icons/IconKebab'
import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import React, { useState } from 'react'

import type { StorageFolder } from '../api'

import folderIcon from './folder.svg'

interface FolderCardProps {
	folder: StorageFolder
	onClick?: (folder: StorageFolder) => void
	onSelect?: (folder: StorageFolder) => void
	isSelected?: boolean
	isBulkMode?: boolean
	menu?: React.ReactNode
	onMenuClick?: (e: React.MouseEvent) => void
}

export const FolderCard = React.forwardRef<HTMLButtonElement, FolderCardProps>(
	(
		{ folder, onClick, onSelect, isSelected = false, isBulkMode = false, menu, onMenuClick },
		ref
	) => {
		const [isHovered, setIsHovered] = useState(false)

		const handleClick = () => {
			if (isBulkMode) {
				if (onSelect) onSelect(folder)
				return
			}
			if (onClick) onClick(folder)
		}

		return (
			<div
				className={`flex h-full flex-col rounded-md border p-2 transition-all ${
					isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
				}`}
				onClick={handleClick}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{/* Иконка папки */}
				<div className='relative mb-2 flex h-[120px] items-center justify-center overflow-hidden rounded bg-gray-50'>
					<img src={folderIcon} alt='Folder' width={64} height={64} />

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
							/>
						</div>
					)}
				</div>

				{/* Информация о папке */}
				<div className='flex flex-1 flex-col'>
					<Text size='s' truncate className='font-medium'>
						{folder.name}
					</Text>

					<Text size='xs' view='secondary'>
						{folder.filesCount}{' '}
						{folder.filesCount === 1
							? 'файл'
							: folder.filesCount > 1 && folder.filesCount < 5
								? 'файла'
								: 'файлов'}
					</Text>
				</div>
				{menu}
			</div>
		)
	}
)

FolderCard.displayName = 'FolderCard'
