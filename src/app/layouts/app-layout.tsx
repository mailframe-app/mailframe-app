import { Layout as HeaderLayout } from '@consta/header/Layout'
import { Layout } from '@consta/uikit/Layout'
import { Outlet, useLocation } from 'react-router-dom'

import { ThemeToggle } from '@/features/theme'

import { PUBLIC_ROUTES } from '@/shared/constants'
import { BaseLogo } from '@/shared/ui'

import { ProfileWidget } from '@/entities/profile'

export function AppLayout() {
	const location = useLocation()
	const isPublicRoute = Object.values(PUBLIC_ROUTES).includes(
		location.pathname as any
	)

	return (
		<Layout direction='column' className='h-screen items-center justify-center'>
			{/* @ts-ignore */}
			<HeaderLayout
				className='children-border-b-0 h-[80px] shrink-0 select-none'
				rowCenter={{
					left: <BaseLogo size='xs' />,
					center: undefined,
					right: (
						<div className='flex h-full items-center gap-3 sm:gap-4'>
							{!isPublicRoute && (
								<div className='hidden sm:block'>
									<ProfileWidget />
								</div>
							)}
							<ThemeToggle />
						</div>
					)
				}}
			/>
			<Outlet />
		</Layout>
	)
}
