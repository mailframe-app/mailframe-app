import { apiInstance, handleApiError } from '@/shared/api'

import type {
	CreateTagDto,
	DeleteTagResponseDto,
	GetTagsResponseDto,
	TagResponseDto
} from './types'

// GET /api/v1/tags - Получение списка тегов
export const getTags = async (): Promise<GetTagsResponseDto> => {
	try {
		const { data } = await apiInstance.get<GetTagsResponseDto>('/v1/tags?type=blocks')
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /api/v1/tags - Создание нового тега
export const createTag = async (tagData: CreateTagDto): Promise<TagResponseDto> => {
	try {
		const { data } = await apiInstance.post<TagResponseDto>('/v1/tags', {
			name: tagData.name,
			type: 'block'
		})
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// DELETE /api/v1/tags/{id} - Удаление тега
export const deleteTag = async (id: string): Promise<DeleteTagResponseDto> => {
	try {
		const { data } = await apiInstance.delete<DeleteTagResponseDto>(`/v1/tags/${id}`)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
