import { IconExit } from '@consta/icons/IconExit'
import { IconQuestion } from '@consta/icons/IconQuestion'
import { IconSettings } from '@consta/icons/IconSettings'
import { Popover } from '@consta/uikit/Popover'
import { Text } from '@consta/uikit/Text'
import { User } from '@consta/uikit/User'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useLogoutConfirm } from '@/features/logout'
import { ThemeToggle } from '@/features/theme'

import { PRIVATE_ROUTES, PUBLIC_ROUTES } from '@/shared/constants'

import styles from './ProfileWidget.module.css'
import { useProfile } from '@/entities/profile'

export function ProfileWidget() {
	const currentUser = useProfile()
	const anchorRef = useRef<HTMLDivElement>(null)
	const [isPopoverVisible, setIsPopoverVisible] = useState(false)
	const navigate = useNavigate()
	const { openLogoutConfirm } = useLogoutConfirm()

	if (!currentUser) {
		return null
	}

	const wrapperClasses = ['mt-1', 'select-none']
	if (currentUser.avatar) {
		wrapperClasses.push(styles.wrapper)
	}

	return (
		<div className={wrapperClasses.join(' ')}>
			<div ref={anchorRef} onClick={() => setIsPopoverVisible(v => !v)}>
				<User
					avatarUrl={currentUser?.avatar ?? undefined}
					name={currentUser?.displayName}
					size='l'
					withArrow
					info={currentUser?.organization ?? ''}
					status={currentUser?.isEmailVerified ? undefined : 'out'}
				/>
			</div>
			{isPopoverVisible && (
				//@ts-ignore
				<Popover
					direction='downStartRight'
					offset='2xs'
					onClickOutside={() => setIsPopoverVisible(false)}
					anchorRef={anchorRef}
					className='min-w-[220px] rounded-lg p-2'
					style={{
						zIndex: 1000,
						backgroundColor: 'var(--color-bg-default)',
						boxShadow: '0 0 0 1px var(--color-bg-ghost)'
					}}
				>
					<div>
						<div className='flex justify-center py-2'>
							<ThemeToggle />
						</div>
						<div
							className='my-1 h-[1px]'
							style={{ backgroundColor: 'var(--color-bg-ghost)' }}
						/>
						<button
							type='button'
							className='flex w-full items-center gap-x-2 rounded px-2 py-2 hover:bg-[var(--color-control-bg-clear-hover)]'
							onClick={() => {
								setIsPopoverVisible(false)
								navigate(PRIVATE_ROUTES.PROFILE)
							}}
						>
							<IconSettings size='s' view='primary' />
							<Text view='primary' size='m' as='span'>
								Настройка профиля
							</Text>
						</button>
						<button
							type='button'
							className='flex w-full items-center gap-x-2 rounded px-2 py-2 hover:bg-[var(--color-control-bg-clear-hover)]'
							onClick={() => {
								setIsPopoverVisible(false)
								window.open(PUBLIC_ROUTES.DOCS, '_blank')
							}}
						>
							<IconQuestion size='s' view='primary' />
							<Text view='primary'>Помощь</Text>
						</button>
						<div
							className='my-1 h-[1px]'
							style={{ backgroundColor: 'var(--color-bg-ghost)' }}
						/>
						<button
							type='button'
							className='flex w-full items-center gap-x-2 rounded px-2 py-2 text-[var(--color-typo-alert)] hover:bg-[var(--color-control-bg-clear-hover)]'
							onClick={() => {
								setIsPopoverVisible(false)
								openLogoutConfirm()
							}}
						>
							<IconExit size='s' />
							<Text as='span'>Выйти</Text>
						</button>
					</div>
				</Popover>
			)}
		</div>
	)
}
