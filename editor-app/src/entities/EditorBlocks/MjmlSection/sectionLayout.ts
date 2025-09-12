/** Преобразование любых значений в пиксели */
export const toPx = (v?: string | number): number => {
	if (v == null) return 0
	if (typeof v === 'number' && Number.isFinite(v)) return Math.max(0, Math.round(v))
	const m = /([\d.]+)/.exec(String(v))
	return m ? Math.max(0, Math.round(parseFloat(m[1]))) : 0
}

/** Доступная ширина под колонки: письмо − (лев/прав. паддинги секции) − (межколоночные отступы) */
export const getAvailableWidth = (
	emailWidth: number,
	paddingLeft: string | number | undefined,
	paddingRight: string | number | undefined,
	gap: number,
	columnsCount: number
): number => {
	const totalGaps = Math.max(0, columnsCount - 1) * (Number.isFinite(gap) ? Number(gap) : 0)
	const pl = toPx(paddingLeft)
	const pr = toPx(paddingRight)
	const base = emailWidth - pl - pr - totalGaps
	return Math.max(0, base)
}

/** Текущие проценты для всех колонок (если нет — равномерно) */
export const getCurrentPercents = <T extends string | number>(
	ids: T[],
	getPercent: (id: T) => number | undefined
): number[] => {
	const N = Math.max(1, ids.length)
	const even = 100 / N
	return ids.map(id => {
		const v = getPercent(id)
		return typeof v === 'number' && isFinite(v) ? v : even
	})
}

/** Нормализуем проценты так, чтобы сумма была ровно 100 (поправка на округления) */
export const normalizePercents = (arr: number[]): number[] => {
	const sum = arr.reduce((a, b) => a + b, 0)
	if (sum === 100) return arr
	if (sum <= 0) return arr.map((_, i) => (i === arr.length - 1 ? 100 : 0))
	const scaled = arr.map(v => (v / sum) * 100)
	const sumScaled = scaled.reduce((a, b) => a + b, 0)
	scaled[scaled.length - 1] += 100 - sumScaled
	return scaled
}

/** Пропорционально пересчитывает проценты остальных колонок */
export const proportionalResize = <T extends string | number>(
	ids: T[],
	targetId: T,
	newPctRaw: number,
	getPercent: (id: T) => number | undefined
): number[] => {
	const N = ids.length
	if (N === 0) return []
	const percents = getCurrentPercents(ids, getPercent)
	const targetIdx = ids.findIndex(id => String(id) === String(targetId))
	if (targetIdx < 0) return percents

	const newPct = Math.max(0, Math.min(100, newPctRaw))
	if (N === 1) return [100]

	const othersIdx = ids.map((_, i) => i).filter(i => i !== targetIdx)
	const sumOthers = othersIdx.reduce((s, i) => s + percents[i], 0)
	const remain = Math.max(0, 100 - newPct)

	const next = [...percents]
	next[targetIdx] = newPct

	if (sumOthers <= 0) {
		const each = remain / othersIdx.length
		othersIdx.forEach(i => {
			next[i] = each
		})
	} else {
		const k = remain / sumOthers
		othersIdx.forEach(i => {
			next[i] = percents[i] * k
		})
	}

	return normalizePercents(next)
}

/** px → % (с учётом доступной ширины) */
export const pxToPercent = (px: number, availableWidth: number): number => {
	const clamped = Math.max(0, Math.min(availableWidth, px))
	return availableWidth > 0 ? (clamped / availableWidth) * 100 : 0
}

/** % → px (с учётом доступной ширины) */
export const percentToPx = (pct: number, availableWidth: number): number => {
	return Math.round((pct / 100) * Math.max(0, availableWidth))
}
