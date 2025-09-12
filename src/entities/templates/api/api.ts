import { apiInstance, handleApiError } from '@/shared/api'

import type {
	CreateTemplateRequest,
	GetTemplatesQuery,
	GetTemplatesResponse,
	SendTestEmailRequest,
	SendTestEmailResponse,
	TemplateDetailResponse,
	TemplateListItem,
	TemplatePreviewResponse,
	UpdateTemplateRequest
} from './types'

// GET /v1/templates
export const getTemplates = async (
	params?: GetTemplatesQuery
): Promise<GetTemplatesResponse> => {
	try {
		let queryString = ''
		if (params) {
			const searchParams = new URLSearchParams()
			for (const key in params) {
				if (Object.prototype.hasOwnProperty.call(params, key)) {
					const value = params[key as keyof GetTemplatesQuery]
					if (Array.isArray(value)) {
						value.forEach(v => {
							if (v !== undefined && v !== null) {
								searchParams.append(key, v)
							}
						})
					} else if (value !== undefined && value !== null && value !== '') {
						searchParams.set(key, String(value))
					}
				}
			}
			queryString = searchParams.toString()
		}

		const url = `/v1/templates${queryString ? `?${queryString}` : ''}`
		const { data } = await apiInstance.get<GetTemplatesResponse>(url)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /v1/templates
export const createTemplate = async (
	payload: CreateTemplateRequest
): Promise<TemplateListItem> => {
	try {
		const { data } = await apiInstance.post<TemplateListItem>(
			'/v1/templates',
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// GET /v1/templates/{id}
export const getTemplate = async (
	id: string
): Promise<TemplateDetailResponse> => {
	try {
		const { data } = await apiInstance.get<TemplateDetailResponse>(
			`/v1/templates/${id}`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// PATCH /v1/templates/{id}
export const updateTemplate = async (
	id: string,
	payload: UpdateTemplateRequest
): Promise<TemplateListItem> => {
	try {
		const { data } = await apiInstance.patch<TemplateListItem>(
			`/v1/templates/${id}`,
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// DELETE /v1/templates/{id}
export const deleteTemplate = async (id: string): Promise<void> => {
	try {
		await apiInstance.delete(`/v1/templates/${id}`)
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /v1/templates/{id}/copy
export const duplicateTemplate = async (
	id: string
): Promise<TemplateListItem> => {
	try {
		const { data } = await apiInstance.post<TemplateListItem>(
			`/v1/templates/${id}/copy`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /v1/templates/{id}/favorite
export const toggleFavorite = async (
	id: string
): Promise<{ isFavorite: boolean }> => {
	try {
		const { data } = await apiInstance.post<{ isFavorite: boolean }>(
			`/v1/templates/${id}/favorite`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// GET /v1/templates/{id}/preview
export const getTemplatePreview = async (
	id: string
): Promise<TemplatePreviewResponse> => {
	try {
		const { data } = await apiInstance.get<TemplatePreviewResponse>(
			`/v1/templates/${id}/preview`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /v1/templates/{id}/send-test
export const sendTestEmail = async (
	id: string,
	payload: SendTestEmailRequest
): Promise<SendTestEmailResponse> => {
	try {
		const { data } = await apiInstance.post<SendTestEmailResponse>(
			`/v1/templates/${id}/send-test`,
			payload
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
