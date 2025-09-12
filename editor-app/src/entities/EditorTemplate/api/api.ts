import { apiInstance, handleApiError } from '@/shared/api'

import type { TemplateDetailDto, TemplateResponseDto, UpdateTemplateDto } from './types'

// GET /api/v1/templates/{id} - Получение шаблона
export const getTemplate = async (id: string): Promise<TemplateDetailDto> => {
	try {
		const { data } = await apiInstance.get<TemplateDetailDto>(`/v1/templates/${id}`)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// PATCH /api/v1/templates/{id} - Обновление шаблона
export const updateTemplate = async (
	id: string,
	templateData: UpdateTemplateDto
): Promise<TemplateResponseDto> => {
	try {
		const { data } = await apiInstance.patch<TemplateResponseDto>(
			`/v1/templates/${id}`,
			templateData
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
