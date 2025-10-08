import { Layout as HeaderLayout } from '@consta/header/Layout'
import { IconHamburger } from '@consta/icons/IconHamburger'
import { Button } from '@consta/uikit/Button'
import { Layout } from '@consta/uikit/Layout'
import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useTheme } from '@/features/theme'

import { ProfileWidget } from '@/entities/profile'
import { MobileMenu } from './MobileMenu'
import { PrivateLayoutNavbar } from './Navbar'

export function PrivateLayout() {
	const navigate = useNavigate()
	const location = useLocation()
	const [isSmallScreen, setIsSmallScreen] = useState(false)
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const { theme } = useTheme()

	useEffect(() => {
		const checkScreenSize = () => {
			setIsSmallScreen(window.innerWidth < 640)
		}

		checkScreenSize()
		window.addEventListener('resize', checkScreenSize)

		return () => window.removeEventListener('resize', checkScreenSize)
	}, [])

	return (
		<Layout
			direction='row'
			className='h-full w-full overflow-x-hidden overflow-y-auto'
		>
			<MobileMenu
				visible={mobileMenuOpen}
				onClose={() => setMobileMenuOpen(false)}
				navigate={navigate}
				location={location}
			/>
			<PrivateLayoutNavbar navigate={navigate} location={location} />
			<Layout
				direction='column'
				flex={1}
				className='scroll-inset overflow-y-auto'
				style={{
					backgroundColor:
						theme === 'presetGpnDefault' ? '#F8FAFC' : 'var(--color-bg-stripe)'
				}}
			>
				{/* @ts-ignore */}
				<HeaderLayout
					className='children-border-b-0 h-[80px] shrink-0 select-none'
					rowCenter={{
						left: isSmallScreen ? (
							<div className='flex h-full items-center'>
								<Button
									view='clear'
									onlyIcon
									style={{
										scale: 1.1
									}}
									iconLeft={IconHamburger}
									onClick={() => setMobileMenuOpen(true)}
								/>
							</div>
						) : undefined,
						center: undefined,
						right: (
							<div className='flex h-full items-center gap-3 sm:gap-4'>
								<div className='block'>
									<ProfileWidget />
								</div>
							</div>
						)
					}}
				/>
				<Layout direction='column' className='items-center p-7'>
					<Outlet />
				</Layout>
			</Layout>
		</Layout>
	)
}
