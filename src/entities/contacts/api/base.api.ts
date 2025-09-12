import { apiInstance, handleApiError } from '@/shared/api'

import type {
	ContactResponseDto,
	CreateContactDto,
	CreateContactResponseDto,
	DeleteContactResponseDto,
	GetContactsQueryDto,
	GetContactsResponseDto,
	UpdateContactDto,
	UpdateContactResponseDto
} from './types'

// POST /api/v1/contacts - Создание нового контакта
export const createContact = async (
	payload: CreateContactDto
): Promise<CreateContactResponseDto> => {
	try {
		const { data } = await apiInstance.post<CreateContactResponseDto>(
			'/v1/contacts',
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// GET /api/v1/contacts - Получение списка контактов
export const getContacts = async (
	params?: GetContactsQueryDto
): Promise<GetContactsResponseDto> => {
	try {
		const { data } = await apiInstance.get<GetContactsResponseDto>(
			'/v1/contacts',
			{ params }
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// GET /api/v1/contacts/{id} - Получение контакта по ID
export const getContactById = async (
	id: string
): Promise<ContactResponseDto> => {
	try {
		const { data } = await apiInstance.get<ContactResponseDto>(
			`/v1/contacts/${id}`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// PATCH /api/v1/contacts/{id} - Обновление контакта
export const updateContact = async (
	id: string,
	payload: UpdateContactDto
): Promise<UpdateContactResponseDto> => {
	try {
		const { data } = await apiInstance.patch<UpdateContactResponseDto>(
			`/v1/contacts/${id}`,
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// DELETE /api/v1/contacts/{id} - Перемещение контакта в корзину
export const deleteContact = async (
	id: string
): Promise<DeleteContactResponseDto> => {
	try {
		const { data } = await apiInstance.delete<DeleteContactResponseDto>(
			`/v1/contacts/${id}`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
