import { DEFAULT_FONT_SIZE_PX, DEFAULT_LINE_HEIGHT } from '../../constants.editor'

export const round1 = (n: number): number => Math.round(n * 10) / 10

export const parsePx = (v?: string | number | null): number | null => {
	if (v == null) return null
	const s = String(v).trim()
	const m = /^(-?\d+(?:\.\d+)?)px$/i.exec(s)
	return m ? parseFloat(m[1]) : null
}

export const computeFontPx = (
	fontSize: string | number | undefined,
	fallback: number = DEFAULT_FONT_SIZE_PX
): number => {
	const px = parsePx(fontSize)
	return px != null ? px : fallback
}

/** Преобразует line-height (px либо unitless) в множитель, округляя до 1 знака */
export const toMultiplier = (
	lineHeight: string | number | undefined,
	fontSizePx: number,
	fallback: number = DEFAULT_LINE_HEIGHT
): number => {
	const s = String(lineHeight ?? '').trim()
	const m = /^(-?\d+(?:\.\d+)?)px$/i.exec(s)
	if (m && fontSizePx > 0) return round1(parseFloat(m[1]) / fontSizePx)
	const num = Number(s.replace(',', '.'))
	return Number.isFinite(num) ? round1(num) : fallback
}

/** Парсит значение из инпута/степпера и округляет до 1 знака */
export const parseToOneDecimal = (v: number | string | null | undefined): number | null => {
	if (v == null || v === '') return null
	const num = Number(String(v).replace(',', '.'))
	return Number.isFinite(num) ? round1(num) : null
}

/** Готовое значение для пропа: unitless строка с точкой и 1 знаком */
export const toPropLineHeight = (multiplier: number): string => multiplier.toFixed(1)
