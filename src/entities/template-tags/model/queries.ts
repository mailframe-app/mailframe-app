import { type UseQueryOptions, useQueryClient } from '@tanstack/react-query'

import { createTag, deleteTag, getTags } from '../api'
import type { CreateTagRequest, GetTagsQuery, TagResponse } from '../api/types'

import { tagsKeys } from './queryKeys'

export const tagsListQuery = (params: GetTagsQuery) =>
	({
		queryKey: tagsKeys.list(params as unknown as Record<string, unknown>),
		queryFn: () => getTags(params),
		staleTime: 60_000,
		gcTime: 5 * 60_000
	}) satisfies UseQueryOptions<TagResponse[]>

export const useInvalidateTags = () => {
	const queryClient = useQueryClient()
	return () => {
		queryClient.invalidateQueries({ queryKey: tagsKeys.all })
	}
}

export const useCreateTag = () => {
	const invalidateTags = useInvalidateTags()

	return async (payload: CreateTagRequest): Promise<TagResponse> => {
		const response = await createTag(payload)
		invalidateTags()
		return response
	}
}

export const useDeleteTag = () => {
	const invalidateTags = useInvalidateTags()

	return async (id: string): Promise<{ success: boolean }> => {
		const response = await deleteTag(id)
		invalidateTags()
		return response
	}
}
