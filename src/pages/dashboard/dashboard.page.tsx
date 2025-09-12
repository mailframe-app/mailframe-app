import { IconTopRight } from '@consta/icons/IconTopRight'
import { Button } from '@consta/uikit/Button'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'
import { Link } from 'react-router-dom'

import { DashboardCalendar } from '@/features/campaign/dashboard-calendar'

import { PRIVATE_ROUTES } from '@/shared/constants'

import { ActionButtons, GreetingHeader, ResentCompanies } from './ui'

function DashboardPage() {
	return (
		<Layout direction='column' className='w-full' flex={1}>
			<Layout direction='column' className='w-full' flex={0.5}>
				<GreetingHeader />
				<ActionButtons />
			</Layout>
			<Layout direction='column' className='w-full' flex={1}>
				<div className='flex w-full items-start gap-8'>
					<div className='flex min-w-0 flex-1 flex-col'>
						<Layout className='mb-4 items-center justify-between'>
							<Text as='h2' view='primary' size='2xl' weight='bold'>
								Рассылки
							</Text>
							<Link to={PRIVATE_ROUTES.CAMPANIES}>
								<Button
									label='Смотреть все'
									view='clear'
									iconRight={IconTopRight}
								/>
							</Link>
						</Layout>
						<ResentCompanies />
					</div>
					<div className='flex flex-col'>
						<Layout className='mb-5 items-center justify-between'>
							<Text as='h2' view='primary' size='2xl' weight='bold'>
								Календарь
							</Text>
						</Layout>
						<DashboardCalendar />
					</div>
				</div>
			</Layout>
		</Layout>
	)
}

export const Component = DashboardPage
