export type AnalyticsPeriod = 'День' | 'Неделя' | 'Месяц'
export type DateRange = [Date, Date] | null
export type DateRangeDisplayFormat = 'short' | 'full'

export interface AnalyticsPageState {
	dateRange: DateRange
	period: AnalyticsPeriod
}

export interface DateRangeDisplayProps {
	dateRange: DateRange
	format?: DateRangeDisplayFormat
}

export interface AnalyticsPeriodSelectorProps {
	period: AnalyticsPeriod
	onPeriodChange: (period: AnalyticsPeriod) => void
}

export interface TimeseriesWidgetProps {
	dateRange: DateRange
	bucket?: 'day' | 'hour'
}
