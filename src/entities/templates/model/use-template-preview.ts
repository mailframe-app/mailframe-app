import { useQuery } from '@tanstack/react-query'

import { type TemplatePreviewResponse } from '../api/types'

import { templatePreviewQuery } from './queries'

export function useTemplatePreview(
	id?: string | null,
	enabled: boolean = true
) {
	return useQuery<TemplatePreviewResponse>({
		...templatePreviewQuery(id!),
		enabled: enabled && !!id
	})
}
