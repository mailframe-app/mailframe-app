import { Card } from '@consta/uikit/Card'
import { DateTime } from '@consta/uikit/DateTime'
import { useEffect, useRef } from 'react'

import { useCalendar } from '../model/useCalendar'

import { CalendarPopover } from './CalendarPopover'

export const DashboardCalendar = () => {
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
		<div ref={anchorRef}>
			<Card
				verticalSpace='xl'
				horizontalSpace='l'
				className='m-auto !rounded-lg'
				ref={calendarRef}
			>
				<DateTime
					type='date'
					view='classic'
					value={selectedDate}
					events={markedDates}
					onChange={handleDateChange}
					currentVisibleDate={visibleDate}
				/>
			</Card>

			<CalendarPopover
				events={eventsForSelectedDate}
				selectedDate={selectedDate}
				anchorRef={anchorRef}
				buttonRef={buttonRef}
				isVisible={isPopoverVisible}
				onClose={closePopover}
			/>
		</div>
	)
}
