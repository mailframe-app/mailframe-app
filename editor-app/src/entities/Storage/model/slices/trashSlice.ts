import { handleApiError } from '@/shared/api'

import type { RestoreFilePayload } from '../../api'
import { trashApi } from '../../api'
import type { StorageStateCreator } from '../types'

/**
 * Слайс для операций с корзиной
 */
export const createTrashSlice: StorageStateCreator = (set, get) => ({
	fetchTrashedFiles: async () => {
		set({
			loading: { ...get().loading, trashedFiles: true }
		})
		try {
			const params = {
				...get().queryParams,
				parentId: null
			}
			const data = await trashApi.getTrashedFiles(params)
			set({
				trashedFiles: {
					items: data.data,
					meta: data.meta
				},
				loading: { ...get().loading, trashedFiles: false }
			})
			return { success: true }
		} catch (error) {
			const errorResponse = handleApiError(error)
			set({
				loading: { ...get().loading, trashedFiles: false }
			})
			return {
				success: false,
				error: errorResponse.message
			}
		}
	},

	// Операции с корзиной
	restoreFile: async (fileId: string, payload: RestoreFilePayload) => {
		set({
			loading: { ...get().loading, operation: true }
		})
		try {
			await trashApi.restoreFile(fileId, payload)
			await get().fetchTrashedFiles()
			await get().fetchStorageStats()
			set({ loading: { ...get().loading, operation: false } })
			return { success: true }
		} catch (error) {
			const errorResponse = handleApiError(error)
			set({
				loading: { ...get().loading, operation: false }
			})
			return {
				success: false,
				error: errorResponse.message
			}
		}
	},

	permanentDeleteFile: async (fileId: string) => {
		set({
			loading: { ...get().loading, operation: true }
		})
		try {
			await trashApi.permanentDeleteFile(fileId)
			await get().fetchTrashedFiles()
			await get().fetchStorageStats()
			set({ loading: { ...get().loading, operation: false } })
			return { success: true }
		} catch (error) {
			const errorResponse = handleApiError(error)
			set({
				loading: { ...get().loading, operation: false }
			})
			return {
				success: false,
				error: errorResponse.message
			}
		}
	},

	emptyTrash: async () => {
		set({
			loading: { ...get().loading, operation: true }
		})
		try {
			await trashApi.emptyTrash()
			await get().fetchTrashedFiles()
			await get().fetchStorageStats()
			set({ loading: { ...get().loading, operation: false } })
			return { success: true }
		} catch (error) {
			const errorResponse = handleApiError(error)
			set({
				loading: { ...get().loading, operation: false }
			})
			return {
				success: false,
				error: errorResponse.message
			}
		}
	}
})
