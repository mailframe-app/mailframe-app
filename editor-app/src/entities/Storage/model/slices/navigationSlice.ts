import type { StorageStateCreator } from '../types'

/**
 * Слайс для навигации и фильтрации
 */
export const createNavigationSlice: StorageStateCreator = (set, get) => ({
	// Навигация и фильтрация
	setCurrentFolder: (folderId: string | null) => {
		set(state => ({
			queryParams: { ...state.queryParams, parentId: folderId, page: 1 },
			viewQuery: {
				...state.viewQuery,
				files: { ...state.viewQuery.files, page: 1 }
			}
		}))
		get().fetchStorageItems()
	},

	navigateUp: () => {
		const { items } = get()
		if (items.meta.path.length > 1) {
			const parentIndex = items.meta.path.length - 2
			const parentId = items.meta.path[parentIndex].id
			get().setCurrentFolder(parentId)
		} else {
			get().setCurrentFolder(null)
		}
	},

	setSearchQuery: (query: string) => {
		const activeView = get().activeView
		set(state => ({
			viewQuery: {
				...state.viewQuery,
				[activeView]: { ...state.viewQuery[activeView], search: query, page: 1 }
			}
		}))
		get().setActiveView(activeView)
	},

	setSortParams: (sortBy: 'name' | 'createdAt' | 'size', sortOrder: 'asc' | 'desc') => {
		const activeView = get().activeView
		set(state => ({
			viewQuery: {
				...state.viewQuery,
				[activeView]: { ...state.viewQuery[activeView], sortBy, sortOrder, page: 1 }
			}
		}))
		get().setActiveView(activeView)
	},

	setPage: (page: number) => {
		const activeView = get().activeView
		set(state => ({
			viewQuery: {
				...state.viewQuery,
				[activeView]: { ...state.viewQuery[activeView], page }
			}
		}))
		get().setActiveView(activeView)
	}
})
