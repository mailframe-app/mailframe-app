import type { AnalyticsPeriod } from './types'

export const ANALYTICS_PERIODS: readonly AnalyticsPeriod[] = [
	'День',
	'Неделя',
	'Месяц'
] as const

export const PERIOD_DATE_RANGES: Record<AnalyticsPeriod, number> = {
	День: 0,
	Неделя: 6,
	Месяц: 29
} as const

export const ANALYTICS_PERIOD_LABELS: Record<AnalyticsPeriod, string> = {
	День: 'День',
	Неделя: 'Неделя',
	Месяц: 'Месяц'
} as const
