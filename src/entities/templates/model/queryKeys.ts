import { stableParams } from '@/shared/api/utils'

export const templatesKeys = {
	all: ['templates'] as const,
	list: (params?: Record<string, unknown>) =>
		[...templatesKeys.all, 'list', stableParams(params)] as const,
	detail: (id: string) => [...templatesKeys.all, 'detail', id] as const,
	preview: (id: string) => [...templatesKeys.all, 'preview', id] as const
}
