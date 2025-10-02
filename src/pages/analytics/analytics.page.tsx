import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'

import { useAnalyticsState } from './model/hooks'
import { AnalyticsPeriodSelector } from './ui/components/AnalyticsPeriodSelector'
import { DateRangeDisplay } from './ui/components/DateRangeDisplay'
import { ErrorsTopWidget, FunnelWidget, TimeseriesWidget } from './ui/widgets'

function AnalyticsPage() {
	const { dateRange, period, updateDateRange } = useAnalyticsState()

	return (
		<Layout direction='column' className='w-full'>
			<div className='mb-7 flex flex-col items-center justify-between gap-4 md:flex-row md:gap-0'>
				<div className='flex flex-col text-left'>
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
				<AnalyticsPeriodSelector
					period={period}
					onPeriodChange={updateDateRange}
				/>
			</div>

			<div className='mb-6 !rounded-lg bg-[var(--color-bg-default)] p-6'>
				<DateRangeDisplay dateRange={dateRange} />
			</div>

			<TimeseriesWidget
				dateRange={dateRange}
				bucket={period === 'День' ? 'day' : undefined}
			/>
			<div className='mb-6' />
			<FunnelWidget dateRange={dateRange} />

			<div className='mb-6' />
			<ErrorsTopWidget dateRange={dateRange} />
			{/* 
			<SummaryWidget dateRange={dateRange} />
			<EngagementWidget /> */}
		</Layout>
	)
}

export const Component = AnalyticsPage
