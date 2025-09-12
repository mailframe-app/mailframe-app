import { apiInstance, handleApiError } from '@/shared/api'

import type {
	ContactEmailStatsDto,
	GetEmailLogsQueryDto,
	GetEmailLogsResponseDto
} from './types'

// GET /api/v1/contacts/{id}/email-stats - Статистика email по контакту
export const getContactEmailStats = async (
	id: string
): Promise<ContactEmailStatsDto> => {
	try {
		const { data } = await apiInstance.get<ContactEmailStatsDto>(
			`/v1/contacts/${id}/email-stats`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// GET /api/v1/contacts/{id}/email-logs - Логи email по контакту
export const getContactEmailLogs = async (
	id: string,
	params?: GetEmailLogsQueryDto
): Promise<GetEmailLogsResponseDto> => {
	try {
		const { data } = await apiInstance.get<GetEmailLogsResponseDto>(
			`/v1/contacts/${id}/email-logs`,
			{ params }
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
