import {
	type UseQueryOptions,
	keepPreviousData,
	useQueryClient
} from '@tanstack/react-query'

import { showCustomToast } from '@/shared/lib'

import {
	createTemplate,
	deleteTemplate,
	duplicateTemplate,
	getTemplate,
	getTemplatePreview,
	getTemplates,
	sendTestEmail,
	toggleFavorite,
	updateTemplate
} from '../api'
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
} from '../api/types'

import { templatesKeys } from './queryKeys'

export const templatesListQuery = (params?: GetTemplatesQuery) =>
	({
		queryKey: templatesKeys.list(params as unknown as Record<string, unknown>),
		queryFn: () => getTemplates(params),
		staleTime: 60_000,
		gcTime: 5 * 60_000,
		placeholderData: keepPreviousData
	}) satisfies UseQueryOptions<GetTemplatesResponse>

export const templateDetailQuery = (id: string) =>
	({
		queryKey: templatesKeys.detail(id),
		queryFn: () => getTemplate(id),
		staleTime: 60_000,
		gcTime: 5 * 60_000
	}) satisfies UseQueryOptions<TemplateDetailResponse>

export const templatePreviewQuery = (id: string) =>
	({
		queryKey: templatesKeys.preview(id),
		queryFn: () => getTemplatePreview(id),
		staleTime: 60_000,
		gcTime: 5 * 60_000
	}) satisfies UseQueryOptions<TemplatePreviewResponse>

export const useInvalidateTemplates = () => {
	const queryClient = useQueryClient()
	return () => {
		queryClient.invalidateQueries({ queryKey: templatesKeys.all })
	}
}

export const useCreateTemplate = () => {
	const invalidateTemplates = useInvalidateTemplates()

	return async (payload: CreateTemplateRequest): Promise<TemplateListItem> => {
		const response = await createTemplate(payload)
		invalidateTemplates()
		return response
	}
}

export const useUpdateTemplate = () => {
	const invalidateTemplates = useInvalidateTemplates()

	return async (
		id: string,
		payload: UpdateTemplateRequest
	): Promise<TemplateListItem> => {
		const response = await updateTemplate(id, payload)
		invalidateTemplates()
		return response
	}
}

export const useDeleteTemplate = () => {
	const invalidateTemplates = useInvalidateTemplates()

	return async (id: string): Promise<void> => {
		try {
			await deleteTemplate(id)
			showCustomToast({
				title: 'Шаблон успешно удален!',
				type: 'success'
			})
			invalidateTemplates()
		} catch (error) {
			showCustomToast({
				title: 'Произошла ошибка при удалении шаблона.',
				type: 'error'
			})
			throw error
		}
	}
}

export const useDuplicateTemplate = () => {
	const invalidateTemplates = useInvalidateTemplates()
	return async (id: string): Promise<TemplateListItem> => {
		const response = await duplicateTemplate(id)
		invalidateTemplates()
		return response
	}
}

export const useToggleFavorite = () => {
	const invalidateTemplates = useInvalidateTemplates()

	return async (id: string): Promise<{ isFavorite: boolean }> => {
		const response = await toggleFavorite(id)
		invalidateTemplates()
		return response
	}
}

export const useSendTestEmail = () => {
	return async (
		id: string,
		payload: SendTestEmailRequest
	): Promise<SendTestEmailResponse> => {
		return sendTestEmail(id, payload)
	}
}
