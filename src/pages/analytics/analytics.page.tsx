import { DatePicker } from '@consta/uikit/DatePicker'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'
import { subDays } from 'date-fns'
import { useState } from 'react'

import { ErrorsTopWidget } from './ui/ErrorsTopWidget'
import { SummaryWidget } from './ui/SummaryWidget'
import { TimeseriesWidget } from './ui/TimeseriesWidget'

function AnalyticsPage() {
	const [dateRange, setDateRange] = useState<[Date, Date] | null>([
		subDays(new Date(), 30),
		new Date()
	])

	const handleDateChange = (value: Date | null, index: 0 | 1) => {
		const newRange: [Date | null, Date | null] = dateRange
			? [...dateRange]
			: [null, null]
		newRange[index] = value

		if (newRange[0] && newRange[1]) {
			setDateRange(newRange as [Date, Date])
		} else {
			setDateRange(null)
		}
	}

	return (
		<Layout direction='column' className='w-full'>
			<div className='mb-4'>
				<Text view='primary' size='3xl' weight='bold'>
					Аналитика
				</Text>
			</div>
			<div className='mb-8'>
				<Text as='p' size='s' view='secondary' className='mb-2'>
					Выбрать период
				</Text>
				<Layout direction='row' className='gap-4'>
					<div className='w-40'>
						<DatePicker
							type='date'
							value={dateRange?.[0]}
							onChange={v => handleDateChange(v, 0)}
							placeholder='ДД.ММ.ГГГГ'
						/>
					</div>
					<div className='w-40'>
						<DatePicker
							type='date'
							value={dateRange?.[1]}
							onChange={v => handleDateChange(v, 1)}
							placeholder='ДД.ММ.ГГГГ'
						/>
					</div>
				</Layout>
			</div>
			<Text as='h3' view='primary' size='xl' weight='semibold' className='mb-8'>
				Показатели рассылок
			</Text>
			<SummaryWidget dateRange={dateRange} />
			<Text as='h3' view='primary' size='xl' weight='semibold' className='my-8'>
				График активности подписчиков
			</Text>
			<TimeseriesWidget dateRange={dateRange} />
			{/* <Text
						as='h3'
						view='primary'
						size='xl'
						weight='semibold'
						className='my-8'
					>
						Воронка конверсии
					</Text>
			<FunnelWidget dateRange={dateRange} />
			<Text
						as='h3'
						view='primary'
						size='xl'
						weight='semibold'
						className='my-8'
					>
						Распределение вовлеченности
					</Text>
			<EngagementWidget /> */}
			<Text as='h3' view='primary' size='xl' weight='semibold' className='my-8'>
				Ошибки доставки
			</Text>
			<ErrorsTopWidget dateRange={dateRange} />
		</Layout>
	)
}

export const Component = AnalyticsPage
