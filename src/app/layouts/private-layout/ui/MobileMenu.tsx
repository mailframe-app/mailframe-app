import { Text } from '@consta/uikit/Text'
import type { Location, NavigateFunction } from 'react-router-dom'

import { BaseLogo } from '@/shared/ui'

import { appMenuItems } from '../lib/menu'
import type { AppNavbarItem } from '../lib/types'

interface MobileMenuProps {
	visible: boolean
	onClose: () => void
	navigate: NavigateFunction
	location: Location
}

export function MobileMenu({
	visible,
	onClose,
	navigate,
	location
}: MobileMenuProps) {
	if (!visible) return null

	const getItemActive = (item: AppNavbarItem): boolean => {
		if (item.target === '_blank') return false
		if (item.label === 'Настройки')
			return location.pathname.startsWith('/settings')
		if (item.id === '/') return location.pathname === '/'
		return location.pathname.startsWith(item.id)
	}

	const handleItemClick = (item: AppNavbarItem): void => {
		onClose()
		if (item.target === '_blank') {
			window.open(item.id as string, '_blank', 'noopener,noreferrer')
			return
		}
		if (item.label === 'Шаблоны') {
			navigate(`${item.id}?tab=library`)
			return
		}
		navigate(item.id as string)
	}

	return (
		<div className='fixed inset-0 z-[1000] lg:hidden'>
			<div
				className='bg-opacity-60 absolute inset-0 bg-[color:var(--color-bg-tone)]'
				onClick={onClose}
			/>
			<div
				className='absolute top-0 left-0 flex h-full w-[280px] flex-col justify-between bg-[color:var(--color-bg-default)] p-6 shadow-lg'
				style={{ boxShadow: '0 0 0 1px var(--color-bg-ghost)' }}
			>
				<div className='flex flex-col gap-2'>
					<BaseLogo size='xs' className='mb-6' />
					{appMenuItems.map((item: AppNavbarItem) => (
						<button
							key={String(item.id)}
							type='button'
							className={`flex w-full items-center rounded px-3 py-2 text-left hover:bg-[color:var(--color-control-bg-clear-hover)] ${
								getItemActive(item)
									? '!bg-[color:var(--color-control-bg-clear-checked)]'
									: ''
							}`}
							onClick={() => handleItemClick(item)}
						>
							{item.icon && (
								<item.icon size='s' view='primary' className='mr-4' />
							)}
							<Text view='primary' as='span'>
								{item.label}
							</Text>
						</button>
					))}
				</div>
				<div className='text-center'>
					<Text size='xs' view='secondary'>
						Mailframe © 2025
					</Text>
				</div>
			</div>
		</div>
	)
}
