import { Card } from '@consta/uikit/Card'
import { DateTime } from '@consta/uikit/DateTime'
import { Text } from '@consta/uikit/Text'
import { useEffect, useRef } from 'react'

import { useCalendar } from '../model/useCalendar'

import { CalendarPopover } from './CalendarPopover'
import './DashboardCalendar.css'

export const DashboardCalendar = ({ className }: { className?: string }) => {
	const {
		selectedDate,
		eventsForSelectedDate,
		markedDates,
		isPopoverVisible,
		handleDateChange,
		closePopover,
		anchorRef,
		buttonRef,
		visibleDate,
		handleRangeChange
	} = useCalendar()

	const calendarRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const calendarElement = calendarRef.current
		if (!calendarElement) return

		const nextButton = calendarElement.querySelector(
			'.DateTimeToggler-Button_direction_next'
		) as HTMLButtonElement
		const prevButton = calendarElement.querySelector(
			'.DateTimeToggler-Button_direction_prev'
		) as HTMLButtonElement

		const handleNextClick = () => {
			const currentDate = new Date(visibleDate)
			currentDate.setMonth(currentDate.getMonth() + 1)
			handleRangeChange([currentDate])
		}

		const handlePrevClick = () => {
			const currentDate = new Date(visibleDate)
			currentDate.setMonth(currentDate.getMonth() - 1)
			handleRangeChange([currentDate])
		}

		nextButton?.addEventListener('click', handleNextClick)
		prevButton?.addEventListener('click', handlePrevClick)

		return () => {
			nextButton?.removeEventListener('click', handleNextClick)
			prevButton?.removeEventListener('click', handlePrevClick)
		}
	}, [visibleDate, handleRangeChange])

	return (
		<Card
			verticalSpace='l'
			horizontalSpace='l'
			className={`mx-auto w-full max-w-[320px] !rounded-lg bg-[var(--color-bg-default)] ${className}`}
			ref={calendarRef}
		>
			<Text as='h2' view='primary' size='xl' weight='semibold' className='mb-2'>
				Календарь
			</Text>
			<DateTime
				type='date'
				view='classic'
				value={selectedDate}
				events={markedDates}
				onChange={handleDateChange}
				currentVisibleDate={visibleDate}
				className='mx-auto'
			/>

			<CalendarPopover
				events={eventsForSelectedDate}
				selectedDate={selectedDate}
				anchorRef={anchorRef}
				buttonRef={buttonRef}
				isVisible={isPopoverVisible}
				onClose={closePopover}
			/>
		</Card>
	)
}
