import { apiInstance, handleApiError } from '@/shared/api'

import type {
	CreateFieldDto,
	CreateFieldResponseDto,
	DeleteFieldResponseDto,
	GetColumnValuesQueryDto,
	GetColumnValuesResponseDto,
	GetContactFieldsResponseDto,
	GetDeletedFieldsResponseDto,
	PermanentDeleteFieldResponseDto,
	ReorderFieldsDto,
	ReorderFieldsResponseDto,
	RestoreFieldResponseDto,
	UpdateFieldDto,
	UpdateFieldResponseDto
} from './types'

// POST /api/v1/contacts/fields - Создание пользовательского поля
export const createField = async (
	payload: CreateFieldDto
): Promise<CreateFieldResponseDto> => {
	try {
		const { data } = await apiInstance.post<CreateFieldResponseDto>(
			'/v1/contacts/fields',
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// GET /api/v1/contacts/fields - Получение структуры полей контактов
export const getContactFields =
	async (): Promise<GetContactFieldsResponseDto> => {
		try {
			const { data } = await apiInstance.get<GetContactFieldsResponseDto>(
				'/v1/contacts/fields'
			)
			return data
		} catch (e: unknown) {
			throw handleApiError(e)
		}
	}

// GET /api/v1/contacts/fields/{fieldKey}/values - Уникальные значения поля для фильтров
export const getColumnValues = async (
	fieldKey: string,
	params?: GetColumnValuesQueryDto
): Promise<GetColumnValuesResponseDto> => {
	try {
		const { data } = await apiInstance.get<GetColumnValuesResponseDto>(
			`/v1/contacts/fields/${fieldKey}/values`,
			{ params }
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// PATCH /api/v1/contacts/fields/{id} - Обновление поля контакта
export const updateField = async (
	id: string,
	payload: UpdateFieldDto
): Promise<UpdateFieldResponseDto> => {
	try {
		const { data } = await apiInstance.patch<UpdateFieldResponseDto>(
			`/v1/contacts/fields/${id}`,
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// DELETE /api/v1/contacts/fields/{id} - Мягкое удаление поля контакта
export const softDeleteField = async (
	id: string
): Promise<DeleteFieldResponseDto> => {
	try {
		const { data } = await apiInstance.delete<DeleteFieldResponseDto>(
			`/v1/contacts/fields/${id}`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// GET /api/v1/contacts/fields/deleted - Получение списка удаленных полей
export const getDeletedFields =
	async (): Promise<GetDeletedFieldsResponseDto> => {
		try {
			const { data } = await apiInstance.get<GetDeletedFieldsResponseDto>(
				'/v1/contacts/fields/deleted'
			)
			return data
		} catch (e: unknown) {
			throw handleApiError(e)
		}
	}

// PUT /api/v1/contacts/fields/restore/{id} - Восстановление удаленного поля
export const restoreField = async (
	id: string
): Promise<RestoreFieldResponseDto> => {
	try {
		const { data } = await apiInstance.put<RestoreFieldResponseDto>(
			`/v1/contacts/fields/restore/${id}`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /api/v1/contacts/fields/permanent-delete/{id} - Физическое удаление поля
export const permanentDeleteField = async (
	id: string
): Promise<PermanentDeleteFieldResponseDto> => {
	try {
		const { data } = await apiInstance.post<PermanentDeleteFieldResponseDto>(
			`/v1/contacts/fields/permanent-delete/${id}`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// PATCH /api/v1/contacts/fields/reorder - Изменение порядка полей
export const reorderFields = async (
	payload: ReorderFieldsDto
): Promise<ReorderFieldsResponseDto> => {
	try {
		const { data } = await apiInstance.patch<ReorderFieldsResponseDto>(
			'/v1/contacts/fields/reorder',
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
