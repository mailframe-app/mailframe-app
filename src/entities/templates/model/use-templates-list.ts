import { useQuery } from '@tanstack/react-query'

import { type GetTemplatesQuery } from '../api'

import { templatesListQuery } from './queries'

export function useTemplatesList(params?: GetTemplatesQuery) {
	return useQuery(templatesListQuery(params))
}
