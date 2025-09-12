export interface BlockResponseDto {
	id: string
	name: string
	isSystem: boolean
	isFavorite: boolean
	tags:
		| Array<{
				id: string
				name: string
				slug: string
		  }>
		| []
	previewUrl?: string
	createdAt?: string
	updatedAt?: string
}

export interface BlockContentDto {
	content: string
}

export interface GetBlocksResponseDto {
	favoriteBlocks: BlockResponseDto[]
	userBlocks: BlockResponseDto[]
	systemBlocks: BlockResponseDto[]
	stats: {
		totalFavorites: number
		totalUserBlocks: number
		totalSystemBlocks: number
	}
}

export interface CreateBlockDto {
	name: string
	content: object
	html: string
	tags: string[]
}

export interface UpdateBlockDto {
	name?: string
	tags?: string[]
}

export interface GetBlocksParams {
	tags?: string[]
	favoritesOnly?: boolean
	search?: string
	sortBy?: 'name' | 'createdAt' | 'updatedAt'
	sortOrder?: 'asc' | 'desc'
}

export interface ToggleFavoriteResponse {
	isFavorite: boolean
}

export interface DeleteBlockResponse {
	success: boolean
}
