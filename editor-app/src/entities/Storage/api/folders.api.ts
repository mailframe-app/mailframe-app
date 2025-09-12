import { apiInstance, handleApiError } from '@/shared/api'

import type {
	CreateFolderPayload,
	FolderTree,
	MoveFolderPayload,
	StorageFolder,
	UpdateFolderPayload
} from './types'

export const foldersApi = {
	// GET /api/v1/storage/folders - Получить дерево папок
	getFoldersTree: async (): Promise<FolderTree[]> => {
		try {
			const { data } = await apiInstance.get<FolderTree[]>('v1/storage/folders')
			return data
		} catch (error) {
			throw handleApiError(error)
		}
	},

	// POST /api/v1/storage/folders - Создать новую папку
	createFolder: async (payload: CreateFolderPayload): Promise<StorageFolder> => {
		try {
			const { data } = await apiInstance.post<StorageFolder>('v1/storage/folders', payload)
			return data
		} catch (error) {
			throw handleApiError(error)
		}
	},

	// PATCH /api/v1/storage/folders/{folderId}/rename - Переименовать папку
	renameFolder: async (folderId: string, payload: UpdateFolderPayload): Promise<StorageFolder> => {
		try {
			const { data } = await apiInstance.patch<StorageFolder>(
				`v1/storage/folders/${folderId}/rename`,
				payload
			)
			return data
		} catch (error) {
			throw handleApiError(error)
		}
	},

	// PATCH /api/v1/storage/folders/{folderId}/move - Переместить папку
	moveFolder: async (folderId: string, payload: MoveFolderPayload): Promise<StorageFolder> => {
		try {
			const { data } = await apiInstance.patch<StorageFolder>(
				`v1/storage/folders/${folderId}/move`,
				payload
			)
			return data
		} catch (error) {
			throw handleApiError(error)
		}
	},

	// DELETE /api/v1/storage/folders/{folderId} - Удалить папку
	deleteFolder: async (folderId: string): Promise<void> => {
		try {
			await apiInstance.delete(`v1/storage/folders/${folderId}`)
		} catch (error) {
			throw handleApiError(error)
		}
	}
}
