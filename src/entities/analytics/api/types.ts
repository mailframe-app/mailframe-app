export interface GetEngagementDistributionQuery {
	bins?: number
	tz?: string
}

export interface GetErrorsTopQuery {
	from?: string
	to?: string
	limit?: number
	tz?: string
}

export interface GetFunnelQuery {
	from?: string
	to?: string
	tz?: string
}

export type SendingBucket = 'hour' | 'day'

export interface GetSendingPerformanceQuery {
	bucket: SendingBucket
	from: string
	to: string
	tz?: string
}

export interface GetSummaryQuery {
	from?: string
	to?: string
	tz?: string
}

export type TimeseriesMetric = 'sent' | 'opened' | 'clicked'
export type TimeseriesBucket = 'hour' | 'day'

export interface GetTimeseriesQuery {
	metric: TimeseriesMetric
	bucket: TimeseriesBucket
	from: string
	to: string
	campaignId?: string
	tz?: string
}

export interface Period {
	from: string
	to: string
}

export interface SummaryTotals {
	recipients: number
	sent: number
	failed: number
	opens: number
	clicks: number
	unsubs: number
	campaigns: number
	contactsTotal: number
	campaignsTotal: number
}

export interface SummaryRates {
	deliveryRate: number
	openRate: number
	ctr: number
	clickToOpen: number
	unsubRate: number
	failRate: number
}

export interface GetSummaryResponse {
	period: Period
	totals: SummaryTotals
	rates: SummaryRates
}

export interface GetFunnelResponse {
	period: Period
	recipients: number
	sent: number
	opens: number
	clicks: number
	unsubs: number
	failed: number
}

export interface ErrorTopItem {
	message: string
	count: number
	share: number
	lastAt?: string | null
}

export interface GetErrorsTopResponse {
	period: Period
	items: ErrorTopItem[]
}

export interface EngagementBin {
	range: [number, number]
	count: number
}

export interface GetEngagementDistributionResponse {
	min: number
	max: number
	bins: EngagementBin[]
}

export interface TimeseriesPoint {
	t: string
	value: number
}

export interface GetTimeseriesResponse {
	metric: TimeseriesMetric
	bucket: TimeseriesBucket
	points: TimeseriesPoint[]
}

export interface SendingPerformancePoint {
	t: string
	sent: number
}

export interface GetSendingPerformanceResponse {
	avgSendRatePerMin: number
	timeseries: SendingPerformancePoint[]
}
