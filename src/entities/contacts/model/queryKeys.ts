import { stableParams } from '@/shared/api/utils'

export const contactsKeys = {
	all: ['contacts'] as const,
	list: (params?: Record<string, unknown>) =>
		[...contactsKeys.all, 'list', stableParams(params)] as const,
	detail: (id: string) => [...contactsKeys.all, 'detail', id] as const,
	trash: (params?: Record<string, unknown>) =>
		[...contactsKeys.all, 'trash', stableParams(params)] as const,
	emailStats: (id: string) => [...contactsKeys.all, 'emailStats', id] as const,
	emailLogs: (id: string, params?: Record<string, unknown>) =>
		[...contactsKeys.all, 'emailLogs', id, stableParams(params)] as const
}

export const groupsKeys = {
	all: ['groups'] as const,
	list: (params?: Record<string, unknown>) =>
		[...groupsKeys.all, 'list', stableParams(params)] as const
}

export const fieldsKeys = {
	all: ['fields'] as const,
	list: () => [...fieldsKeys.all, 'list'] as const,
	columnValues: (fieldKey: string, params?: Record<string, unknown>) =>
		[...fieldsKeys.all, 'columnValues', fieldKey, stableParams(params)] as const
}

export const importKeys = {
	all: ['imports'] as const,
	status: (id: string) => [...importKeys.all, 'status', id] as const,
	history: (params?: Record<string, unknown>) =>
		[...importKeys.all, 'history', stableParams(params)] as const
}
