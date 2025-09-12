// Запросы
export interface CreateTagDto {
	name: string
	type?: string
}

// Основные типы ответов
export interface TagResponseDto {
	id: string
	name: string
	slug: string
	type: string
	usageCount?: number
	createdAt?: string
	updatedAt?: string
}

export type GetTagsResponseDto = TagResponseDto[]

// Ответы на удаление
export interface DeleteTagResponseDto {
	success: boolean
}
