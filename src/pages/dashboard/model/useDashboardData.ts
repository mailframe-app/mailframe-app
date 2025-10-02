import { subDays } from 'date-fns'
import { useMemo } from 'react'

import type { UseDashboardDataReturn } from '../types'

/**
 * Хук для получения данных панели управления
 *
 * @returns Объект с данными для панели управления, включая диапазон дат
 */
export const useDashboardData = (): UseDashboardDataReturn => {
	const dateRange = useMemo<[Date, Date]>(
		() => [subDays(new Date(), 30), new Date()],
		[]
	)

	return useMemo<UseDashboardDataReturn>(
		() => ({
			dateRange
		}),
		[dateRange]
	)
}
