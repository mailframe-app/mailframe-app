import { handleApiError } from '@/shared/api'

import { filesApi, foldersApi, trashApi } from '../../api'
import type { StorageStateCreator } from '../types'

/**
 * Слайс для множественного выбора элементов
 */
export const createSelectionSlice: StorageStateCreator = (set, get) => ({
	// Методы для управления режимом массового выбора
	setBulkMode: (enabled: boolean) => {
		set({ isBulkMode: enabled })
		// При выключении режима массового выбора очищаем выбранные элементы
		if (!enabled) {
			get().clearSelection()
		}
	},
	toggleBulkMode: () => {
		const currentMode = get().isBulkMode
		get().setBulkMode(!currentMode)
	},

	// Множественный выбор
	selectFile: (fileId: string) => {
		set(state => {
			const isSelected = state.selectedItems.files.includes(fileId)
			return {
				selectedItems: {
					...state.selectedItems,
					files: isSelected
						? state.selectedItems.files.filter(id => id !== fileId)
						: [...state.selectedItems.files, fileId]
				}
			}
		})
	},

	selectFolder: (folderId: string) => {
		set(state => {
			const isSelected = state.selectedItems.folders.includes(folderId)
			return {
				selectedItems: {
					...state.selectedItems,
					folders: isSelected
						? state.selectedItems.folders.filter(id => id !== folderId)
						: [...state.selectedItems.folders, folderId]
				}
			}
		})
	},

	clearSelection: () => {
		set({ selectedItems: { files: [], folders: [] } })
	},

	deleteSelectedItems: async () => {
		const { selectedItems } = get()
		set({
			loading: { ...get().loading, operation: true }
		})

		try {
			// Последовательно удаляем каждый выбранный файл
			for (const fileId of selectedItems.files) {
				await filesApi.deleteFile(fileId)
			}

			// Последовательно удаляем каждую выбранную папку
			for (const folderId of selectedItems.folders) {
				await foldersApi.deleteFolder(folderId)
			}

			// Очищаем выбор, выключаем режим и обновляем список
			set({ selectedItems: { files: [], folders: [] }, isBulkMode: false })
			await get().fetchStorageItems()
			await get().fetchFolderTree()
			await get().fetchStorageStats()
			return { success: true }
		} catch (error) {
			const errorResponse = handleApiError(error)
			return {
				success: false,
				error: errorResponse.message
			}
		} finally {
			set({ loading: { ...get().loading, operation: false } })
		}
	},

	moveSelectedItems: async (targetFolderId: string | null) => {
		const { selectedItems } = get()
		set({
			loading: { ...get().loading, operation: true }
		})

		try {
			// Перемещаем файлы, игнорируя те, что уже в целевой папке и конфликты 409
			for (const fileId of selectedItems.files) {
				const file = get().items.files.find(f => f.id === fileId)
				const currentFolderId = file?.folderId ?? null
				if (currentFolderId === targetFolderId) continue
				try {
					await filesApi.moveFile(fileId, { folderId: targetFolderId })
				} catch (e) {
					const err = handleApiError(e)
					if (err.statusCode === 409) {
						// Конфликт имени — пропускаем этот файл
						continue
					}
					throw e
				}
			}

			// Перемещаем папки, игнорируя те, что уже под тем же родителем и конфликты 409
			for (const folderId of selectedItems.folders) {
				const folder = get().items.folders.find(f => f.id === folderId)
				const currentParentId = folder?.parentId ?? null
				if (currentParentId === targetFolderId) continue
				try {
					await foldersApi.moveFolder(folderId, { newParentId: targetFolderId })
				} catch (e) {
					const err = handleApiError(e)
					if (err.statusCode === 409) {
						// Конфликт имени — пропускаем эту папку
						continue
					}
					throw e
				}
			}

			// Очищаем выбор, выключаем режим и обновляем список
			set({ selectedItems: { files: [], folders: [] }, isBulkMode: false })
			await get().fetchStorageItems()
			await get().fetchFolderTree()
			return { success: true }
		} catch (error) {
			const errorResponse = handleApiError(error)
			return {
				success: false,
				error: errorResponse.message
			}
		} finally {
			set({ loading: { ...get().loading, operation: false } })
		}
	},

	toggleFavoriteForSelectedFiles: async (isFavorite: boolean) => {
		const { selectedItems } = get()
		set({
			loading: { ...get().loading, operation: true }
		})

		try {
			// Изменяем статус избранного для выбранных файлов
			for (const fileId of selectedItems.files) {
				await filesApi.toggleFavorite(fileId, { isFavorite })
			}

			// Очищаем выбор, выключаем режим и обновляем список
			set({ selectedItems: { files: [], folders: [] }, isBulkMode: false })
			await get().fetchStorageItems()
			return { success: true }
		} catch (error) {
			const errorResponse = handleApiError(error)
			return {
				success: false,
				error: errorResponse.message
			}
		} finally {
			set({ loading: { ...get().loading, operation: false } })
		}
	},

	restoreSelectedFiles: async (targetFolderId: string | null) => {
		const { selectedItems } = get()
		set({
			loading: { ...get().loading, operation: true }
		})
		try {
			// В корзине восстанавливаем только файлы; игнорируем конфликты 409
			for (const fileId of selectedItems.files) {
				try {
					await trashApi.restoreFile(fileId, { folderId: targetFolderId ?? null })
				} catch (e) {
					const err = handleApiError(e)
					if (err.statusCode === 409) {
						// Конфликт имени — пропускаем этот файл
						continue
					}
					throw e
				}
			}
			// Сброс выделения, выключаем режим и единичное обновление данных
			set({ selectedItems: { files: [], folders: [] }, isBulkMode: false })
			await get().fetchTrashedFiles()
			await get().fetchStorageStats()
			return { success: true }
		} catch (error) {
			const errorResponse = handleApiError(error)
			return {
				success: false,
				error: errorResponse.message
			}
		} finally {
			set({ loading: { ...get().loading, operation: false } })
		}
	}
})
