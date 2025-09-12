import { apiInstance, handleApiError } from '@/shared/api'

import type { CreateTagRequest, GetTagsQuery, TagResponse } from './types'

// GET /v1/tags
export const getTags = async (params: GetTagsQuery): Promise<TagResponse[]> => {
	try {
		const { data } = await apiInstance.get<TagResponse[]>('/v1/tags', {
			params
		})
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /v1/tags
export const createTag = async (
	payload: CreateTagRequest
): Promise<TagResponse> => {
	try {
		const { data } = await apiInstance.post<TagResponse>('/v1/tags', payload)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// DELETE /v1/tags/{id}
export const deleteTag = async (id: string): Promise<{ success: boolean }> => {
	try {
		const { data } = await apiInstance.delete<{ success: boolean }>(
			`/v1/tags/${id}`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
