import { format, isSameYear } from 'date-fns'
import { ru } from 'date-fns/locale'

import type { DateRange } from './types'

/**
 * Форматирует диапазон дат для отображения
 */
export function formatAnalyticsDateRange(dateRange: DateRange): string {
	if (!dateRange) {
		return 'Не выбрано'
	}

	const [from, to] = dateRange
	const today = new Date()

	const sameYearFrom = isSameYear(from, today)
	const sameYearTo = isSameYear(to, today)

	const fromFmt = format(from, sameYearFrom ? 'd MMMM' : "d MMMM yyyy 'года'", {
		locale: ru
	})

	const toFmt = format(
		to,
		sameYearTo ? "d MMMM yyyy 'года'" : "d MMMM yyyy 'года'",
		{ locale: ru }
	)

	return `с ${fromFmt} по ${toFmt}`
}

/**
 * Форматирует текущую дату для отображения
 */
export function formatTodayDate(): string {
	const today = new Date()
	return format(today, "d MMMM yyyy 'года'", { locale: ru })
}

/**
 * Форматирует дату для отображения в заголовке
 */
export function formatHeaderDate(date: Date): string {
	return format(date, "d MMMM yyyy 'года'", { locale: ru })
}
