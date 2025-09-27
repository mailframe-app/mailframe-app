import { useEffect } from 'react'

import { useThemeStore } from '../model/theme.store'

export type { Theme } from '../model/theme.store'

export function useTheme() {
	const { theme, setTheme } = useThemeStore()

	// Обработчик для изменений системной темы
	useEffect(() => {
		const handleSystemThemeChange = (e: MediaQueryListEvent) => {
			// Проверяем, есть ли уже выбранная тема
			const currentTheme = useThemeStore.getState().theme

			// Если тема не установлена пользователем, используем системную
			if (!currentTheme) {
				const newTheme = e.matches ? 'presetGpnDark' : 'presetGpnDefault'
				setTheme(newTheme)
			}
		}

		const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
		mediaQuery.addEventListener('change', handleSystemThemeChange)

		return () => {
			mediaQuery.removeEventListener('change', handleSystemThemeChange)
		}
	}, [setTheme])

	return { theme, setTheme }
}
