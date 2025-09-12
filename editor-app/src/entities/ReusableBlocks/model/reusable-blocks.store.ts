import { create } from 'zustand'

import { createStoreContext } from '@/shared/lib'

import type {
	BlockContentDto,
	BlockResponseDto,
	CreateBlockDto,
	GetBlocksParams,
	GetBlocksResponseDto,
	UpdateBlockDto
} from '../api'
import {
	createBlock,
	deleteBlock,
	getBlockContent,
	getBlocks,
	toggleFavorite,
	updateBlock
} from '../api'

export interface ReusableBlocksState {
	// Данные
	favoriteBlocks: BlockResponseDto[]
	userBlocks: BlockResponseDto[]
	systemBlocks: BlockResponseDto[]
	stats: {
		totalFavorites: number
		totalUserBlocks: number
		totalSystemBlocks: number
	}
	currentBlockContent: BlockContentDto | null

	// Состояния
	isLoading: boolean
	error: string | null

	// Состояния фильтров
	searchQuery: string
	sortBy: 'name' | 'createdAt' | 'updatedAt'
	sortOrder: 'asc' | 'desc'
	selectedTags: string[]
	showFavorites: boolean
	showUserBlocks: boolean
	showSystemBlocks: boolean

	// Действия
	fetchBlocks: () => Promise<void>
	fetchBlockContent: (id: string) => Promise<BlockContentDto | null>
	addBlock: (data: CreateBlockDto) => Promise<void>
	editBlock: (id: string, data: UpdateBlockDto) => Promise<void>
	removeBlock: (id: string) => Promise<void>
	toggleFavoriteBlock: (id: string) => Promise<void>

	// Действия для фильтров
	setSearchQuery: (query: string) => void
	setSortBy: (sortBy: 'name' | 'createdAt' | 'updatedAt') => void
	setSortOrder: (sortOrder: 'asc' | 'desc') => void
	setSelectedTags: (tags: string[]) => void
	toggleShowFavorites: () => void
	toggleShowUserBlocks: () => void
	toggleShowSystemBlocks: () => void
}

const createReusableBlocksStore = (blocks: GetBlocksResponseDto) =>
	create<ReusableBlocksState>((set, get) => ({
		// Данные
		favoriteBlocks: blocks.favoriteBlocks,
		userBlocks: blocks.userBlocks,
		systemBlocks: blocks.systemBlocks,
		stats: blocks.stats,
		currentBlockContent: null,

		// Состояния
		isLoading: false,
		error: null,

		// Состояния фильтров
		searchQuery: '',
		sortBy: 'createdAt',
		sortOrder: 'desc',
		selectedTags: [],
		showFavorites: true,
		showUserBlocks: true,
		showSystemBlocks: true,

		// Действия
		fetchBlocks: async () => {
			set({ isLoading: true, error: null })
			try {
				const { searchQuery, sortBy, sortOrder, selectedTags } = get()
				const params: GetBlocksParams = {
					sortBy,
					sortOrder
				}
				if (searchQuery) {
					params.search = searchQuery
				}

				if (selectedTags.length > 0) {
					params.tags = selectedTags
				}
				const response = await getBlocks(params)
				set({
					favoriteBlocks: response.favoriteBlocks,
					userBlocks: response.userBlocks,
					systemBlocks: response.systemBlocks,
					stats: response.stats,
					isLoading: false
				})
			} catch (e) {
				const error = e instanceof Error ? e.message : 'Ошибка при загрузке блоков'
				set({ isLoading: false, error })
			}
		},

		fetchBlockContent: async (id: string) => {
			set({ isLoading: true, error: null })
			try {
				const content = await getBlockContent(id)
				set({ currentBlockContent: content, isLoading: false })
				return content
			} catch (e) {
				const error = e instanceof Error ? e.message : 'Ошибка при загрузке контента блока'
				set({ isLoading: false, error })
				return null
			}
		},

		addBlock: async (data: CreateBlockDto) => {
			try {
				set({ isLoading: true, error: null })
				await createBlock(data)
				await get().fetchBlocks()
			} catch (e) {
				const error = e instanceof Error ? e.message : 'Ошибка при создании блока'
				set({ isLoading: false, error })
			}
		},

		editBlock: async (id: string, data: UpdateBlockDto) => {
			try {
				set({ isLoading: true, error: null })
				await updateBlock(id, data)
				await get().fetchBlocks()
			} catch (e) {
				const error = e instanceof Error ? e.message : 'Ошибка при обновлении блока'
				set({ isLoading: false, error })
			}
		},

		removeBlock: async (id: string) => {
			try {
				set({ isLoading: true, error: null })
				await deleteBlock(id)
				await get().fetchBlocks()
			} catch (e) {
				const error = e instanceof Error ? e.message : 'Ошибка при удалении блока'
				set({ isLoading: false, error })
			}
		},

		toggleFavoriteBlock: async (id: string) => {
			try {
				set({ isLoading: true, error: null })
				await toggleFavorite(id)
				await get().fetchBlocks()
			} catch (e) {
				const error = e instanceof Error ? e.message : 'Ошибка при переключении избранного'
				set({ isLoading: false, error })
			}
		},

		// Действия для фильтров
		setSearchQuery: query => set({ searchQuery: query }),
		setSortBy: sortBy => set({ sortBy }),
		setSortOrder: sortOrder => set({ sortOrder }),
		setSelectedTags: tags => set({ selectedTags: tags }),
		toggleShowFavorites: () => set(state => ({ showFavorites: !state.showFavorites })),
		toggleShowUserBlocks: () => set(state => ({ showUserBlocks: !state.showUserBlocks })),
		toggleShowSystemBlocks: () => set(state => ({ showSystemBlocks: !state.showSystemBlocks }))
	}))

export const { Provider: ReusableBlocksProvider, useStore: useReusableBlocksStore } =
	createStoreContext(createReusableBlocksStore)
