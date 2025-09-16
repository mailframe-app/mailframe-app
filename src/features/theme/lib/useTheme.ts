import { useEffect, useState } from 'react'

import { useProfile, useUpdateProfileThemeMutation } from '@/entities/profile'

export type Theme = 'presetGpnDefault' | 'presetGpnDark' | 'presetGpnDisplay'

const defaultTheme: Theme = 'presetGpnDefault'

const getSystemTheme = (): Theme => {
	if (typeof window === 'undefined') return defaultTheme

	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
	return prefersDark ? 'presetGpnDark' : 'presetGpnDefault'
}

const isValidTheme = (theme: any): theme is Theme => {
	return (
		theme === 'presetGpnDefault' ||
		theme === 'presetGpnDark' ||
		theme === 'presetGpnDisplay'
	)
}

// Создаем глобальный объект для отслеживания изменений темы
const themeChangeEmitter = {
	listeners: new Set<() => void>(),
	subscribe(listener: () => void) {
		this.listeners.add(listener)
		return () => {
			this.listeners.delete(listener)
		}
	},
	emit() {
		this.listeners.forEach(listener => listener())
	}
}

export function useTheme() {
	const profile = useProfile()
	const updateThemeMutation = useUpdateProfileThemeMutation()
	const [localTheme, setLocalTheme] = useState<Theme>(() => {
		const storedTheme = localStorage.getItem('theme')
		return isValidTheme(storedTheme) ? storedTheme : getSystemTheme()
	})

	useEffect(() => {
		// Обработчик для изменений из других вкладок
		const handleStorageChange = (e: StorageEvent) => {
			if (e.key === 'theme' && isValidTheme(e.newValue)) {
				setLocalTheme(e.newValue as Theme)
			}
		}

		// Обработчик для изменений в текущей вкладке
		const handleLocalChange = () => {
			const storedTheme = localStorage.getItem('theme')
			if (isValidTheme(storedTheme)) {
				setLocalTheme(storedTheme)
			} else {
				setLocalTheme(getSystemTheme())
			}
		}

		// Обработчик для изменений системной темы
		const handleSystemThemeChange = (e: MediaQueryListEvent) => {
			const storedTheme = localStorage.getItem('theme')
			if (!isValidTheme(storedTheme)) {
				setLocalTheme(e.matches ? 'presetGpnDark' : 'presetGpnDefault')
			}
		}

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
		mediaQuery.addEventListener('change', handleSystemThemeChange)

		window.addEventListener('storage', handleStorageChange)
		const unsubscribe = themeChangeEmitter.subscribe(handleLocalChange)

		return () => {
			window.removeEventListener('storage', handleStorageChange)
			mediaQuery.removeEventListener('change', handleSystemThemeChange)
			unsubscribe()
		}
	}, [])

	const theme: Theme =
		(isValidTheme(profile?.theme) ? profile.theme : undefined) || localTheme

	const setTheme = (newTheme: Theme) => {
		if (profile) {
			updateThemeMutation.mutate({ theme: newTheme })
		} else {
			localStorage.setItem('theme', newTheme)
			setLocalTheme(newTheme)
			themeChangeEmitter.emit()
		}
	}

	return { theme, setTheme }
}
