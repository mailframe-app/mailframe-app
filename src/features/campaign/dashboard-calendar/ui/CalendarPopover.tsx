import { Popover } from '@consta/uikit/Popover'
import { Text } from '@consta/uikit/Text'
import type { RefObject } from 'react'
import { Link } from 'react-router-dom'

import { PRIVATE_ROUTES } from '@/shared/constants'

import { EventItem } from './EventItem'
import type { CalendarEventItem } from '@/entities/campaigns'

interface CalendarPopoverProps {
	events: CalendarEventItem[]
	selectedDate: Date
	anchorRef: RefObject<HTMLDivElement | null>
	buttonRef: RefObject<HTMLDivElement | null>
	isVisible: boolean
	onClose: () => void
}

const formatDate = (date: Date) => {
	const day = date.getDate()
	const dayOfWeek = date.toLocaleDateString('ru-RU', { weekday: 'long' })
	const month = date.toLocaleDateString('ru-RU', { month: 'long' })

	return {
		day,
		dayOfWeek: dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1),
		month: month.charAt(0).toUpperCase() + month.slice(1)
	}
}

export function CalendarPopover({
	events,
	selectedDate,
	anchorRef,
	buttonRef,
	isVisible,
	onClose
}: CalendarPopoverProps) {
	if (!isVisible || events.length === 0) {
		return null
	}
	const { day, dayOfWeek, month } = formatDate(selectedDate)
	const visibleEvents = events.slice(0, 4)
	const remainingEventsCount = events.length - visibleEvents.length

	return (
		// @ts-ignore - Popover has type issues in this version of Consta UI Kit
		<Popover
			direction='upStartLeft'
			spareDirection='upStartLeft'
			offset='2xs'
			onClickOutside={onClose}
			anchorRef={buttonRef.current ? buttonRef : anchorRef}
			isInteractive
			className={'z-50 !rounded-lg'}
			style={{
				backgroundColor: 'var(--color-bg-default)',
				boxShadow: '0 0 0 1px var(--color-bg-ghost)'
			}}
		>
			<div className='min-w-[360px] p-4'>
				<div
					className='mb-2 flex items-center border-b pb-2'
					style={{ borderColor: 'var(--color-bg-ghost)' }}
				>
					<Text
						size='4xl'
						weight='bold'
						as='div'
						className='mr-2'
						view='primary'
					>
						{day}
					</Text>
					<div>
						<Text size='m' weight='medium' as='div' view='primary'>
							{dayOfWeek}
						</Text>
						<Text size='s' view='secondary' as='div'>
							{month}
						</Text>
					</div>
				</div>
				<div className='flex flex-col gap-y-1'>
					{visibleEvents.map(event => (
						<EventItem key={event.id} event={event} />
					))}
				</div>
				{remainingEventsCount > 0 && (
					<Link to={PRIVATE_ROUTES.CAMPANIES}>
						<Text size='s' view='secondary' className='mt-2'>
							Еще {remainingEventsCount} событий
						</Text>
					</Link>
				)}
			</div>
		</Popover>
	)
}
