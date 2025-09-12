import { stableParams } from '@/shared/api/utils'

export const tagsKeys = {
	all: ['tags'] as const,
	list: (params?: Record<string, unknown>) =>
		[...tagsKeys.all, 'list', stableParams(params)] as const,
	detail: (id: string) => [...tagsKeys.all, 'detail', id] as const
}
