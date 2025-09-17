import { Layout } from '@consta/uikit/Layout'

import { DashboardCalendar } from '@/features/campaign/dashboard-calendar'

import { ActionButtons, GreetingHeader, ResentCompanies } from './ui'

function DashboardPage() {
	return (
		<Layout direction='column' className='w-full'>
			<GreetingHeader />
			<ActionButtons />
			<div className='flex w-full flex-col gap-4 md:flex-row'>
				<div className='min-w-0 flex-1'>
					<ResentCompanies />
				</div>
				<DashboardCalendar />
			</div>
		</Layout>
	)
}

export const Component = DashboardPage
