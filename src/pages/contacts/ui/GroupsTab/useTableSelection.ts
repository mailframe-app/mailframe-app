import { useCallback, useMemo, useState } from 'react'

export function useTableSelection<T extends { id: string }>(pageItems: T[]) {
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

	const currentPageIds = useMemo(
		() => pageItems.map(item => item.id),
		[pageItems]
	)

	const allOnPageSelected = useMemo(
		() =>
			currentPageIds.length > 0 &&
			currentPageIds.every(id => selectedIds.has(id)),
		[currentPageIds, selectedIds]
	)

	const toggleAllOnPage = useCallback(() => {
		setSelectedIds(prev => {
			const next = new Set(prev)
			if (allOnPageSelected) {
				currentPageIds.forEach(id => next.delete(id))
			} else {
				currentPageIds.forEach(id => next.add(id))
			}
			return next
		})
	}, [allOnPageSelected, currentPageIds])

	const toggleOne = useCallback((id: string) => {
		setSelectedIds(prev => {
			const next = new Set(prev)
			if (next.has(id)) {
				next.delete(id)
			} else {
				next.add(id)
			}
			return next
		})
	}, [])

	const clearSelection = useCallback(() => {
		setSelectedIds(new Set())
	}, [])

	return {
		selectedIds,
		allOnPageSelected,
		toggleAllOnPage,
		toggleOne,
		clearSelection
	}
}
