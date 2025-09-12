import { apiInstance, handleApiError } from '@/shared/api'

import type {
	CancelImportResponseDto,
	GetImportHistoryQueryDto,
	GetImportHistoryResponseDto,
	ImportStatusResponseDto,
	StartImportDto,
	UploadResponseDto
} from './types'

// POST /api/v1/contacts/import/upload - Загрузка файла импорта
export const uploadImportFile = async (
	formData: FormData
): Promise<UploadResponseDto> => {
	try {
		const { data } = await apiInstance.post<UploadResponseDto>(
			'/v1/contacts/import/upload',
			formData,
			{
				headers: { 'Content-Type': 'multipart/form-data' }
			}
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /api/v1/contacts/import/{id}/start - Запуск процесса импорта
export const startImport = async (
	id: string,
	payload: StartImportDto
): Promise<{ message: string; importId: string }> => {
	try {
		const { data } = await apiInstance.post<{
			message: string
			importId: string
		}>(`/v1/contacts/import/${id}/start`, payload)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// GET /api/v1/contacts/import/{id}/status - Статус и прогресс импорта
export const getImportStatus = async (
	id: string
): Promise<ImportStatusResponseDto> => {
	try {
		const { data } = await apiInstance.get<ImportStatusResponseDto>(
			`/v1/contacts/import/${id}/status`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// GET /api/v1/contacts/import - История импортов
export const getImportHistory = async (
	params?: GetImportHistoryQueryDto
): Promise<GetImportHistoryResponseDto> => {
	try {
		const { data } = await apiInstance.get<GetImportHistoryResponseDto>(
			'/v1/contacts/import/history',
			{ params }
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /api/v1/contacts/import/{id}/cancel - Отмена сессии импорта
export const cancelImport = async (
	id: string
): Promise<CancelImportResponseDto> => {
	try {
		const { data } = await apiInstance.post<CancelImportResponseDto>(
			`/v1/contacts/import/${id}/cancel`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
