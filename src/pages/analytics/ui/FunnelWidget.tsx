import { Card } from '@consta/uikit/Card'
import { Layout } from '@consta/uikit/Layout'
import { SkeletonBrick } from '@consta/uikit/Skeleton'
import { Text } from '@consta/uikit/Text'
import { useQuery } from '@tanstack/react-query'
import { formatISO } from 'date-fns'
import { useMemo } from 'react'

import { CircleProgress } from '@/shared/ui/CircleProgress'

import { funnelQuery } from '@/entities/analytics'

type Props = {
	dateRange: [Date, Date] | null
}

type FunnelStep = {
	label: string
	value: number
	conversionRate?: number
	color: string
}

export function FunnelWidget({ dateRange }: Props) {
	const params = useMemo(() => {
		if (!dateRange) return undefined
		return {
			from: formatISO(dateRange[0]),
			to: formatISO(dateRange[1])
		}
	}, [dateRange])

	const { data, isLoading, isError } = useQuery({
		...funnelQuery(params),
		enabled: !!params
	})

	if (isLoading) {
		return (
			<Card verticalSpace='xl' horizontalSpace='xl' className='!rounded-xl'>
				<div className='space-y-4'>
					{Array.from({ length: 5 }).map((_, i) => (
						<SkeletonBrick key={i} height={40} />
					))}
				</div>
			</Card>
		)
	}

	if (isError) {
		return (
			<Card verticalSpace='xl' horizontalSpace='xl' className='!rounded-xl'>
				<Text view='alert'>Не удалось загрузить данные воронки</Text>
			</Card>
		)
	}

	if (!data) return null

	const { recipients, sent, opens, clicks, unsubs } = data

	const steps: FunnelStep[] = [
		{
			label: 'Отправлено',
			value: recipients,
			color: 'var(--color-bg-brand)'
		},
		{
			label: 'Доставлено',
			value: sent,
			conversionRate: recipients > 0 ? (sent / recipients) * 100 : 0,
			color: 'var(--color-bg-success)'
		},
		{
			label: 'Открыто',
			value: opens,
			conversionRate: sent > 0 ? (opens / sent) * 100 : 0,
			color: 'var(--color-bg-warning)'
		},
		{
			label: 'Кликнуто',
			value: clicks,
			conversionRate: opens > 0 ? (clicks / opens) * 100 : 0,
			color: 'var(--color-bg-alert)'
		},
		{
			label: 'Отписались',
			value: unsubs,
			conversionRate: sent > 0 ? (unsubs / sent) * 100 : 0,
			color: 'var(--color-bg-secondary)'
		}
	]

	return (
		<Card verticalSpace='xl' horizontalSpace='xl' className='!rounded-xl'>
			<div className='grid grid-cols-5 gap-4'>
				{steps.map(step => (
					<Layout
						key={step.label}
						direction='column'
						className='items-center text-center'
					>
						<CircleProgress
							percent={(step.value / recipients) * 100}
							color={step.color}
							size={48}
							strokeWidth={4}
						/>
						<Text size='s' view='secondary' className='mt-2'>
							{step.label}
						</Text>
						<Text size='l' weight='bold' className='mt-1' view='primary'>
							{step.value.toLocaleString()}
						</Text>
						{step.conversionRate !== undefined && (
							<Text size='xs' view='secondary'>
								({step.conversionRate.toFixed(1)}%)
							</Text>
						)}
					</Layout>
				))}
			</div>
		</Card>
	)
}
