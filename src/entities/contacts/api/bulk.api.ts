import { apiInstance, handleApiError } from '@/shared/api'

import type {
	BulkCreateContactsDto,
	BulkDeleteDto,
	BulkRestoreDto,
	BulkUpdateFieldDto,
	BulkUpdateGroupsDto
} from './types'
import type { BulkOperationResponseDto } from './types/groups.type'

// POST /api/v1/contacts/bulk/update-field - Массовое обновление одного поля у контактов
export const bulkUpdateField = async (
	payload: BulkUpdateFieldDto
): Promise<BulkOperationResponseDto> => {
	try {
		const { data } = await apiInstance.post<BulkOperationResponseDto>(
			'/v1/contacts/bulk/update-field',
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /api/v1/contacts/bulk/add-to-groups - Массовое добавление контактов в группы
export const bulkAddToGroups = async (
	payload: BulkUpdateGroupsDto
): Promise<BulkOperationResponseDto> => {
	try {
		const { data } = await apiInstance.post<BulkOperationResponseDto>(
			'/v1/contacts/bulk/add-to-groups',
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /api/v1/contacts/bulk/remove-from-groups - Массовое удаление контактов из групп
export const bulkRemoveFromGroups = async (
	payload: BulkUpdateGroupsDto
): Promise<BulkOperationResponseDto> => {
	try {
		const { data } = await apiInstance.post<BulkOperationResponseDto>(
			'/v1/contacts/bulk/remove-from-groups',
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /api/v1/contacts/bulk/delete - Массовое перемещение контактов в корзину
export const bulkSoftDelete = async (
	payload: BulkDeleteDto
): Promise<BulkOperationResponseDto> => {
	try {
		const { data } = await apiInstance.post<BulkOperationResponseDto>(
			'/v1/contacts/bulk/delete',
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /api/v1/contacts/bulk/restore - Массовое восстановление контактов из корзины
export const bulkRestore = async (
	payload: BulkRestoreDto
): Promise<BulkOperationResponseDto> => {
	try {
		const { data } = await apiInstance.post<BulkOperationResponseDto>(
			'/v1/contacts/bulk/restore',
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /api/v1/contacts/bulk/create - Массовое создание контактов
export const bulkCreateContacts = async (
	payload: BulkCreateContactsDto
): Promise<BulkOperationResponseDto> => {
	try {
		const { data } = await apiInstance.post<BulkOperationResponseDto>(
			'/v1/contacts/bulk/create',
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
