import { marked } from 'marked'

// Шаблоны для вставки
export const markdownTemplates = {
	table: `
| Заголовок 1 | Заголовок 2 | Заголовок 3 |
|-------------|-------------|-------------|
| Данные 1-1  | Данные 1-2  | Данные 1-3  |
| Данные 2-1  | Данные 2-2  | Данные 2-3  |
| Данные 3-1  | Данные 3-2  | Данные 3-3  |`,
	ul: `
- Элемент списка 1
- Элемент списка 2
- Элемент списка 3`,
	ol: `
1. Первый элемент
2. Второй элемент
3. Третий элемент`
}

// 1. Патчим только кастомные ссылки
function replaceStyledLinks(md: string): string {
	return md.replace(/\[([^\]]+)\]\(([^)\s]+)\)\{([^}]+)\}/g, (_m, text, url, attrs) => {
		let color: string | undefined
		let underline = false
		const attrPattern = /(\w+)="([^"]+)"|underline/g
		let match
		while ((match = attrPattern.exec(attrs))) {
			if (match[1] === 'color') color = match[2]
			if (match[0] === 'underline') underline = true
		}
		const style = [color ? `color: ${color}` : '', underline ? 'text-decoration: underline' : '']
			.filter(Boolean)
			.join('; ')
		return `<a href="${url}" style="${style}" target="_blank" rel="noopener noreferrer">${text}</a>`
	})
}

// 2. Конвертируем маркдаун в html
export const markdownToHtml = (markdown: string): string => {
	const patched = replaceStyledLinks(markdown)
	return marked.parse(patched, { breaks: true }) as string
}

// Вставляет шаблон Markdown в текст на позиции курсора
export const insertMarkdownTemplate = (
	text: string,
	template: string,
	selectionStart: number,
	selectionEnd: number
): string => {
	return text.substring(0, selectionStart) + template + text.substring(selectionEnd)
}

// Получает текущий текст из HTML-элемента
export const getTextFromElement = (element: HTMLElement): string => {
	return element.innerText
}

// Сохраняет позицию курсора
export const saveCaretPosition = (element: HTMLElement): number => {
	const selection = window.getSelection()
	if (selection && selection.rangeCount > 0) {
		const range = selection.getRangeAt(0)
		if (range.commonAncestorContainer.parentNode === element) {
			return range.startOffset
		}
	}
	return 0
}

// Восстанавливает позицию курсора
export const restoreCaretPosition = (element: HTMLElement, position: number): void => {
	const selection = window.getSelection()
	if (selection) {
		const range = document.createRange()
		const textNode = element.firstChild || element

		if (textNode.nodeType === Node.TEXT_NODE) {
			const actualPosition = Math.min(position, textNode.textContent?.length || 0)
			range.setStart(textNode, actualPosition)
			range.setEnd(textNode, actualPosition)
			selection.removeAllRanges()
			selection.addRange(range)
		}
	}
}
