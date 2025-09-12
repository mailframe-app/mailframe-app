import type { ContactFieldValueDto } from './base.types'

// Используется для передачи полей контакта при массовом создании
export type ContactFieldDto = ContactFieldValueDto

export interface ContactDataDto {
	email: string
	fields?: ContactFieldDto[]
}

// Отдельный тип для создания новой группы в контексте импорта/массовых операций (включает color)
export interface BulkCreateNewGroupDto {
	name: string
	description?: string
	color?: string
}

// Массовое создание контактов
export interface BulkCreateContactsDto {
	contacts: ContactDataDto[]
	createNewFields?: boolean
	groupId?: string
	createNewGroup?: BulkCreateNewGroupDto
}

// Массовое удаление контактов (в корзину)
export interface BulkDeleteDto {
	contactIds: string[]
}

// Массовое восстановление контактов из корзины
export interface BulkRestoreDto {
	contactIds: string[]
}

// Массовое обновление одного поля у набора контактов
export interface BulkUpdateFieldDto {
	contactIds: string[]
	fieldKey: string
	value: string
}

// Массовое добавление/удаление контактов в/из групп
export interface BulkUpdateGroupsDto {
	contactIds: string[]
	groupIds: string[]
}
