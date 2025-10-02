import { Text } from '@consta/uikit/Text'
import { type ReactNode } from 'react'

import { formatDate, getBrowserIcon } from '@/shared/lib'

import { type SessionResponse } from '../api'

import { RemoveProvider } from './RemoveProvider'

interface SessionItemProps {
	session: SessionResponse
	isCurrentSession?: boolean
	actions?: ReactNode
}

export function SessionItem({
	session,
	isCurrentSession,
	actions
}: SessionItemProps) {
	const Icon = getBrowserIcon(session.browser)

	return (
		<div
			className='flex items-center justify-between gap-4 border-b border-[var(--color-bg-ghost)] py-4 last:border-b-0 last:pb-0'
			key={session.id}
		>
			<div className='flex items-center gap-x-4'>
				<div className='flex size-10 items-center justify-center rounded-full bg-gray-100'>
					<Icon className='size-5 text-gray-500' />
				</div>
				<div>
					<Text size='m' weight='semibold' view='primary'>
						{session.browser}, {session.os}
					</Text>
					<Text size='s' view='secondary'>
						<span className='inline-flex items-center'>
							{isCurrentSession && (
								<>
									<span className='relative mr-2 flex size-2'>
										<span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75'></span>
										<span className='relative inline-flex size-2 rounded-full bg-emerald-500'></span>
									</span>
									<span className='text-emerald-500'>Текущее устройство</span>
									<span className='mx-1'>•</span>
								</>
							)}
							<span>
								{session.city}, {session.country}
							</span>
							{!isCurrentSession && (
								<>
									<span className='mx-1'>•</span>
									<span>{formatDate(session.createdAt)}</span>
								</>
							)}
						</span>
					</Text>
				</div>
			</div>
			<div className='flex items-center gap-x-2'>
				{!isCurrentSession && <RemoveProvider id={session.id} />}
				{actions}
			</div>
		</div>
	)
}
