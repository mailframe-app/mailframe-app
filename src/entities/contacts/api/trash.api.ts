import { apiInstance, handleApiError } from '@/shared/api'

import type {
	DeleteContactResponseDto,
	GetContactsQueryDto,
	GetTrashedContactsResponseDto,
	RestoreContactResponseDto
} from './types'

// GET /api/v1/contacts/trash - Получение списка контактов из корзины
export const getTrashedContacts = async (
	params?: GetContactsQueryDto
): Promise<GetTrashedContactsResponseDto> => {
	try {
		const { data } = await apiInstance.get<GetTrashedContactsResponseDto>(
			'/v1/contacts/trash',
			{ params }
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// PATCH /api/v1/contacts/trash/{id}/restore - Восстановление контакта из корзины
export const restoreTrashedContact = async (
	id: string
): Promise<RestoreContactResponseDto> => {
	try {
		const { data } = await apiInstance.patch<RestoreContactResponseDto>(
			`/v1/contacts/trash/${id}/restore`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// DELETE /api/v1/contacts/trash/{id} - Окончательное удаление контакта
export const permanentDeleteTrashedContact = async (
	id: string
): Promise<DeleteContactResponseDto> => {
	try {
		const { data } = await apiInstance.delete<DeleteContactResponseDto>(
			`/v1/contacts/trash/${id}`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
