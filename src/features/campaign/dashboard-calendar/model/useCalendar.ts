import { useMemo, useRef, useState } from 'react'

import { useCampaignCalendar } from '@/entities/campaigns'

export function useCalendar() {
	const currentDate = new Date()
	const [selectedDate, setSelectedDate] = useState<Date>(currentDate)
	const [visibleDate, setVisibleDate] = useState<Date>(currentDate)
	const [isPopoverVisible, setIsPopoverVisible] = useState(false)
	const anchorRef = useRef<HTMLDivElement>(null)
	const buttonRef = useRef<HTMLDivElement>(null)

	const fromDate = useMemo(
		() =>
			new Date(
				Date.UTC(visibleDate.getFullYear(), visibleDate.getMonth(), 1)
			).toISOString(),
		[visibleDate]
	)
	const toDate = useMemo(
		() =>
			new Date(
				Date.UTC(
					visibleDate.getFullYear(),
					visibleDate.getMonth() + 1,
					0,
					23,
					59,
					59,
					999
				)
			).toISOString(),
		[visibleDate]
	)

	const { data: calendarData } = useCampaignCalendar({
		from: fromDate,
		to: toDate,
		view: 'events'
	})

	const handleRangeChange = (value: (Date | undefined)[] | undefined) => {
		if (value && value[0]) {
			setVisibleDate(value[0])
		}
	}

	const markedDates = useMemo(() => {
		if (!calendarData || !('items' in calendarData)) {
			return []
		}

		const dateMap = calendarData.items.reduce<Record<string, Date>>(
			(acc, event) => {
				const eventDate = new Date(event.at)
				const dateKey = `${eventDate.getFullYear()}-${String(
					eventDate.getMonth() + 1
				).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`

				if (!acc[dateKey]) {
					acc[dateKey] = eventDate
				}

				return acc
			},
			{}
		)

		return Object.values(dateMap)
	}, [calendarData])

	const eventsForSelectedDate = useMemo(() => {
		if (!calendarData || !('items' in calendarData)) return []

		const selectedDateStr = `${selectedDate.getFullYear()}-${String(
			selectedDate.getMonth() + 1
		).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`

		return calendarData.items.filter(event => {
			const eventDate = new Date(event.at)
			const eventDateStr = `${eventDate.getFullYear()}-${String(
				eventDate.getMonth() + 1
			).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`
			return eventDateStr === selectedDateStr
		})
	}, [calendarData, selectedDate])

	const handleDateChange = (
		value: Date,
		props: { e: React.MouseEvent<HTMLButtonElement> }
	) => {
		setSelectedDate(value)

		if (props.e.currentTarget) {
			buttonRef.current = props.e.currentTarget as unknown as HTMLDivElement
		}

		if (calendarData && 'items' in calendarData) {
			const selectedDateStr = `${value.getFullYear()}-${String(
				value.getMonth() + 1
			).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`

			const hasEvents = calendarData.items.some(event => {
				const eventDate = new Date(event.at)
				const eventDateStr = `${eventDate.getFullYear()}-${String(
					eventDate.getMonth() + 1
				).padStart(2, '0')}-${String(eventDate.getDate()).padStart(2, '0')}`
				return eventDateStr === selectedDateStr
			})

			setIsPopoverVisible(hasEvents)
		}
	}

	const closePopover = () => {
		setIsPopoverVisible(false)
	}

	return {
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
	}
}
