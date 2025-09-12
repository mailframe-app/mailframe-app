import { apiInstance, handleApiError } from '@/shared/api'

import type {
	GetStorageItemsParams,
	MoveFilePayload,
	PaginatedResponse,
	StorageFile,
	StorageStats,
	ToggleFavoritePayload,
	UpdateFilePayload,
	UploadFilePayload
} from './types'

export const filesApi = {
	// POST /api/v1/storage/files/upload - Загрузить новый файл
	uploadFile: async (payload: UploadFilePayload): Promise<StorageFile> => {
		try {
			const formData = new FormData()
			formData.append('file', payload.file)
			if (payload.folderId) {
				formData.append('folderId', payload.folderId)
			}
			const { data } = await apiInstance.post<StorageFile>('v1/storage/files/upload', formData, {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			})
			return data
		} catch (error) {
			throw handleApiError(error)
		}
	},

	// PATCH /api/v1/storage/files/{fileId}/rename - Переименовать файл
	renameFile: async (fileId: string, payload: UpdateFilePayload): Promise<StorageFile> => {
		try {
			const { data } = await apiInstance.patch<StorageFile>(
				`v1/storage/files/${fileId}/rename`,
				payload
			)
			return data
		} catch (error) {
			throw handleApiError(error)
		}
	},

	// PATCH /api/v1/storage/files/{fileId}/move - Переместить файл
	moveFile: async (fileId: string, payload: MoveFilePayload): Promise<StorageFile> => {
		try {
			const { data } = await apiInstance.patch<StorageFile>(
				`v1/storage/files/${fileId}/move`,
				payload
			)
			return data
		} catch (error) {
			throw handleApiError(error)
		}
	},

	// PATCH /api/v1/storage/files/{fileId}/favorite - Добавить/удалить файл из избранного
	toggleFavorite: async (fileId: string, payload: ToggleFavoritePayload): Promise<StorageFile> => {
		try {
			const { data } = await apiInstance.patch<StorageFile>(
				`v1/storage/files/${fileId}/favorite`,
				payload
			)
			return data
		} catch (error) {
			throw handleApiError(error)
		}
	},

	// DELETE /api/v1/storage/files/{fileId} - Удалить файл (в корзину)
	deleteFile: async (fileId: string): Promise<void> => {
		try {
			await apiInstance.delete(`v1/storage/files/${fileId}`)
		} catch (error) {
			throw handleApiError(error)
		}
	},

	// GET /api/v1/storage/files - Получить список файлов
	getFiles: async (
		params: GetStorageItemsParams,
		signal?: AbortSignal
	): Promise<PaginatedResponse<StorageFile>> => {
		try {
			const { data } = await apiInstance.get<PaginatedResponse<StorageFile>>('v1/storage/files', {
				params,
				signal
			})
			return data
		} catch (error) {
			throw handleApiError(error)
		}
	},

	// GET /api/v1/storage/files/stats - Получить статистику хранилища
	getStorageStats: async (signal?: AbortSignal): Promise<StorageStats> => {
		try {
			const { data } = await apiInstance.get<StorageStats>('v1/storage/files/stats', { signal })
			return data
		} catch (error) {
			throw handleApiError(error)
		}
	}
}
