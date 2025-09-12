export interface UpdateTemplateDto {
	name?: string
	editorState?: Record<string, unknown>
	bodyHtml?: string
	variableMapping?: Record<string, { fieldKey: string; default: string }>
	tagIds?: string[]
}

export interface TemplateDetailDto {
	id: string
	name?: string
	editorState?: Record<string, unknown>
	bodyHtml?: string
	variableMapping?: Record<string, { fieldKey: string; default: string }>
	previewUrl?: string
	createdAt?: string
	updatedAt?: string
	isFavorite?: boolean
	isOwner?: boolean
	isLibrary?: boolean
	tags?: Array<{
		id: string
		name: string
		slug: string
	}>
}

export interface TemplateResponseDto {
	id: string
	name: string
	previewUrl?: string
	createdAt: string
	updatedAt: string
	isFavorite: boolean
	isOwner: boolean
	isLibrary: boolean
	tags: Array<{
		id: string
		name: string
		slug: string
	}>
}
