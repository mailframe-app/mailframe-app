/**
 * Определяет иконку файла по его MIME-типу
 * @param mimeType MIME-тип файла
 * @returns Имя иконки для использования
 */
export function getMimeTypeIcon(mimeType: string): string {
	// Определяем общий тип файла
	const type = mimeType.split('/')[0]
	const subtype = mimeType.split('/')[1]

	// Изображения
	if (type === 'image') {
		return 'image-icon'
	}

	// Документы
	if (
		mimeType === 'application/pdf' ||
		mimeType === 'application/msword' ||
		mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
		mimeType === 'application/vnd.oasis.opendocument.text'
	) {
		return 'document-icon'
	}

	// Таблицы
	if (
		mimeType === 'application/vnd.ms-excel' ||
		mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
		mimeType === 'application/vnd.oasis.opendocument.spreadsheet'
	) {
		return 'spreadsheet-icon'
	}

	// Презентации
	if (
		mimeType === 'application/vnd.ms-powerpoint' ||
		mimeType === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
		mimeType === 'application/vnd.oasis.opendocument.presentation'
	) {
		return 'presentation-icon'
	}

	// Архивы
	if (
		subtype === 'zip' ||
		subtype === 'x-rar-compressed' ||
		subtype === 'x-tar' ||
		subtype === 'x-7z-compressed'
	) {
		return 'archive-icon'
	}

	// Видео
	if (type === 'video') {
		return 'video-icon'
	}

	// Аудио
	if (type === 'audio') {
		return 'audio-icon'
	}

	// Текст
	if (type === 'text') {
		return 'text-icon'
	}

	// По умолчанию - обычный файл
	return 'file-icon'
}

/**
 * Проверяет, является ли файл изображением по его MIME-типу
 * @param mimeType MIME-тип файла
 * @returns true, если файл является изображением
 */
export function isImage(mimeType: string): boolean {
	return mimeType.startsWith('image/')
}

/**
 * Проверяет, является ли файл документом по его MIME-типу
 * @param mimeType MIME-тип файла
 * @returns true, если файл является документом
 */
export function isDocument(mimeType: string): boolean {
	return (
		mimeType === 'application/pdf' ||
		mimeType === 'application/msword' ||
		mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
		mimeType === 'application/vnd.oasis.opendocument.text' ||
		mimeType === 'text/plain'
	)
}

/**
 * Получает расширение файла из его MIME-типа
 * @param mimeType MIME-тип файла
 * @returns Расширение файла (без точки)
 */
export function getExtensionFromMimeType(mimeType: string): string {
	const commonMimeTypes: Record<string, string> = {
		'image/jpeg': 'jpg',
		'image/png': 'png',
		'image/gif': 'gif',
		'image/svg+xml': 'svg',
		'image/webp': 'webp',
		'application/pdf': 'pdf',
		'application/msword': 'doc',
		'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
		'application/vnd.ms-excel': 'xls',
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
		'application/vnd.ms-powerpoint': 'ppt',
		'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
		'text/plain': 'txt',
		'text/html': 'html',
		'text/css': 'css',
		'text/javascript': 'js',
		'application/json': 'json',
		'application/zip': 'zip',
		'application/x-rar-compressed': 'rar',
		'application/x-tar': 'tar',
		'application/x-7z-compressed': '7z',
		'video/mp4': 'mp4',
		'video/webm': 'webm',
		'audio/mpeg': 'mp3',
		'audio/wav': 'wav'
	}

	return commonMimeTypes[mimeType] || mimeType.split('/')[1] || 'unknown'
}
