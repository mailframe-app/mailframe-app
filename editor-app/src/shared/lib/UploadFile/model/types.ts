export type FileUploadResponse = {
	id: string
	name: string
	url: string
	thumbnailUrl?: string
	mimeType: string
	size: number
	isImage: boolean
	metadata?: {
		width?: number
		height?: number
		[key: string]: unknown
	}
	folderId?: string
	isFavorite: boolean
	useCount: number
	createdAt: string
	updatedAt: string
}
