import { apiInstance } from '@/shared/api/api-instance'
import { handleApiError } from '@/shared/api/handle-api-error'

import type { SendTestEmailDto, SendTestEmailResponseDto, TemplateDto } from './types'

// DELETE /api/v1/templates/{id} - Удаление шаблона
export const deleteTemplate = async (id: string): Promise<void> => {
	try {
		await apiInstance.delete(`/v1/templates/${id}`)
	} catch (error) {
		throw handleApiError(error)
	}
}

// POST /api/v1/templates/{id}/copy - Дублирование шаблона
export const duplicateTemplate = async (id: string): Promise<TemplateDto> => {
	try {
		const { data } = await apiInstance.post<TemplateDto>(`/v1/templates/${id}/copy`)
		return data
	} catch (error) {
		throw handleApiError(error)
	}
}

// POST /api/v1/templates/{id}/send-test - Отправка тестового письма
export const sendTestEmail = async (
	id: string,
	emailData: SendTestEmailDto
): Promise<SendTestEmailResponseDto> => {
	try {
		const { data } = await apiInstance.post<SendTestEmailResponseDto>(
			`/v1/templates/${id}/send-test`,
			emailData
		)
		return data
	} catch (error) {
		throw handleApiError(error)
	}
}
