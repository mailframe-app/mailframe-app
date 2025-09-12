import { useEffect, useMemo, useState } from 'react'

import type { GetGroupsQueryDto, GroupsSortBy } from '@/entities/contacts'
import { CONTACTS_DEFAULT_LIMIT } from '@/entities/contacts'

export function useGroupsTableManager() {
	const [search, setSearch] = useState<string>('')
	const [debouncedSearch, setDebouncedSearch] = useState<string>('')
	useEffect(() => {
		const id = setTimeout(() => setDebouncedSearch((search || '').trim()), 400)
		return () => clearTimeout(id)
	}, [search])

	const [page, setPage] = useState<number>(1)
	const [limit, setLimit] = useState<number>(CONTACTS_DEFAULT_LIMIT)
	const [sortBy, setSortBy] = useState<GroupsSortBy | undefined>(undefined)
	const [order, setOrder] = useState<'asc' | 'desc' | undefined>(undefined)

	const params: GetGroupsQueryDto = useMemo(
		() => ({
			page,
			limit,
			search: debouncedSearch || undefined,
			sortBy,
			order
		}),
		[page, limit, debouncedSearch, sortBy, order]
	)

	return {
		search,
		setSearch,
		page,
		setPage,
		limit,
		setLimit,
		sortBy,
		setSortBy,
		order,
		setOrder,
		params
	}
}
