import { startOfDay, subDays } from 'date-fns'
import { useCallback, useState } from 'react'

import { PERIOD_DATE_RANGES } from '../lib/constants'
import type { AnalyticsPeriod, DateRange } from '../lib/types'

/**
 * Хук для управления состоянием аналитики (период и диапазон дат)
 */
export function useAnalyticsState() {
	const [dateRange, setDateRange] = useState<DateRange>(() => {
		const today = startOfDay(new Date())
		return [subDays(today, 6), today]
	})

	const [period, setPeriod] = useState<AnalyticsPeriod>('Неделя')

	const updateDateRange = useCallback((newPeriod: AnalyticsPeriod) => {
		const today = startOfDay(new Date())
		const daysBack = PERIOD_DATE_RANGES[newPeriod]

		setDateRange([subDays(today, daysBack), today])
		setPeriod(newPeriod)
	}, [])

	return {
		dateRange,
		period,
		setPeriod,
		updateDateRange
	}
}

/**
 * Хук для получения диапазона дат для заданного периода
 */
export function useDateRangeForPeriod(period: AnalyticsPeriod): DateRange {
	return useState<DateRange>(() => {
		const today = startOfDay(new Date())
		const daysBack = PERIOD_DATE_RANGES[period]
		return [subDays(today, daysBack), today]
	})[0]
}
