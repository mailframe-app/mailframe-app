// Отправка тестового письма
export interface SendTestEmailDto {
	recipientEmail: string
	subject?: string
	testVariables?: Record<string, string>
}

// Ответ от сервера после отправки тестового письма
export interface SendTestEmailResponseDto {
	success: boolean
	message: string
}

// Типы для шаблонов
export interface TemplateDto {
	id: string
	name: string
	previewUrl?: string
	createdAt: string
	updatedAt: string
	isFavorite: boolean
	isOwner: boolean
	isLibrary: boolean
	isSystem: boolean
	tags: Array<{
		id: string
		name: string
		slug: string
	}>
}
