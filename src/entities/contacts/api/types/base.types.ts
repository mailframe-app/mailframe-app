export const ContactStatus = {
	ACTIVE: 'ACTIVE',
	UNSUBSCRIBED: 'UNSUBSCRIBED',
	BOUNCED: 'BOUNCED',
	SPAM: 'SPAM'
} as const
export type ContactStatus = (typeof ContactStatus)[keyof typeof ContactStatus]

export const ContactFieldType = {
	TEXT: 'TEXT',
	EMAIL: 'EMAIL',
	PHONE: 'PHONE',
	URL: 'URL',
	DATE: 'DATE',
	NUMBER: 'NUMBER',
	TEXTAREA: 'TEXTAREA',
	SELECT: 'SELECT'
} as const
export type ContactFieldType =
	(typeof ContactFieldType)[keyof typeof ContactFieldType]

export interface ContactGroupSummaryDto {
	id: string
	name: string
	color: string | null
}

export interface ContactFieldResponseDto {
	fieldKey: string
	fieldName: string
	fieldType: ContactFieldType
	value: string | null
}

export interface ContactResponseDto {
	id: string
	email: string
	status: ContactStatus
	engagementScore: number
	lastActivityAt: string | null
	createdAt: string
	updatedAt: string
	fields: ContactFieldResponseDto[]
	groups: ContactGroupSummaryDto[]
}

export interface CreateContactResponseDto {
	success: boolean
	message: string
	contact: ContactResponseDto
}

export interface ContactFieldValueDto {
	fieldKey: string
	value: string
}

export interface CreateContactDto {
	email: string
	status?: ContactStatus
	fields?: ContactFieldValueDto[]
	groupIds?: string[]
}

export interface DeleteContactResponseDto {
	success: boolean
	message: string
}

export interface GetContactsQueryDto {
	page?: number
	limit?: number
	search?: string
	sortBy?: string
	sortOrder?: 'asc' | 'desc'
	groupId?: string
	filters?: string
}

export interface ContactListItemDto {
	id: string
	email: string
	status: ContactStatus
	[key: string]: unknown
}

export interface PaginationDto {
	page: number
	limit: number
	total: number
	totalPages: number
}

export interface GetContactsResponseDto {
	contacts: ContactListItemDto[]
	pagination: PaginationDto
}

export interface UpdateContactFieldDto {
	fieldKey: string
	value: string
}

export interface UpdateContactDto {
	email?: string
	status?: ContactStatus
	fields?: UpdateContactFieldDto[]
	groupIds?: string[]
}

export interface UpdateContactResponseDto {
	success: boolean
	message: string
	contact: ContactResponseDto
}

export interface TrashedContactListItemDto {
	id: string
	email: string
	deletedAt: string
}

export interface GetTrashedContactsResponseDto {
	contacts: TrashedContactListItemDto[]
	pagination: PaginationDto
}

export interface RestoreContactResponseDto {
	success: boolean
	message: string
	restoredContactId: string
}

export interface PermanentDeleteResponseDto {
	success: boolean
	message: string
}
