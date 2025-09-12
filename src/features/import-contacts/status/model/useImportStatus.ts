import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import type { ImportStatusResponseDto } from '@/entities/contacts'
import { importStatusQuery } from '@/entities/contacts'

const REFETCH_INTERVAL = 3000

export function useImportStatus(importId: string) {
	const { data, ...query } = useQuery<ImportStatusResponseDto>({
		...importStatusQuery(importId),
		refetchInterval: query =>
			query.state.data?.status === 'PROCESSING' ||
			query.state.data?.status === 'QUEUED'
				? REFETCH_INTERVAL
				: false
	})

	const progress = useMemo(() => {
		if (!data || !data.totalRecords) return 0
		const processed = (data.successRecords || 0) + (data.failedRecords || 0)
		return Math.round((processed / data.totalRecords) * 100)
	}, [data])

	return {
		importStatus: data,
		progress,
		...query
	}
}
