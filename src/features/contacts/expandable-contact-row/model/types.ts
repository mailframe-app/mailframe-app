import type { ContactListItemDto } from '@/entities/contacts'

export interface ContactInfoRow {
	isInfo: true
	contactId: string
	contact: ContactListItemDto
}

export type TableRow = ContactListItemDto | ContactInfoRow

export const isContactInfoRow = (row: TableRow): row is ContactInfoRow =>
	'isInfo' in row && row.isInfo === true

export const isContactDto = (row: TableRow): row is ContactListItemDto =>
	!('isInfo' in row)
