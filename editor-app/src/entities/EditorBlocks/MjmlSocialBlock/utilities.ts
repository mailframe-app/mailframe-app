import { arrayMove } from '@dnd-kit/sortable'

import type { SocialItem } from './MjmlSocialBlock.types'

/** Генератор id */
export const createId = () => Math.random().toString(36).slice(2)

/** Новый элемент соцсети по умолчанию */
export const makeSocialItem = (defaults?: Partial<SocialItem>): SocialItem => ({
	id: createId(),
	name: 'Social',
	href: '',
	src: '',
	alt: '',
	...defaults
})

/** Безопасное ограничение значения чисел */
export const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n))

/** Корректный индекс выбранного элемента */
export const getSafeIndex = (selectedIndex: number, items: SocialItem[]) =>
	typeof selectedIndex === 'number' && selectedIndex >= 0 && selectedIndex < items.length
		? selectedIndex
		: -1

/** Удалить элемент по индексу и вернуть новые items + скорректированный selectedIndex */
export const removeItemAt = (items: SocialItem[], removeIndex: number, selectedIndex: number) => {
	if (removeIndex < 0 || removeIndex >= items.length) {
		return { items, selectedIndex }
	}
	const next = items.filter((_, i) => i !== removeIndex)

	let nextSel = selectedIndex
	if (selectedIndex === removeIndex) {
		nextSel = next.length ? Math.min(removeIndex, next.length - 1) : -1
	} else if (removeIndex < selectedIndex) {
		nextSel = selectedIndex - 1
	}

	return { items: next, selectedIndex: nextSel }
}

/** Патч элемента по индексу (иммутабельно) */
export const patchItemAt = (items: SocialItem[], index: number, patch: Partial<SocialItem>) => {
	if (index < 0 || index >= items.length) return items
	const next = [...items]
	next[index] = { ...next[index], ...patch }
	return next
}

/** Перестановка элементов с сохранением корректного selectedIndex */
export const reorderWithSelection = (
	items: SocialItem[],
	oldIndex: number,
	newIndex: number,
	selectedIndex: number
) => {
	const next = arrayMove(items, oldIndex, newIndex)

	let nextSel = selectedIndex
	if (selectedIndex >= 0) {
		if (selectedIndex === oldIndex) nextSel = newIndex
		else if (oldIndex < selectedIndex && newIndex >= selectedIndex) nextSel = selectedIndex - 1
		else if (oldIndex > selectedIndex && newIndex <= selectedIndex) nextSel = selectedIndex + 1
	}

	return { items: next, selectedIndex: nextSel }
}

/** Утилита-предикат для подсветки пустого URL (по вашему ТЗ — пустая строка) */
export const isUrlEmpty = (s: string | undefined | null) => !String(s ?? '').trim()
