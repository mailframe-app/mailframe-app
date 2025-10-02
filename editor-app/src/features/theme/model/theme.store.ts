import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { getThemeCookie, setThemeCookie } from '@/shared/lib/cookieSession'

export type Theme = 'presetGpnDefault' | 'presetGpnDark' | 'presetGpnDisplay'

const defaultTheme: Theme = 'presetGpnDefault'

const getSystemTheme = (): Theme => {
	if (typeof window === 'undefined') return defaultTheme

	const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
	return prefersDark ? 'presetGpnDark' : 'presetGpnDefault'
}

const isValidTheme = (theme: any): theme is Theme => {
	return theme === 'presetGpnDefault' || theme === 'presetGpnDark' || theme === 'presetGpnDisplay'
}

interface ThemeStore {
	theme: Theme
	setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeStore>()(
	persist(
		set => ({
			theme: (isValidTheme(getThemeCookie()) ? getThemeCookie() : getSystemTheme()) as Theme,

			setTheme: (theme: Theme) => {
				// Сохраняем в куки
				setThemeCookie(theme)

				// Обновляем состояние
				set({ theme })

				// Для мгновенного применения темы
				document.documentElement.dataset.theme = theme
			}
		}),
		{
			name: 'theme-storage',
			partialize: state => ({ theme: state.theme })
		}
	)
)
