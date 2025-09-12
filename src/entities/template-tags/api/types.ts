export type TagType = 'template' | 'block'

export type TagFilterType = 'blocks' | 'templates'

export interface CreateTagRequest {
	name: string
	type: TagType
}

export interface GetTagsQuery {
	type: TagFilterType
}

export interface TagResponse {
	id: string
	name: string
	slug: string
	usageCount: number
	type: TagType
}
