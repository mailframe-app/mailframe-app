import type { FilterItem } from './constants'
import { useReusableBlocksStore } from '@/entities/ReusableBlocks'
import { type TagResponseDto, useTagsStore } from '@/entities/Tags'

export const useFilterPopover = () => {
	const {
		sortBy,
		sortOrder,
		selectedTags,
		showFavorites,
		showUserBlocks,
		showSystemBlocks,
		setSortBy,
		setSortOrder,
		setSelectedTags,
		toggleShowFavorites,
		toggleShowUserBlocks,
		toggleShowSystemBlocks,
		fetchBlocks
	} = useReusableBlocksStore()
	const { tags = [] } = useTagsStore()

	const handleSortBySelect = (item: FilterItem) => {
		setSortBy(item.id as 'createdAt' | 'name')
		fetchBlocks()
	}

	const handleSortOrderSelect = (item: FilterItem) => {
		setSortOrder(item.id as 'asc' | 'desc')
		fetchBlocks()
	}

	const handleTagToggle = (tag: TagResponseDto) => {
		const newTags = selectedTags.includes(tag.slug)
			? selectedTags.filter(slug => slug !== tag.slug)
			: [...selectedTags, tag.slug]

		setSelectedTags(newTags)
		fetchBlocks()
	}

	const handleShowToggle = (item: FilterItem) => {
		switch (item.id) {
			case 'favorites':
				toggleShowFavorites()
				break
			case 'user':
				toggleShowUserBlocks()
				break
			case 'system':
				toggleShowSystemBlocks()
				break
		}
		fetchBlocks()
	}

	const isShowItemActive = (item: FilterItem) => {
		switch (item.id) {
			case 'favorites':
				return showFavorites
			case 'user':
				return showUserBlocks
			case 'system':
				return showSystemBlocks
			default:
				return false
		}
	}

	const resetFilters = () => {
		setSortBy('createdAt')
		setSortOrder('desc')
		setSelectedTags([])

		if (!showFavorites) toggleShowFavorites()
		if (!showUserBlocks) toggleShowUserBlocks()
		if (!showSystemBlocks) toggleShowSystemBlocks()
		fetchBlocks()
	}

	return {
		tags,
		sortBy,
		sortOrder,
		selectedTags,
		handleSortBySelect,
		handleSortOrderSelect,
		handleTagToggle,
		handleShowToggle,
		isShowItemActive,
		resetFilters
	}
}
