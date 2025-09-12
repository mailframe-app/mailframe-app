import { create } from 'zustand'

import { createStoreContext } from '@/shared/lib'

import type {
	FolderTree,
	GetStorageItemsParams,
	RestoreFilePayload,
	StorageFile,
	StorageItems,
	StorageStats
} from '../api'
import { filesApi } from '../api/files.api'

import {
	createBaseSlice,
	createFilesSlice,
	createFoldersSlice,
	createNavigationSlice,
	createSelectionSlice,
	createTrashSlice
} from './slices'

export type ActiveView = 'files' | 'recent' | 'favorites' | 'trash'

export interface StorageState {
	// Состояние данных
	items: StorageItems
	folderTree: FolderTree[]
	currentFolderId: string | null
	stats: StorageStats | null
	trashedFiles: {
		items: StorageFile[]
		meta: {
			total: number
			page: number
			limit: number
			totalPages: number
		}
	}
	activeView: ActiveView

	// Режим массового выбора
	isBulkMode: boolean

	// Параметры запроса
	queryParams: GetStorageItemsParams

	// Per-view фильтры
	viewQuery: Record<
		ActiveView,
		{
			search: string
			sortBy: 'name' | 'createdAt' | 'size'
			sortOrder: 'asc' | 'desc'
			page: number
			limit: number
		}
	>

	// Состояния загрузки и ошибки
	loading: {
		items: boolean
		folderTree: boolean
		stats: boolean
		trashedFiles: boolean
		upload: boolean
		operation: boolean
	}

	// Версионирование запросов для предотвращения гонок
	requestVersion: {
		items: number
		folderTree: number
		stats: number
		trashedFiles: number
	}

	// Выбранные элементы
	selectedItems: {
		files: string[]
		folders: string[]
	}

	// Методы для работы с API
	fetchStorageItems: () => Promise<{ success: boolean; error?: string }>
	fetchFolderTree: () => Promise<{ success: boolean; error?: string }>
	fetchStorageStats: () => Promise<{ success: boolean; error?: string }>
	fetchTrashedFiles: () => Promise<{ success: boolean; error?: string }>

	// Операции с файлами
	uploadFile: (
		file: File,
		folderId?: string | null
	) => Promise<{ success: boolean; error?: string }>
	renameFile: (fileId: string, name: string) => Promise<{ success: boolean; error?: string }>
	moveFile: (
		fileId: string,
		folderId: string | null
	) => Promise<{ success: boolean; error?: string }>
	deleteFile: (fileId: string) => Promise<{ success: boolean; error?: string }>
	toggleFavorite: (
		fileId: string,
		isFavorite: boolean
	) => Promise<{ success: boolean; error?: string }>

	// Операции с папками
	createFolder: (
		name: string,
		parentId?: string | null
	) => Promise<{ success: boolean; error?: string }>
	renameFolder: (folderId: string, name: string) => Promise<{ success: boolean; error?: string }>
	moveFolder: (
		folderId: string,
		newParentId: string | null
	) => Promise<{ success: boolean; error?: string }>
	deleteFolder: (folderId: string) => Promise<{ success: boolean; error?: string }>

	// Операции с корзиной
	restoreFile: (
		fileId: string,
		payload: RestoreFilePayload
	) => Promise<{ success: boolean; error?: string }>
	permanentDeleteFile: (fileId: string) => Promise<{ success: boolean; error?: string }>
	emptyTrash: () => Promise<{ success: boolean; error?: string }>

	// Навигация и фильтрация
	setCurrentFolder: (folderId: string | null) => void
	navigateUp: () => void
	setSearchQuery: (query: string) => void
	setSortParams: (sortBy: 'name' | 'createdAt' | 'size', sortOrder: 'asc' | 'desc') => void
	setPage: (page: number) => void
	setActiveView: (view: ActiveView) => void

	// Управление режимом массового выбора
	setBulkMode: (enabled: boolean) => void
	toggleBulkMode: () => void

	// Множественный выбор
	selectFile: (fileId: string) => void
	selectFolder: (folderId: string) => void
	clearSelection: () => void
	deleteSelectedItems: () => Promise<{ success: boolean; error?: string }>
	moveSelectedItems: (
		targetFolderId: string | null
	) => Promise<{ success: boolean; error?: string }>
	toggleFavoriteForSelectedFiles: (
		isFavorite: boolean
	) => Promise<{ success: boolean; error?: string }>
	restoreSelectedFiles: (
		targetFolderId: string | null
	) => Promise<{ success: boolean; error?: string }>
}

export const createStorageStore = (initialState: Partial<StorageState>) =>
	create<StorageState>((set, get) => ({
		...(createBaseSlice(set, get) as StorageState),
		...initialState,
		...createFilesSlice(set, get),
		...createFoldersSlice(set, get),
		...createTrashSlice(set, get),
		...createNavigationSlice(set, get),
		...createSelectionSlice(set, get),

		setActiveView: (view: ActiveView) => {
			set({ activeView: view })

			// Обновляем параметры запроса из per-view
			const vq = get().viewQuery[view]
			const newParams: GetStorageItemsParams = {
				search: vq.search,
				sortBy: vq.sortBy,
				sortOrder: vq.sortOrder,
				page: vq.page,
				limit: vq.limit,
				parentId: view === 'files' ? (get().queryParams.parentId ?? null) : null,
				onlyFavorites: view === 'favorites' ? true : false
			}

			set({ queryParams: newParams })

			// Выбираем API в зависимости от вкладки
			if (view === 'favorites' || view === 'recent') {
				const currentVersion = get().requestVersion.items + 1
				set({
					loading: { ...get().loading, items: true },
					requestVersion: { ...get().requestVersion, items: currentVersion }
				})

				filesApi
					.getFiles(newParams)
					.then(response => {
						if (get().requestVersion.items !== currentVersion) return
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

						set({
							items: itemsData,
							loading: { ...get().loading, items: false }
						})
					})
					.catch(() => {
						if (get().requestVersion.items !== currentVersion) return
						set({
							loading: { ...get().loading, items: false }
						})
					})
			} else if (view === 'files') {
				get().fetchStorageItems()
			} else if (view === 'trash') {
				get().fetchTrashedFiles()
			}
		}
	}))

export const { Provider: StorageProvider, useStore: useStorageStore } =
	createStoreContext(createStorageStore)
