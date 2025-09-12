import { stableParams } from '@/shared/api/utils'

export const analyticsKeys = {
	all: ['analytics'] as const,
	errorsTop: (params?: Record<string, unknown>) =>
		[...analyticsKeys.all, 'errorsTop', stableParams(params)] as const,
	funnel: (params?: Record<string, unknown>) =>
		[...analyticsKeys.all, 'funnel', stableParams(params)] as const,
	summary: (params?: Record<string, unknown>) =>
		[...analyticsKeys.all, 'summary', stableParams(params)] as const,
	timeseries: (params?: Record<string, unknown>) =>
		[...analyticsKeys.all, 'timeseries', stableParams(params)] as const,
	engagementDistribution: (params?: Record<string, unknown>) =>
		[
			...analyticsKeys.all,
			'engagementDistribution',
			stableParams(params)
		] as const,
	sendingPerformance: (params?: Record<string, unknown>) =>
		[...analyticsKeys.all, 'sendingPerformance', stableParams(params)] as const
}
