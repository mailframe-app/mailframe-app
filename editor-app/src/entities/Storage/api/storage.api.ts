import { apiInstance, handleApiError } from '@/shared/api'

import type { GetStorageItemsParams, StorageItems } from './types'

export const storageApi = {
	// GET /api/v1/storage/items - Получить содержимое папки (файлы и папки)
	getStorageItems: async (
		params: GetStorageItemsParams,
		signal?: AbortSignal
	): Promise<StorageItems> => {
		try {
			const { data } = await apiInstance.get<StorageItems>('v1/storage/items', {
				params,
				signal
			})
			return data
		} catch (error) {
			throw handleApiError(error)
		}
	}
}
