import { Layout } from '@consta/uikit/Layout'
import { subDays } from 'date-fns'

import { DashboardCalendar } from '@/features/campaign/dashboard-calendar'

import { ActionButtons, GreetingHeader, ResentCompanies } from './ui'
import { TimeseriesWidget } from '@/entities/analytics'

function DashboardPage() {
	const dateRange: [Date, Date] = [subDays(new Date(), 30), new Date()]

	return (
		<Layout direction='column' className='w-full'>
			<GreetingHeader />
			<ActionButtons />
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
