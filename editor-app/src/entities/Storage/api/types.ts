export type Breadcrumb = {
	id: string | null
	name: string
}

export type StorageMeta = {
	totalFiles: number
	path: Breadcrumb[]
	parentId: string | null
	page: number
	limit: number
	totalPages: number
}

export type StorageFile = {
	id: string
	name: string
	url: string
	thumbnailUrl?: string
	mimeType: string
	size: number
	isImage: boolean
	metadata?: Record<string, unknown>
	folderId?: string
	isFavorite: boolean
	useCount: number
	createdAt: string
	updatedAt: string
}

export type StorageFolder = {
	id: string
	name: string
	parentId?: string
	createdAt: string
	filesCount: number
	updatedAt: string
}

export type FolderTree = {
	id: string
	name: string
	children: FolderTree[]
}

export type StorageItems = {
	folders: StorageFolder[]
	files: StorageFile[]
	meta: StorageMeta
}

export type GetStorageItemsParams = {
	parentId?: string | null
	search?: string
	mimeType?: string
	onlyFavorites?: boolean
	page?: number
	limit?: number
	sortBy?: 'name' | 'createdAt' | 'size'
	sortOrder?: 'asc' | 'desc'
}

export type CreateFolderPayload = {
	name: string
	parentId?: string
}

export type UpdateFolderPayload = {
	name: string
}

export type MoveFolderPayload = {
	newParentId?: string | null
}

export type UpdateFilePayload = {
	name: string
}

export type MoveFilePayload = {
	folderId?: string | null
}

export type RestoreFilePayload = {
	folderId?: string | null
}

export type ToggleFavoritePayload = {
	isFavorite: boolean
}

export type StorageStats = {
	totalSize: number
	totalFiles: number
	totalFolders: number
}

export type PaginatedResponse<T> = {
	data: T[]
	meta: {
		total: number
		page: number
		limit: number
		totalPages: number
	}
}

export type UploadFilePayload = {
	folderId?: string | null
	file: File
}
