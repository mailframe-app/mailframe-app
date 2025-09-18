import { Card } from '@consta/uikit/Card'
import { ChoiceGroup } from '@consta/uikit/ChoiceGroup'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'
import { format, isSameYear, startOfDay, subDays } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useState } from 'react'

import { ErrorsTopWidget } from './ui/ErrorsTopWidget'
import { FunnelWidget } from './ui/FunnelWidget'
import { TimeseriesWidget } from './ui/TimeseriesWidget'

type Period = 'День' | 'Неделя' | 'Месяц'

function AnalyticsPage() {
	const [dateRange, setDateRange] = useState<[Date, Date] | null>([
		subDays(new Date(), 7),
		new Date()
	])

	const periods: Period[] = ['День', 'Неделя', 'Месяц']
	const [period, setPeriod] = useState<Period>('Неделя')

	const updateRangeForPeriod = (p: Period) => {
		const today = startOfDay(new Date())
		switch (p) {
			case 'День':
				setDateRange([today, today])
				break
			case 'Неделя':
				setDateRange([subDays(today, 6), today])
				break
			case 'Месяц':
				setDateRange([subDays(today, 29), today])
				break
		}
	}

	return (
		<Layout direction='column' className='w-full'>
			<div className='mb-7 flex items-center justify-between'>
				<div className='flex flex-col'>
					<Text
						as='h1'
						view='primary'
						size='xl'
						weight='semibold'
						className='leading-6'
					>
						Аналитика
					</Text>
					<Text as='p' view='secondary' size='s'>
						Выберите период и посмотрите статистику рассылок.
					</Text>
				</div>
				<div className='flex items-center justify-center'>
					<ChoiceGroup<Period>
						items={periods}
						value={period}
						onChange={p => {
							setPeriod(p)
							updateRangeForPeriod(p)
						}}
						getItemLabel={item => item}
						name='analytics-period'
					/>
				</div>
			</div>
			<Card
				verticalSpace='xl'
				horizontalSpace='xl'
				className='mb-6 !rounded-xl bg-[var(--color-bg-default)]'
			>
				<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
					<div className='flex flex-col'>
						<Text view='primary' size='l' weight='semibold'>
							Сегодня
						</Text>
						{(() => {
							const today = new Date()
							const todayStr = format(today, "d MMMM yyyy 'года'", {
								locale: ru
							})
							return (
								<Text view='secondary' size='s'>
									{todayStr}
								</Text>
							)
						})()}
					</div>
					<div className='flex flex-col items-end gap-1 text-right'>
						<Text view='primary' size='l' weight='semibold'>
							Выбранный период
						</Text>
						{(() => {
							const today = new Date()
							if (!dateRange) {
								return (
									<Text view='secondary' size='s'>
										Не выбрано
									</Text>
								)
							}
							const [from, to] = dateRange
							const sameYearFrom = isSameYear(from, today)
							const sameYearTo = isSameYear(to, today)
							const fromFmt = format(
								from,
								sameYearFrom ? 'd MMMM' : "d MMMM yyyy 'года'",
								{ locale: ru }
							)
							const toFmt = format(
								to,
								sameYearTo ? "d MMMM yyyy 'года'" : "d MMMM yyyy 'года'",
								{ locale: ru }
							)
							return (
								<Text view='secondary' size='s'>
									с {fromFmt} по {toFmt}
								</Text>
							)
						})()}
					</div>
				</div>
			</Card>

			{/* <SummaryWidget dateRange={dateRange} />
			<div className='mb-6' /> */}
			<TimeseriesWidget
				dateRange={dateRange}
				bucket={period === 'День' ? 'day' : undefined}
			/>
			<div className='mb-6' />
			<FunnelWidget dateRange={dateRange} />
			{/* <EngagementWidget /> */}
			<div className='mb-6' />
			<ErrorsTopWidget dateRange={dateRange} />
		</Layout>
	)
}

export const Component = AnalyticsPage
