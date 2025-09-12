export interface Module {
	id: string
	name: string
	thumbnail?: string
	tags?: string[]
	isFavorite?: boolean
	isSystem?: boolean
	createdAt?: string
	updatedAt?: string
}
