import { RadioGroup } from '@consta/uikit/RadioGroup'
import { addHours, addMonths, endOfDay, parseISO, startOfDay } from 'date-fns'

import type { TimeseriesBucket } from '@/entities/analytics'

export interface TimeScale {
	id: 'month-days' | 'day-hours'
	label: string
	bucket: TimeseriesBucket
}

export const TIME_SCALES: TimeScale[] = [
	{
		id: 'month-days',
		label: 'Месяц',
		bucket: 'day'
	},
	{
		id: 'day-hours',
		label: 'Первые сутки',
		bucket: 'hour'
	}
]

export const getDateRangeForScale = (
	scale: TimeScale,
	createdAt: string
): [Date, Date] => {
	const startDate = parseISO(createdAt)

	switch (scale.id) {
		case 'month-days':
			return [startOfDay(startDate), endOfDay(addMonths(startDate, 1))]
		case 'day-hours':
			return [startDate, addHours(startDate, 48)]
		default:
			return [startOfDay(startDate), endOfDay(addMonths(startDate, 1))]
	}
}

type Props = {
	value: TimeScale
	onChange: (scale: TimeScale) => void
	className?: string
}

export function TimeScaleSelector({ value, onChange, className }: Props) {
	return (
		<RadioGroup
			value={value}
			items={TIME_SCALES}
			getItemLabel={item => item.label}
			onChange={onChange}
			direction='row'
			className={className}
		/>
	)
}
