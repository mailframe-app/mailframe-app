import { Text } from '@consta/uikit/Text'

import { formatAnalyticsDateRange, formatTodayDate } from '../../lib/formatters'
import type { DateRangeDisplayProps } from '../../lib/types'

/**
 * Компонент отображения текущей даты и выбранного диапазона
 */
export function DateRangeDisplay({ dateRange }: DateRangeDisplayProps) {
	return (
		<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
			<div className='flex flex-col'>
				<Text view='primary' size='l' weight='semibold'>
					Сегодня
				</Text>
				<Text view='secondary' size='s'>
					{formatTodayDate()}
				</Text>
			</div>
			<div className='flex flex-col items-end gap-1 text-right'>
				<Text view='primary' size='l' weight='semibold'>
					Выбранный период
				</Text>
				<Text view='secondary' size='s'>
					{formatAnalyticsDateRange(dateRange)}
				</Text>
			</div>
		</div>
	)
}
