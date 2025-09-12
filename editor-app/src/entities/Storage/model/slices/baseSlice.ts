import type { StorageFile, StorageItems, StorageStats } from '../../api'
import type { StorageStateCreator } from '../types'

/**
 * Базовый слайс стора хранилища
 * Содержит основное состояние и методы для получения данных
 */
export const createBaseSlice: StorageStateCreator = () => {
	// Начальное состояние
	const initialState = {
		// Состояние данных
		items: {
			files: [],
			folders: [],
			meta: {
				totalFiles: 0,
				path: [],
				parentId: null,
				page: 1,
				limit: 20,
				totalPages: 1
			}
		} as StorageItems,
		folderTree: [] as [],
		currentFolderId: null,
		stats: null as StorageStats | null,
		trashedFiles: {
			items: [] as StorageFile[],
			meta: {
				total: 0,
				page: 1,
				limit: 20,
				totalPages: 1
			}
		},
		isBulkMode: false,

		// Параметры запроса
		queryParams: {
			parentId: null,
			search: '',
			sortBy: 'createdAt' as const,
			sortOrder: 'desc' as const,
			page: 1,
			limit: 20
		},

		// Per-view фильтры
		viewQuery: {
			files: {
				search: '',
				sortBy: 'name' as const,
				sortOrder: 'asc' as const,
				page: 1,
				limit: 20
			},
			recent: {
				search: '',
				sortBy: 'createdAt' as const,
				sortOrder: 'desc' as const,
				page: 1,
				limit: 20
			},
			favorites: {
				search: '',
				sortBy: 'createdAt' as const,
				sortOrder: 'desc' as const,
				page: 1,
				limit: 20
			},
			trash: {
				search: '',
				sortBy: 'createdAt' as const,
				sortOrder: 'desc' as const,
				page: 1,
				limit: 20
			}
		},

		// Состояния загрузки и ошибки
		loading: {
			items: false,
			folderTree: false,
			stats: false,
			trashedFiles: false,
			upload: false,
			operation: false
		},

		// Версионирование запросов для предотвращения гонок
		requestVersion: {
			items: 0,
			folderTree: 0,
			stats: 0,
			trashedFiles: 0
		} as { items: number; folderTree: number; stats: number; trashedFiles: number },

		// Выбранные элементы
		selectedItems: {
			files: [] as string[],
			folders: [] as string[]
		}
	}

	return initialState
}
