import { enm, json, num, str } from './serializers'
import type { UrlSyncSchema } from './types'
import {
	CONTACTS_DEFAULT_LIMIT,
	CONTACTS_DEFAULT_PAGE
} from '@/entities/contacts'

export type SortOrder = 'asc' | 'desc'

/**
 * Создает схему синхронизации для таблиц контактов с URL-параметрами
 */
export function buildTableSchema(
	keys?: Partial<
		Record<
			| 'page'
			| 'limit'
			| 'search'
			| 'sortBy'
			| 'sortOrder'
			| 'groupId'
			| 'filters',
			boolean
		>
	>
): UrlSyncSchema {
	const use = (k: string) =>
		keys == null || keys[k as keyof typeof keys] !== false
	const schema: UrlSyncSchema = {}
	if (use('page'))
		schema.page = num({
			key: 'page',
			default: CONTACTS_DEFAULT_PAGE,
			min: 1
		})
	if (use('limit'))
		schema.limit = num({
			key: 'limit',
			default: CONTACTS_DEFAULT_LIMIT,
			oneOf: [10, 25, 50, 100]
		})
	if (use('search'))
		schema.search = str({ key: 'search', default: '', debounceMs: 400 })
	if (use('sortBy')) schema.sortBy = str({ key: 'sortBy', default: '' })
	if (use('sortOrder'))
		schema.sortOrder = enm({
			key: 'sortOrder',
			values: ['asc', 'desc'] as const
		})
	if (use('groupId')) schema.groupId = str({ key: 'groupId', default: '' })
	if (use('filters'))
		schema.filters = json<Record<string, string[]>>({
			key: 'filters',
			default: {}
		})
	return schema
}
