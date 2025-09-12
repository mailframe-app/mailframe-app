import type { ContactFieldType, PaginationDto } from './base.types'

export const ContactImportStatus = {
	PROCESSING: 'PROCESSING',
	COMPLETED: 'COMPLETED',
	FAILED: 'FAILED',
	CANCELLED: 'CANCELLED',
	QUEUED: 'QUEUED'
} as const
export type ContactImportStatus =
	(typeof ContactImportStatus)[keyof typeof ContactImportStatus]

export interface CancelImportResponseDto {
	success: boolean
	message: string
}

export interface GetImportHistoryQueryDto {
	page?: number
	limit?: number
}

export interface ImportHistoryItemDto {
	id: string
	fileName: string
	status: ContactImportStatus
	totalRecords: number
	successRecords: number
	failedRecords: number
	errors: string[] | null
	createdAt: string
	updatedAt: string
}

export interface GetImportHistoryResponseDto {
	items: ImportHistoryItemDto[]
	pagination: PaginationDto
}

export interface ImportStatusResponseDto {
	id: string
	status: ContactImportStatus
	fileName: string
	totalRecords: number
	successRecords: number
	failedRecords: number
	errors: any
	createdAt: string
	updatedAt: string
}

export interface CreateNewFieldDto {
	key: string
	name: string
	fieldType: ContactFieldType
}

export interface MappingItemDto {
	fieldKey: string
	createNewField?: CreateNewFieldDto
}

export interface CreateNewGroupDto {
	name: string
	description?: string
}

export interface StartImportDto {
	mapping: Record<string, MappingItemDto>
	updateStrategy: 'insert' | 'update_mapped' | 'replace_mapped'
	createNewFields?: boolean
	restoreSoftDeleted?: boolean
	groupId?: string
	createNewGroup?: CreateNewGroupDto
	groupMode?: 'add' | 'replace'
	ignoreEmptyValues?: boolean
	valueMerge?: 'last_wins' | 'first_wins'
}

export interface UploadResponseDto {
	importId: string
	headers: string[]
}
