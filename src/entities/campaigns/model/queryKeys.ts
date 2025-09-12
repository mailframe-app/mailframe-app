import { stableParams } from '@/shared/api/utils'

export const campaignsKeys = {
	all: ['campaigns'] as const,
	list: (params?: Record<string, unknown>) =>
		[...campaignsKeys.all, 'list', stableParams(params)] as const,
	detail: (id: string) => [...campaignsKeys.all, 'detail', id] as const,
	stats: (id: string, params?: Record<string, unknown>) =>
		[...campaignsKeys.all, 'stats', id, stableParams(params)] as const,
	logs: (id: string, params?: Record<string, unknown>) =>
		[...campaignsKeys.all, 'logs', id, stableParams(params)] as const,
	calendar: (params?: Record<string, unknown>) =>
		[...campaignsKeys.all, 'calendar', stableParams(params)] as const
}
