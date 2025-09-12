import { useMemo } from 'react'

import { buildTableSchema, useUrlSync } from '@/shared/lib/url-sync'

export type SortOrder = 'asc' | 'desc'
export type Filters = Record<string, string[] | undefined> & {
	status?: string[]
	groupIds?: string[]
}

export type UseTableUrlSyncOptions = {
	defaults?: Partial<{
		page: number
		limit: number
		search: string
		sortBy: string
		sortOrder: SortOrder
		groupId: string
		filters: Filters
	}>
	keys?: Partial<
		Record<
			| 'page'
			| 'limit'
			| 'search'
			| 'sortBy'
			| 'sortOrder'
			| 'groupId'
			| 'filters',
			boolean
		>
	>
}

/**
 * Фича для синхронизации состояния таблицы с URL-параметрами
 */
export function useTableUrlSync(opts?: UseTableUrlSyncOptions) {
	const schema = useMemo(() => buildTableSchema(opts?.keys), [opts?.keys])
	const { state, updateParams, debounced } = useUrlSync({
		schema,
		mode: 'replace',
		readOnMount: 'once',
		omitEmpty: true
	})

	// Применяем дефолты, если URL пустой
	const merged = useMemo(
		() => ({
			page: state.page ?? opts?.defaults?.page ?? 1,
			limit: state.limit ?? opts?.defaults?.limit ?? 25,
			search: state.search ?? opts?.defaults?.search ?? '',
			sortBy: state.sortBy ?? opts?.defaults?.sortBy,
			sortOrder: state.sortOrder ?? opts?.defaults?.sortOrder,
			groupId: state.groupId ?? opts?.defaults?.groupId,
			filters: state.filters ?? opts?.defaults?.filters ?? {}
		}),
		[state, opts?.defaults]
	)

	const setPage = (v: number) => updateParams({ page: v } as any)
	const setLimit = (v: number) => updateParams({ limit: v } as any)
	const setSearch = (v: string) => updateParams({ search: v } as any)
	const setSortBy = (v?: string) => updateParams({ sortBy: v || '' } as any)
	const setSortOrder = (v?: SortOrder) => updateParams({ sortOrder: v } as any)
	const setGroupId = (v?: string) => updateParams({ groupId: v || '' } as any)
	const setFilters = (v?: Filters) => updateParams({ filters: v || {} } as any)

	const toQueryParams = () => ({
		page: merged.page,
		limit: merged.limit,
		search: ((debounced as any).search ?? merged.search) || undefined,
		sortBy: merged.sortBy || undefined,
		sortOrder: merged.sortOrder || undefined,
		groupId: merged.groupId || undefined,
		filters:
			merged.filters && Object.keys(merged.filters).length
				? merged.filters
				: undefined
	})

	return {
		...merged,
		debouncedSearch: (debounced as any).search ?? merged.search,
		setPage,
		setLimit,
		setSearch,
		setSortBy,
		setSortOrder,
		setGroupId,
		setFilters,
		toQueryParams
	}
}
