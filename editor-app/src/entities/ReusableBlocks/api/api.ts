import { apiInstance, handleApiError } from '@/shared/api'

import type {
	BlockContentDto,
	BlockResponseDto,
	CreateBlockDto,
	DeleteBlockResponse,
	GetBlocksParams,
	GetBlocksResponseDto,
	ToggleFavoriteResponse,
	UpdateBlockDto
} from './types'

// POST /api/v1/blocks - Создание нового блока
export const createBlock = async (data: CreateBlockDto): Promise<BlockResponseDto> => {
	try {
		const response = await apiInstance.post<BlockResponseDto>('/v1/blocks', data)
		return response.data
	} catch (error) {
		throw handleApiError(error)
	}
}

// GET /api/v1/blocks - Получение списка блоков
export const getBlocks = async (params?: GetBlocksParams): Promise<GetBlocksResponseDto> => {
	try {
		const queryParams = new URLSearchParams()

		if (params?.tags && params.tags.length > 0) {
			queryParams.set('tags', params.tags.join(','))
		}

		if (params?.favoritesOnly) {
			queryParams.set('favoritesOnly', 'true')
		}

		if (params?.search) {
			queryParams.set('search', params.search)
		}

		if (params?.sortBy) {
			queryParams.set('sortBy', params.sortBy)
		}

		if (params?.sortOrder) {
			queryParams.set('sortOrder', params.sortOrder)
		}

		const queryString = queryParams.toString()
		const url = queryString ? `/v1/blocks?${queryString}` : '/v1/blocks'

		const response = await apiInstance.get<GetBlocksResponseDto>(url)
		return response.data
	} catch (error) {
		throw handleApiError(error)
	}
}

// GET /api/v1/blocks/{id}/content - Получение контента блока
export const getBlockContent = async (id: string): Promise<BlockContentDto> => {
	try {
		const response = await apiInstance.get<BlockContentDto>(`/v1/blocks/${id}/content`)
		return response.data
	} catch (error) {
		throw handleApiError(error)
	}
}

// PUT /api/v1/blocks/{id} - Обновление блока
export const updateBlock = async (id: string, data: UpdateBlockDto): Promise<BlockResponseDto> => {
	try {
		const response = await apiInstance.put<BlockResponseDto>(`/v1/blocks/${id}`, data)
		return response.data
	} catch (error) {
		throw handleApiError(error)
	}
}

// DELETE /api/v1/blocks/{id} - Удаление блока
export const deleteBlock = async (id: string): Promise<DeleteBlockResponse> => {
	try {
		await apiInstance.delete(`/v1/blocks/${id}`)
		return { success: true }
	} catch (error) {
		throw handleApiError(error)
	}
}

// POST /api/v1/blocks/{id}/favorite - Переключение избранного статуса блока
export const toggleFavorite = async (id: string): Promise<ToggleFavoriteResponse> => {
	try {
		const response = await apiInstance.post<ToggleFavoriteResponse>(`/v1/blocks/${id}/favorite`)
		return response.data
	} catch (error) {
		throw handleApiError(error)
	}
}
