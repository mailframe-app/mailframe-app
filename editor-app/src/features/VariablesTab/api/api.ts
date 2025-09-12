import { apiInstance } from '@/shared/api/api-instance'
import { handleApiError } from '@/shared/api/handle-api-error'

export type TContactFieldDto = {
	id: string
	key: string
	name: string
	fieldType: string
	isRequired: boolean
	isSystem: boolean
	isVisible: boolean
	sortOrder: number
	columnWidth?: number | null
	isResizable?: boolean
	isSortable?: boolean
	fieldMetadata?: unknown
}

export type TGetContactFieldsResponse = {
	fields: TContactFieldDto[]
}

/** GET /api/v1/contacts/fields - получить поля контакта */
export const getContactFields = async (): Promise<TContactFieldDto[]> => {
	try {
		const { data } = await apiInstance.get<TGetContactFieldsResponse>('/v1/contacts/fields')
		return data?.fields ?? []
	} catch (error) {
		throw handleApiError(error)
	}
}
