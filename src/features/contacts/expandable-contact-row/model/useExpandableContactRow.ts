import { useCallback, useState } from 'react'

export const useExpandableContactRow = () => {
	const [expandedRows, setExpandedRows] = useState<string[]>([])

	const toggleRow = useCallback((id: string) => {
		setExpandedRows(prev =>
			prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
		)
	}, [])

	const closeRow = useCallback((id: string) => {
		setExpandedRows(prev => prev.filter(rowId => rowId !== id))
	}, [])

	const closeAllRows = useCallback(() => {
		setExpandedRows([])
	}, [])

	return {
		expandedRows,
		toggleRow,
		closeRow,
		closeAllRows
	}
}
