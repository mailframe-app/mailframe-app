import type { ContactFieldType } from './base.types'

export interface FieldOptionDto {
	value: string
	label: string
}

export interface FieldMetadataDto {
	options?: FieldOptionDto[]
	allowMultiple?: boolean
	disableSuggestions?: boolean
}

export interface ContactFieldDefinitionDto {
	id: string
	key: string
	name: string
	fieldType: ContactFieldType
	isRequired: boolean
	isSystem: boolean
	isVisible: boolean
	sortOrder: number
	columnWidth: number
	isResizable: boolean
	isSortable: boolean
	fieldMetadata?: FieldMetadataDto | any
}

export interface GetContactFieldsResponseDto {
	fields: ContactFieldDefinitionDto[]
}

export interface CreateFieldDto {
	name: string
	key: string
	fieldType: ContactFieldType
	isRequired?: boolean
	isVisible?: boolean
	columnWidth?: number
	fieldMetadata?: FieldMetadataDto
}

export interface CreateFieldResponseDto {
	success: boolean
	message: string
	field: {
		id: string
		name: string
		key: string
		fieldType: ContactFieldType
		isRequired: boolean
		isVisible: boolean
		sortOrder: number
		columnWidth: number
		isSystem: boolean
		fieldMetadata: FieldMetadataDto | any
	}
}

export interface DeleteFieldResponseDto {
	success: boolean
	message: string
	deletedFieldId: string
}

export interface DeletedFieldDto {
	id: string
	name: string
	key: string
	fieldType: ContactFieldType
	isRequired: boolean
	isSystem: boolean
	sortOrder: number
	columnWidth: number
	fieldMetadata: FieldMetadataDto | any
	deletedAt: string
	createdAt: string
}

export interface GetDeletedFieldsResponseDto {
	success: boolean
	deletedFields: DeletedFieldDto[]
}

export interface RestoreFieldResponseDto {
	success: boolean
	message: string
	field: {
		id: string
		name: string
		key: string
		fieldType: ContactFieldType
		isRequired: boolean
		isVisible: boolean
		sortOrder: number
		columnWidth: number
		isSystem: boolean
		fieldMetadata: FieldMetadataDto | any
	}
}

export interface PermanentDeleteFieldResponseDto {
	success: boolean
	message: string
	deletedFieldId: string
	deletedDataCount: number
}

export interface GetColumnValuesQueryDto {
	search?: string
}

export interface ColumnValueDto {
	value: string
	label: string
	count: number
}

export interface GetColumnValuesResponseDto {
	fieldKey: string
	fieldType: ContactFieldType | string
	values: ColumnValueDto[]
}

export interface ReorderFieldsDto {
	fieldIds: string[]
}

export interface ReorderedFieldDto {
	id: string
	name: string
	key: string
	sortOrder: number
}

export interface ReorderFieldsResponseDto {
	success: boolean
	message: string
	reorderedFields: ReorderedFieldDto[]
}

export interface UpdateFieldDto {
	name?: string
	key?: string
	fieldType?: ContactFieldType
	isRequired?: boolean
	isVisible?: boolean
	columnWidth?: number
	fieldMetadata?: FieldMetadataDto
}

export interface UpdateFieldResponseDto {
	success: boolean
	message: string
	field: {
		id: string
		name: string
		key: string
		fieldType: ContactFieldType
		isRequired: boolean
		isVisible: boolean
		sortOrder: number
		columnWidth: number
		isSystem: boolean
		fieldMetadata: FieldMetadataDto | any
	}
}
