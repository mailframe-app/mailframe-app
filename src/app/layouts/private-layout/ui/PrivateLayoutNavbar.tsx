import {
	Navbar,
	NavbarRail,
	cnNavbarMixFadeAnimate
} from '@consta/header/Navbar'
import { IconArrowNext } from '@consta/icons/IconArrowNext'
import { IconArrowPrevious } from '@consta/icons/IconArrowPrevious'
import { Button } from '@consta/uikit/Button'
import { Layout } from '@consta/uikit/Layout'
import { useRef } from 'react'
import type { Location, NavigateFunction } from 'react-router-dom'
import { Transition } from 'react-transition-group'

import { useLogoutConfirm } from '@/features/logout'

import { appMenuItems, logoutMenuItem } from '../lib/menu'
import type { AppNavbarItem } from '../lib/types'
import { useNavbarOpen } from '../model/use-navbar-open'

interface PrivateLayoutNavbarProps {
	navigate: NavigateFunction
	location: Location
}

export function PrivateLayoutNavbar({
	navigate,
	location
}: PrivateLayoutNavbarProps) {
	const { isOpen: open, toggle } = useNavbarOpen()

	const railRef = useRef<HTMLDivElement>(null)
	const draverRef = useRef<HTMLDivElement>(null)
	const { openLogoutConfirm } = useLogoutConfirm()

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
			className='h-full select-none'
			style={{
				backgroundColor: 'var(--color-bg-default)',
				transition: 'width var(--navbar-animate-transition-timeout)',
				position: 'relative',
				height: '100%',
				// CSS vars for animation and widths
				['--navbar-animate-transition-timeout' as any]: '0.3s',
				['--navbar-animate-menu-rail-width' as any]: '120px',
				// keep previous width ~ w-80 (20rem = 320px)
				['--navbar-animate-menu-draver-width' as any]: '320px',
				// current width based on open state
				['width' as any]: open
					? 'var(--navbar-animate-menu-draver-width)'
					: 'var(--navbar-animate-menu-rail-width)'
			}}
		>
			<Transition in={!open} unmountOnExit timeout={300} nodeRef={railRef}>
				{animate => (
					<div
						ref={railRef}
						className={`${cnNavbarMixFadeAnimate({ animate, menu: 'rail' })} h-full`}
					>
						<div className='flex h-full flex-col justify-between px-8 py-8'>
							<NavbarRail<AppNavbarItem>
								className='!rounded-l'
								items={appMenuItems}
								getItemLabel={() => undefined}
								getItemTooltip={getItemLabel}
								getItemActive={getItemActive}
								getItemIcon={getItemIcon}
								onItemClick={onItemClick}
							/>
							<NavbarRail<AppNavbarItem>
								className='!rounded-l'
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
						className={`${cnNavbarMixFadeAnimate({ animate, menu: 'draver' })} h-full`}
					>
						<div className='flex h-full flex-col justify-between px-8 py-8'>
							<Navbar<AppNavbarItem>
								className='!rounded-l'
								items={appMenuItems}
								getItemLabel={getItemLabel}
								getItemActive={getItemActive}
								getItemIcon={getItemIcon}
								onItemClick={onItemClick}
							/>
							<Navbar<AppNavbarItem>
								className='!rounded-l pb-1'
								items={[logoutMenuItem]}
								getItemLabel={getItemLabel}
								getItemIcon={getItemIcon}
								onItemClick={onLogoutClick}
							/>
						</div>
					</div>
				)}
			</Transition>
			<div className='absolute right-0 bottom-10 flex justify-end'>
				<Button
					view='clear'
					form='round'
					onlyIcon
					iconLeft={open ? IconArrowPrevious : IconArrowNext}
					onClick={toggle}
				/>
			</div>
		</Layout>
	)
}
