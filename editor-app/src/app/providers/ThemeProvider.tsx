import { Layout } from '@consta/uikit/Layout'
import { Theme } from '@consta/uikit/Theme'
import React, { useEffect, useRef } from 'react'

import { getTheme, useTheme } from '@/features/theme'

interface ThemeProviderProps {
	children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
	const { theme } = useTheme()
	const themeRef = useRef<HTMLDivElement>(null)

	// Применяем стили темы к документу
	useEffect(() => {
		if (!themeRef.current) return
		const style = getComputedStyle(themeRef.current)
		const bgColor = style.getPropertyValue('--color-bg-default') || '#fff'

		// Копируем CSS переменные из Consta UI в :root
		document.documentElement.style.setProperty(
			'--color-bg-stripe',
			style.getPropertyValue('--color-bg-stripe')
		)
		document.documentElement.style.setProperty(
			'--color-scroll-bg',
			style.getPropertyValue('--color-scroll-bg')
		)
		document.documentElement.style.setProperty(
			'--color-scroll-thumb',
			style.getPropertyValue('--color-scroll-thumb')
		)
		document.documentElement.style.setProperty(
			'--color-scroll-thumb-hover',
			style.getPropertyValue('--color-scroll-thumb-hover')
		)

		document.documentElement.style.background = bgColor
		document.documentElement.dataset.theme = theme
	}, [theme])

	return (
		<Theme preset={getTheme(theme)}>
			<Layout direction='column' className='flex h-screen flex-col' ref={themeRef}>
				{children}
			</Layout>
		</Theme>
	)
}
