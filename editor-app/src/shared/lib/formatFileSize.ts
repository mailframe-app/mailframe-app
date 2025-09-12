/**
 * Форматирует размер файла в человекочитаемый формат
 * @param bytes Размер в байтах
 * @param decimals Количество знаков после запятой
 * @returns Отформатированный размер с единицами измерения
 */
export function formatFileSize(bytes: number, decimals = 2): string {
	if (bytes === 0) return '0 Б'

	const k = 1024
	const dm = decimals < 0 ? 0 : decimals
	const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ', 'ЭБ', 'ЗБ', 'ЙБ']

	const i = Math.floor(Math.log(bytes) / Math.log(k))

	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
