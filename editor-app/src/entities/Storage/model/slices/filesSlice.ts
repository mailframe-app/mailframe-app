import { toast } from 'sonner'

import { handleApiError } from '@/shared/api'

import type {
	MoveFilePayload,
	PaginatedResponse,
	StorageFile,
	StorageItems,
	ToggleFavoritePayload,
	UpdateFilePayload
} from '../../api'
import { filesApi, storageApi } from '../../api'
import type { StorageStateCreator } from '../types'

/**
 * Слайс для операций с файлами
 */
let itemsController: AbortController | null = null
let statsController: AbortController | null = null

export const createFilesSlice: StorageStateCreator = (set, get) => ({
	// Методы для работы с API
	fetchStorageItems: async () => {
		// abort previous
		if (itemsController) itemsController.abort()
		itemsController = new AbortController()
		const signal = itemsController.signal

		const currentVersion = get().requestVersion.items + 1
		set({
			loading: { ...get().loading, items: true },
			requestVersion: { ...get().requestVersion, items: currentVersion }
		})
		try {
			const queryParams = get().queryParams

			// Если есть поисковый запрос, ищем по всем файлам
			if (queryParams.search) {
				const response: PaginatedResponse<StorageFile> = await filesApi.getFiles(
					queryParams,
					signal
				)
				if (get().requestVersion.items !== currentVersion) return { success: true }
				const itemsData: StorageItems = {
					files: response.data,
					folders: [], // При поиске папки не отображаем
					meta: {
						totalFiles: response.meta.total,
						path: [{ id: null, name: 'Результаты поиска' }],
						parentId: null,
						page: response.meta.page,
						limit: response.meta.limit,
						totalPages: response.meta.totalPages
					}
				}
				set({
					items: itemsData,
					currentFolderId: null, // Сбрасываем текущую папку при поиске
					loading: { ...get().loading, items: false }
				})
			} else {
				// Загружаем содержимое текущей папки
				const data = await storageApi.getStorageItems(queryParams, signal)
				if (get().requestVersion.items !== currentVersion) return { success: true }

				// Если сортировка по размеру, применяем клиентскую сортировку по файлам в текущей папке
				let nextItems = data
				if (queryParams.sortBy === 'size') {
					const order = queryParams.sortOrder === 'asc' ? 1 : -1
					nextItems = {
						...data,
						files: [...data.files].sort((a, b) => (a.size - b.size) * order)
					}
				}

				set({
					items: nextItems,
					currentFolderId: queryParams.parentId,
					loading: { ...get().loading, items: false }
				})
			}
			return { success: true }
		} catch (error) {
			// ignore if stale or aborted
			if (get().requestVersion.items !== currentVersion) return { success: false }
			set({
				loading: { ...get().loading, items: false }
			})
			const errorResponse = handleApiError(error)
			toast.error(errorResponse.message || 'Не удалось загрузить файлы')
			return { success: false }
		}
	},

	fetchStorageStats: async () => {
		if (statsController) statsController.abort()
		statsController = new AbortController()
		const signal = statsController.signal

		const currentVersion = get().requestVersion.stats + 1
		set({
			loading: { ...get().loading, stats: true },
			requestVersion: { ...get().requestVersion, stats: currentVersion }
		})
		try {
			const data = await filesApi.getStorageStats(signal)
			if (get().requestVersion.stats !== currentVersion) return { success: true }
			set({
				stats: data,
				loading: { ...get().loading, stats: false }
			})
			return { success: true }
		} catch (error) {
			if (get().requestVersion.stats !== currentVersion) return { success: false }
			set({
				loading: { ...get().loading, stats: false }
			})
			const errorResponse = handleApiError(error)
			toast.error(errorResponse.message || 'Не удалось загрузить статистику')
			return { success: false }
		}
	},

	// Операции с файлами
	uploadFile: async (file: File, folderId?: string | null) => {
		set({
			loading: { ...get().loading, upload: true }
		})
		try {
			await filesApi.uploadFile({
				file,
				folderId: folderId || get().currentFolderId
			})
			set({ loading: { ...get().loading, upload: false } })
			return { success: true }
		} catch (error) {
			const errorResponse = handleApiError(error)
			set({
				loading: { ...get().loading, upload: false }
			})
			return {
				success: false,
				error: errorResponse.message
			}
		}
	},

	renameFile: async (fileId: string, name: string) => {
		set({
			loading: { ...get().loading, operation: true }
		})
		try {
			const payload: UpdateFilePayload = { name }
			await filesApi.renameFile(fileId, payload)
			const activeView = get().activeView
			if (activeView === 'files') {
				await get().fetchStorageItems()
			} else {
				const currentParams = get().queryParams
				const response = await filesApi.getFiles(currentParams)
				const itemsData: StorageItems = {
					files: response.data,
					folders: [],
					meta: {
						totalFiles: response.meta.total,
						path: [{ id: null, name: 'Root' }],
						parentId: null,
						page: response.meta.page,
						limit: response.meta.limit,
						totalPages: response.meta.totalPages
					}
				}
				set({ items: itemsData })
			}
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

	moveFile: async (fileId: string, folderId: string | null) => {
		set({
			loading: { ...get().loading, operation: true }
		})
		try {
			const payload: MoveFilePayload = { folderId }
			await filesApi.moveFile(fileId, payload)
			const activeView = get().activeView
			if (activeView === 'files') {
				await get().fetchStorageItems()
			} else {
				const currentParams = get().queryParams
				const response = await filesApi.getFiles(currentParams)
				const itemsData: StorageItems = {
					files: response.data,
					folders: [],
					meta: {
						totalFiles: response.meta.total,
						path: [{ id: null, name: 'Root' }],
						parentId: null,
						page: response.meta.page,
						limit: response.meta.limit,
						totalPages: response.meta.totalPages
					}
				}
				set({ items: itemsData })
			}
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

	deleteFile: async (fileId: string) => {
		set({
			loading: { ...get().loading, operation: true }
		})
		try {
			await filesApi.deleteFile(fileId)
			const activeView = get().activeView
			if (activeView === 'files') {
				await get().fetchStorageItems()
			} else {
				const currentParams = get().queryParams
				const response = await filesApi.getFiles(currentParams)
				const itemsData: StorageItems = {
					files: response.data,
					folders: [],
					meta: {
						totalFiles: response.meta.total,
						path: [{ id: null, name: 'Root' }],
						parentId: null,
						page: response.meta.page,
						limit: response.meta.limit,
						totalPages: response.meta.totalPages
					}
				}
				set({ items: itemsData })
			}
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

	toggleFavorite: async (fileId: string, isFavorite: boolean) => {
		set({
			loading: { ...get().loading, operation: true }
		})
		try {
			const payload: ToggleFavoritePayload = { isFavorite }
			await filesApi.toggleFavorite(fileId, payload)
			const activeView = get().activeView
			if (activeView === 'files') {
				await get().fetchStorageItems()
			} else {
				const currentParams = get().queryParams
				const response = await filesApi.getFiles(currentParams)
				const itemsData: StorageItems = {
					files: response.data,
					folders: [],
					meta: {
						totalFiles: response.meta.total,
						path: [{ id: null, name: 'Root' }],
						parentId: null,
						page: response.meta.page,
						limit: response.meta.limit,
						totalPages: response.meta.totalPages
					}
				}
				set({ items: itemsData })
			}
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
