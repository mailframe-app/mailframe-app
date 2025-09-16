import { Layout } from '@consta/uikit/Layout'
import { Theme as ConstaTheme } from '@consta/uikit/Theme'
import { type ReactNode, useEffect, useRef } from 'react'

import { getTheme, useTheme } from '@/features/theme'

import { ModalRoot } from '@/shared/lib/modals'
import { Toaster, useToastFromSession } from '@/shared/lib/toaster'

import { useApplayAppInterceptor } from './app-interceptor'

export function AppLoader({ children }: { children?: ReactNode }) {
	useToastFromSession()
	const { theme } = useTheme()
	const themeRef = useRef<HTMLDivElement>(null)

	useApplayAppInterceptor()

	useEffect(() => {
		if (!themeRef.current) return
		const style = getComputedStyle(themeRef.current)
		const bgColor = style.getPropertyValue('--color-bg-default') || '#fff'

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
	}, [theme])

	return (
		<ConstaTheme preset={getTheme(theme)}>
			<Layout
				direction='column'
				className='flex h-screen flex-col'
				ref={themeRef}
			>
				{children}
				<ModalRoot />
				<Toaster />
			</Layout>
		</ConstaTheme>
	)
}
