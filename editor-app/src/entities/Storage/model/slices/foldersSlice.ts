import { handleApiError } from '@/shared/api'

import type { MoveFolderPayload, UpdateFolderPayload } from '../../api'
import { foldersApi } from '../../api'
import type { StorageStateCreator } from '../types'

/**
 * Слайс для операций с папками
 */
export const createFoldersSlice: StorageStateCreator = (set, get) => ({
	fetchFolderTree: async () => {
		set({
			loading: { ...get().loading, folderTree: true }
		})
		try {
			const data = await foldersApi.getFoldersTree()
			set({
				folderTree: data,
				loading: { ...get().loading, folderTree: false }
			})
			return { success: true }
		} catch (error) {
			const errorResponse = handleApiError(error)
			set({
				loading: { ...get().loading, folderTree: false }
			})
			return {
				success: false,
				error: errorResponse.message
			}
		}
	},

	// Операции с папками
	createFolder: async (name: string, parentId?: string | null) => {
		set({
			loading: { ...get().loading, operation: true }
		})
		try {
			await foldersApi.createFolder({
				name,
				parentId: parentId === null ? undefined : parentId
			})
			await get().fetchStorageItems()
			await get().fetchFolderTree()
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

	renameFolder: async (folderId: string, name: string) => {
		set({
			loading: { ...get().loading, operation: true }
		})
		try {
			const payload: UpdateFolderPayload = { name }
			await foldersApi.renameFolder(folderId, payload)
			await get().fetchStorageItems()
			await get().fetchFolderTree()
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

	moveFolder: async (folderId: string, newParentId: string | null) => {
		set({
			loading: { ...get().loading, operation: true }
		})
		try {
			const payload: MoveFolderPayload = { newParentId }
			await foldersApi.moveFolder(folderId, payload)
			await get().fetchStorageItems()
			await get().fetchFolderTree()
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

	deleteFolder: async (folderId: string) => {
		set({
			loading: { ...get().loading, operation: true }
		})
		try {
			await foldersApi.deleteFolder(folderId)
			await get().fetchStorageItems()
			await get().fetchFolderTree()
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
