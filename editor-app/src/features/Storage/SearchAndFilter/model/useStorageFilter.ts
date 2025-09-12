import { useStorageStore } from '@/entities/Storage'

export type FilterItem = {
	id: string
	label: string
}

export const SORT_BY_ITEMS: FilterItem[] = [
	{ id: 'createdAt', label: 'По дате' },
	{ id: 'name', label: 'По названию' },
	{ id: 'size', label: 'По размеру' }
]

export const useStorageFilter = () => {
	const { activeView, viewQuery, setSortParams } = useStorageStore()
	const { sortBy, sortOrder } = viewQuery[activeView]

	const handleSortChange = (value: FilterItem | null) => {
		if (value) {
			setSortParams(value.id as 'createdAt' | 'name' | 'size', sortOrder || 'desc')
		}
	}

	const toggleSortOrder = () => {
		const newOrder = sortOrder === 'asc' ? 'desc' : 'asc'
		setSortParams(sortBy || 'createdAt', newOrder)
	}

	const resetFilters = () => {
		setSortParams('createdAt', 'desc')
	}

	return {
		sortBy,
		sortOrder,
		handleSortChange,
		toggleSortOrder,
		resetFilters
	}
}
