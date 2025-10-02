import { Layout } from '@consta/uikit/Layout'

import { DashboardCalendar } from '@/features/campaign/dashboard-calendar'

import { useDashboardData } from './model/useDashboardData'
import { ActionButtons, GreetingHeader, ResentCompanies } from './ui'
import { SummaryWidget, TimeseriesWidget } from '@/entities/analytics'

function DashboardPage() {
	const { dateRange } = useDashboardData()

	return (
		<Layout direction='column' className='w-full'>
			<GreetingHeader />
			<ActionButtons />
			<SummaryWidget dateRange={dateRange} />
			<div className='mb-6 flex w-full flex-col gap-4 md:flex-row'>
				<div className='min-w-0 flex-1'>
					<TimeseriesWidget dateRange={dateRange} />
				</div>
				<DashboardCalendar className='hidden lg:block' />
			</div>
			<ResentCompanies />
		</Layout>
	)
}

export const Component = DashboardPage
