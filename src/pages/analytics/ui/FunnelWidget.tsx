import { Pie } from '@consta/charts/Pie'
import { Card } from '@consta/uikit/Card'
import { SkeletonBrick } from '@consta/uikit/Skeleton'
import { Text } from '@consta/uikit/Text'
import { useQuery } from '@tanstack/react-query'
import { formatISO } from 'date-fns'
import { useMemo } from 'react'

// removed CircleProgress in favor of Pie charts

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
			<Card
				verticalSpace='xl'
				horizontalSpace='xl'
				className='!rounded-xl bg-[var(--color-bg-default)]'
			>
				<SkeletonBrick height={280} />
			</Card>
		)
	}

	if (isError) {
		return (
			<Card
				verticalSpace='xl'
				horizontalSpace='xl'
				className='!rounded-xl bg-[var(--color-bg-default)]'
			>
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
		<Card
			verticalSpace='xl'
			horizontalSpace='xl'
			className='!rounded-xl bg-[var(--color-bg-default)]'
		>
			<Text as='h2' view='primary' size='xl' weight='semibold' className='mb-4'>
				Воронка коммуникаций
			</Text>
			<div className='grid grid-cols-5 gap-4'>
				{steps.map(step => {
					const percent = recipients > 0 ? (step.value / recipients) * 100 : 0
					const pieData = [
						{ type: step.label, value: step.value },
						{ type: 'остальное', value: Math.max(recipients - step.value, 0) }
					]
					return (
						<div
							key={step.label}
							className='flex flex-col items-center text-center'
						>
							<div className='relative h-[112px] w-[112px]'>
								<Pie
									data={pieData}
									angleField='value'
									colorField='type'
									legend={false}
									tooltip={false as any}
									label={false as any}
									radius={1}
									innerRadius={0.64}
									statistic={
										{
											title: false,
											content: {
												formatter: () => `${percent.toFixed(1)}%`,
												style: {
													fontSize: 14,
													lineHeight: 1,
													fontWeight: 600,
													color: 'var(--color-typo-primary)'
												}
											}
										} as any
									}
								/>
							</div>
							<Text size='s' view='secondary' className='mt-2'>
								{step.label}
							</Text>
							<Text size='l' weight='bold' className='mt-1' view='primary'>
								{step.value.toLocaleString()}
							</Text>
						</div>
					)
				})}
			</div>
		</Card>
	)
}
