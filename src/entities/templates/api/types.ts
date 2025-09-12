export type TemplatesTab = 'my' | 'library'

export type TemplatesSortBy = 'name' | 'createdAt' | 'updatedAt'

export type SortOrder = 'asc' | 'desc'

export interface TemplateTag {
	id: string
	name: string
	slug: string
}

export interface TemplateListItem {
	id: string
	name: string
	isSystem: boolean
	previewUrl: string | null
	tags: TemplateTag[]
	isFavorite: boolean
	createdAt: string
	updatedAt: string
}

export interface TemplateDetailResponse {
	id: string
	name: string
	editorState: object | null
	bodyHtml: string | null
	variableMapping: object | null
	isSystem: boolean
	previewUrl: string | null
	tags: TemplateTag[]
	isFavorite: boolean
	createdAt: string
	updatedAt: string
}

export interface TemplatePreviewResponse {
	id: string
	name: string
	previewUrl: string | null
	isSystem: boolean
	isFavorite: boolean
	tags: TemplateTag[]
	variableMapping: Record<string, { default: string; fieldKey: string }> | null
	createdAt: string
	updatedAt: string
}

export interface CreateTemplateRequest {
	name?: string
	editorState?: object
	bodyHtml?: string
	variableMapping?: object
	tagIds?: string[]
}

export interface UpdateTemplateRequest {
	name?: string
	editorState?: object
	bodyHtml?: string
	variableMapping?: object
	tagIds?: string[]
}

export interface GetTemplatesQuery {
	tab?: TemplatesTab
	tags?: string[]
	search?: string
	sortBy?: TemplatesSortBy
	sortOrder?: SortOrder
}

export interface GetTemplatesResponse {
	favoriteTemplates: TemplateListItem[]
	templates: TemplateListItem[]
}

export interface SendTestEmailRequest {
	recipientEmail: string
	subject?: string
	testVariables?: Record<string, string>
}

export interface SendTestEmailResponse {
	success: boolean
	message: string
	sentAt?: string
}
