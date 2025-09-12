export type FilterItem = {
	id: string
	label: string
}

export const SORT_BY_ITEMS: FilterItem[] = [
	{ id: 'createdAt', label: 'По дате создания' },
	{ id: 'name', label: 'По названию' }
]

export const SORT_ORDER_ITEMS: FilterItem[] = [
	{ id: 'desc', label: 'По убыванию' },
	{ id: 'asc', label: 'По возрастанию' }
]

export const SHOW_ITEMS: FilterItem[] = [
	{ id: 'favorites', label: 'Избранное' },
	{ id: 'user', label: 'Сохраненное' },
	{ id: 'system', label: 'Библиотека' }
]
