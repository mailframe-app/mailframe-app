import { IconEdit } from '@consta/icons/IconEdit'
import { IconFavoriteFilled } from '@consta/icons/IconFavoriteFilled'
import { IconFavoriteStroked } from '@consta/icons/IconFavoriteStroked'
import { IconTrash } from '@consta/icons/IconTrash'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'
import { useEditor } from '@craftjs/core'
import React, { createElement, memo, useEffect, useRef, useState } from 'react'

import type { Module } from '../../model/types'
import { useModuleCard } from '../../model/useModuleCard'

import { MjmlSpacer } from '@/entities/EditorBlocks'

interface ModuleCardProps {
	module: Module
}

const ModuleCardComponent: React.FC<ModuleCardProps> = props => {
	const { module } = props
	const { isHovered, on, off, handleFavoriteClick, handleEditClick, handleDeleteClick } =
		useModuleCard({ module })

	// DnD overlay setup
	const { connectors } = useEditor()
	const overlayRef = useRef<HTMLDivElement | null>(null)
	useEffect(() => {
		const el = overlayRef.current
		if (el) {
			type SpacerProps = {
				thickness: string
				lineStyle: 'solid' | 'dashed' | 'dotted'
				color: string
				__moduleId?: string
			}
			const placeholder = createElement(MjmlSpacer as React.ComponentType<SpacerProps>, {
				thickness: '0px',
				lineStyle: 'solid',
				color: 'transparent',
				__moduleId: module.id
			})
			connectors.create(el, placeholder)
		}
	}, [connectors, module.id])

	const [isImageLoaded, setIsImageLoaded] = useState(false)
	const [hasImageError, setHasImageError] = useState(false)

	return (
		<div className='group relative flex items-center' onMouseEnter={on} onMouseLeave={off}>
			<Card
				className={`w-full overflow-hidden rounded-md border p-0 shadow-sm transition-all duration-300 group-hover:-translate-y-[1px] group-hover:border-gray-300 group-hover:shadow-lg ${
					module.isFavorite
						? 'border-[#FFD700] shadow-[0_0_5px_rgba(255,215,0,0.5)]'
						: 'border-gray-200'
				}`}
			>
				<div
					className='relative flex w-full items-center justify-center bg-gray-100'
					style={{ minHeight: '64px' }}
				>
					{!isImageLoaded && !hasImageError && module.thumbnail && (
						<div className='absolute inset-0 animate-pulse'>
							<div className='h-full w-full rounded bg-gray-200' />
						</div>
					)}

					{module.thumbnail && !hasImageError ? (
						<img
							src={module.thumbnail}
							alt={module.name}
							className={`block max-h-full max-w-full transition-opacity duration-300 ${
								isImageLoaded ? 'opacity-100' : 'opacity-0'
							}`}
							loading='lazy'
							decoding='async'
							onLoad={() => setIsImageLoaded(true)}
							onError={() => setHasImageError(true)}
						/>
					) : (
						<Text view='ghost' size='s'>
							Нет превью
						</Text>
					)}

					<div ref={overlayRef} className='absolute inset-0 z-10 cursor-grab' />

					{isHovered && (
						<div className='absolute top-2 right-2 z-20 flex flex-row items-center gap-x-1 rounded-[4px] bg-[#2b63d9] p-0.5'>
							<button
								title={module.isFavorite ? 'Убрать из избранного' : 'В избранное'}
								onClick={handleFavoriteClick}
								className='flex h-6 w-6 cursor-pointer items-center justify-center rounded border-none bg-transparent text-white transition-colors duration-200 ease-in-out hover:bg-blue-600'
							>
								{module.isFavorite ? (
									<IconFavoriteFilled size='xs' />
								) : (
									<IconFavoriteStroked size='xs' />
								)}
							</button>
							{!module.isSystem && (
								<>
									<button
										title='Редактировать'
										onClick={handleEditClick}
										className='flex h-6 w-6 cursor-pointer items-center justify-center rounded border-none bg-transparent text-white transition-colors duration-200 ease-in-out hover:bg-blue-600'
									>
										<IconEdit size='xs' />
									</button>
									<button
										title='Удалить'
										onClick={handleDeleteClick}
										className='flex h-6 w-6 cursor-pointer items-center justify-center rounded border-none bg-transparent text-white transition-colors duration-200 ease-in-out hover:bg-blue-600'
									>
										<IconTrash size='xs' />
									</button>
								</>
							)}
						</div>
					)}
				</div>
			</Card>
		</div>
	)
}

export const ModuleCard = memo(ModuleCardComponent)
