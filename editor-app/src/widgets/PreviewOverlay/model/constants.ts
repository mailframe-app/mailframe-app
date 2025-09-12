import type { ViewportSize } from './types'

// Размеры для разных режимов просмотра
export const VIEWPORT_SIZES: Record<string, ViewportSize> = {
	DESKTOP: {
		width: 600,
		label: 'Десктопный вид'
	},
	MOBILE: {
		width: 375,
		label: 'Мобильный вид'
	}
}
