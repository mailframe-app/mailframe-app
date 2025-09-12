import { apiInstance, handleApiError } from '@/shared/api'

import type {
	GetStorageItemsParams,
	PaginatedResponse,
	RestoreFilePayload,
	StorageFile
} from './types'

export const trashApi = {
	// GET /api/v1/storage/trash - Получить список файлов в корзине
	getTrashedFiles: async (
		params: GetStorageItemsParams,
		signal?: AbortSignal
	): Promise<PaginatedResponse<StorageFile>> => {
		try {
			const { data } = await apiInstance.get<PaginatedResponse<StorageFile>>('v1/storage/trash', {
				params,
				signal
			})
			return data
		} catch (error) {
			throw handleApiError(error)
		}
	},

	// DELETE /api/v1/storage/trash - Очистить корзину (удалить все файлы)
	emptyTrash: async (): Promise<void> => {
		try {
			await apiInstance.delete('v1/storage/trash')
		} catch (error) {
			throw handleApiError(error)
		}
	},

	// POST /api/v1/storage/trash/{fileId}/restore - Восстановить файл из корзины
	restoreFile: async (fileId: string, payload: RestoreFilePayload): Promise<StorageFile> => {
		try {
			const { data } = await apiInstance.post<StorageFile>(
				`v1/storage/trash/${fileId}/restore`,
				payload
			)
			return data
		} catch (error) {
			throw handleApiError(error)
		}
	},

	// DELETE /api/v1/storage/trash/{fileId} - Окончательно удалить файл из корзины
	permanentDeleteFile: async (fileId: string): Promise<void> => {
		try {
			await apiInstance.delete(`v1/storage/trash/${fileId}`)
		} catch (error) {
			throw handleApiError(error)
		}
	}
}
