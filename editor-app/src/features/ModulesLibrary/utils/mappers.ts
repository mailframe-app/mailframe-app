import type { Module } from '../model/types'

import type { BlockResponseDto } from '@/entities/ReusableBlocks'

export const blockToModule = (block: BlockResponseDto): Module => {
	return {
		id: block.id,
		name: block.name,
		thumbnail: block.previewUrl || '',
		tags: block.tags ? block.tags.map(tag => tag.slug) : [],
		isFavorite: block.isFavorite,
		isSystem: block.isSystem,
		createdAt: block.createdAt,
		updatedAt: block.updatedAt
	}
}

export const blocksToModules = (blocks: BlockResponseDto[]): Module[] => {
	return blocks.map(blockToModule)
}
