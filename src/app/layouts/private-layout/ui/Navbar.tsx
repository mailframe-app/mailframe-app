import {
	Navbar,
	NavbarRail,
	cnNavbarMixFadeAnimate
} from '@consta/header/Navbar'
import { Button } from '@consta/uikit/Button'
import { Layout } from '@consta/uikit/Layout'
import { useEffect, useRef, useState } from 'react'
import type { Location, NavigateFunction } from 'react-router-dom'
import { Transition } from 'react-transition-group'

import { useLogoutConfirm } from '@/features/logout'

import { BaseLogo } from '@/shared/ui'

import { appMenuItems, logoutMenuItem } from '../lib/menu'
import type { AppNavbarItem } from '../lib/types'
import { useNavbarOpen } from '../model/use-navbar-open'

import { ArrowMenuClose, ArrowMenuOpen } from './MenuIcon'

interface PrivateLayoutNavbarProps {
	navigate: NavigateFunction
	location: Location
}

export function PrivateLayoutNavbar({
	navigate,
	location
}: PrivateLayoutNavbarProps) {
	const { isOpen: open, toggle } = useNavbarOpen()
	const [isMobile, setIsMobile] = useState(false)
	const [isSmallScreen, setIsSmallScreen] = useState(false)

	const railRef = useRef<HTMLDivElement>(null)
	const draverRef = useRef<HTMLDivElement>(null)
	const { openLogoutConfirm } = useLogoutConfirm()

	useEffect(() => {
		const checkScreenSize = () => {
			setIsMobile(window.innerWidth < 1024)
			setIsSmallScreen(window.innerWidth < 640)
		}

		checkScreenSize()
		window.addEventListener('resize', checkScreenSize)

		return () => window.removeEventListener('resize', checkScreenSize)
	}, [])

	// Скрываем сайдбар на экранах меньше 640px
	if (isSmallScreen) {
		return null
	}

	const getItemLabel = (item: AppNavbarItem) => item.label
	const getItemActive = (item: AppNavbarItem) => {
		if (item.target === '_blank') {
			return false
		}
		if (item.label === 'Настройки') {
			return location.pathname.startsWith('/settings')
		}
		if (item.id === '/') {
			return location.pathname === '/'
		}
		return location.pathname.startsWith(item.id)
	}
	const getItemIcon = (item: AppNavbarItem) => item.icon
	const onItemClick = (item: AppNavbarItem) => {
		if (item.target === '_blank') {
			window.open(item.id, '_blank', 'noopener,noreferrer')
			return
		}
		if (item.label === 'Шаблоны') {
			navigate(`${item.id}?tab=library`)
			return
		}
		navigate(item.id)
	}
	const onLogoutClick = () => {
		openLogoutConfirm()
	}

	return (
		<Layout
			direction='column'
			className='h-full w-[120px] select-none lg:w-auto'
			style={{
				backgroundColor: 'var(--color-bg-default)',
				transition: 'width var(--navbar-animate-transition-timeout)',
				position: 'relative',
				height: '100%',
				['--navbar-animate-transition-timeout' as any]: '0.3s',
				['--navbar-animate-menu-rail-width' as any]: '120px',
				['--navbar-animate-menu-draver-width' as any]: '264px',
				...(isMobile
					? {}
					: {
							['width' as any]: open
								? 'var(--navbar-animate-menu-draver-width)'
								: 'var(--navbar-animate-menu-rail-width)'
						})
			}}
		>
			{/* Мобильная версия */}
			<div className='block h-full lg:hidden'>
				<div className='flex h-full flex-col justify-between p-8'>
					<div className='flex flex-col'>
						<BaseLogo size='xs' onlyIcon />
						<div className='-mx-8 my-7 border-[var(--color-bg-border)]' />
						<NavbarRail<AppNavbarItem>
							className='!rounded-lg'
							items={appMenuItems}
							getItemLabel={() => undefined}
							getItemTooltip={getItemLabel}
							getItemActive={getItemActive}
							getItemIcon={getItemIcon}
							onItemClick={onItemClick}
						/>
					</div>
					<NavbarRail<AppNavbarItem>
						className='!rounded-lg'
						items={[logoutMenuItem]}
						getItemLabel={() => undefined}
						getItemTooltip={getItemLabel}
						getItemIcon={getItemIcon}
						onItemClick={onLogoutClick}
					/>
				</div>
			</div>

			{/* Десктопная версия */}
			<Transition in={!open} unmountOnExit timeout={300} nodeRef={railRef}>
				{animate => (
					<div
						ref={railRef}
						className={`${cnNavbarMixFadeAnimate({ animate, menu: 'rail' })} hidden h-full lg:block`}
					>
						<div className='flex h-full flex-col justify-between px-8 pt-8 pb-8'>
							<div className='flex flex-col'>
								<BaseLogo size='xs' onlyIcon />
								<div className='-mx-8 my-7 border-[var(--color-bg-border)]' />
								<NavbarRail<AppNavbarItem>
									className='!rounded-lg'
									items={appMenuItems}
									getItemLabel={() => undefined}
									getItemTooltip={getItemLabel}
									getItemActive={getItemActive}
									getItemIcon={getItemIcon}
									onItemClick={onItemClick}
								/>
							</div>
							<NavbarRail<AppNavbarItem>
								className='!rounded-lg'
								items={[logoutMenuItem]}
								getItemLabel={() => undefined}
								getItemTooltip={getItemLabel}
								getItemIcon={getItemIcon}
								onItemClick={onLogoutClick}
							/>
						</div>
					</div>
				)}
			</Transition>
			<Transition in={open} unmountOnExit timeout={300} nodeRef={draverRef}>
				{animate => (
					<div
						ref={draverRef}
						className={`${cnNavbarMixFadeAnimate({ animate, menu: 'draver' })} hidden h-full lg:block`}
					>
						<div className='flex h-full flex-col justify-between px-8 pt-8 pb-8'>
							<div className='flex flex-col'>
								<BaseLogo size='xs' />
								<div className='-mx-8 my-7 border-[var(--color-bg-border)]' />
								<Navbar<AppNavbarItem>
									className='!rounded-lg'
									items={appMenuItems}
									getItemLabel={getItemLabel}
									getItemActive={getItemActive}
									getItemIcon={getItemIcon}
									onItemClick={onItemClick}
								/>
							</div>
							<Navbar<AppNavbarItem>
								className='!rounded-lg pb-1'
								items={[logoutMenuItem]}
								getItemLabel={getItemLabel}
								getItemIcon={getItemIcon}
								onItemClick={onLogoutClick}
							/>
						</div>
					</div>
				)}
			</Transition>
			<div className='absolute top-8 right-0 hidden justify-end lg:flex'>
				<Button
					view='clear'
					form='defaultBrick'
					onlyIcon
					iconLeft={open ? ArrowMenuClose : ArrowMenuOpen}
					onClick={toggle}
					className='!h-8 !w-6'
				/>
			</div>
		</Layout>
	)
}
