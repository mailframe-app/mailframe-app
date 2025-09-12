import { useDebounce } from '@consta/uikit/useDebounce'
import { useEffect, useState } from 'react'

import { useStorageStore } from '@/entities/Storage'

export const useStorageSearch = () => {
	const { activeView, viewQuery, setSearchQuery } = useStorageStore()

	const currentSearch = viewQuery[activeView].search || ''
	const [localSearch, setLocalSearch] = useState(currentSearch)

	// Синхронизация поля ввода при смене вкладки/состояния поиска
	useEffect(() => {
		setLocalSearch(currentSearch)
	}, [activeView, currentSearch])

	const debouncedSetSearchQuery = useDebounce(setSearchQuery, 300)

	useEffect(() => {
		debouncedSetSearchQuery(localSearch)
	}, [localSearch, debouncedSetSearchQuery])

	const handleSearchChange = (value: string | null) => {
		setLocalSearch(value || '')
	}

	return {
		localSearch,
		handleSearchChange
	}
}
