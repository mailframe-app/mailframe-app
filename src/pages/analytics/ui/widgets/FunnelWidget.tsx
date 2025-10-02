import { Pie } from '@consta/charts/Pie'
import { Card } from '@consta/uikit/Card'
import { SkeletonBrick } from '@consta/uikit/Skeleton'
import { useQuery } from '@tanstack/react-query'
import { formatISO } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'

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
	const [windowWidth, setWindowWidth] = useState(window.innerWidth)

	useEffect(() => {
		let timeoutId: NodeJS.Timeout
		const handleResize = () => {
			clearTimeout(timeoutId)
			timeoutId = setTimeout(() => setWindowWidth(window.innerWidth), 100)
		}
		window.addEventListener('resize', handleResize)
		return () => {
			clearTimeout(timeoutId)
			window.removeEventListener('resize', handleResize)
		}
	}, [])

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
				verticalSpace='l'
				horizontalSpace='l'
				shadow={false}
				className='!rounded-lg bg-[var(--color-bg-default)]'
			>
				<SkeletonBrick height={280} />
			</Card>
		)
	}

	if (isError) {
		return (
			<Card
				verticalSpace='l'
				horizontalSpace='l'
				shadow={false}
				className='!rounded-lg bg-[var(--color-bg-default)]'
			>
				<div className='text-[var(--color-typo-alert)]'>
					Не удалось загрузить данные воронки
				</div>
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
			verticalSpace='l'
			horizontalSpace='l'
			shadow={false}
			className='!rounded-lg bg-[var(--color-bg-default)]'
		>
			<h2 className='mb-4 text-xl font-semibold text-[var(--color-typo-primary)]'>
				Воронка коммуникаций
			</h2>
			<div className='grid grid-cols-5 gap-2 sm:gap-4'>
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
							<div className='relative h-[60px] w-[60px] sm:h-[80px] sm:w-[80px] lg:h-[112px] lg:w-[112px]'>
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
													fontSize:
														windowWidth >= 1024
															? '0.875rem'
															: windowWidth >= 640
																? '0.75rem'
																: '0.625rem',
													lineHeight: 1,
													fontWeight: 600,
													color: 'var(--color-typo-primary)'
												}
											}
										} as any
									}
								/>
							</div>
							<div className='mt-1 text-xs text-[var(--color-typo-secondary)] sm:mt-2 sm:text-sm lg:text-base'>
								{step.label}
							</div>
							<div className='mt-0.5 text-sm font-semibold text-[var(--color-typo-primary)] sm:mt-1 sm:text-base lg:text-lg'>
								{step.value.toLocaleString()}
							</div>
						</div>
					)
				})}
			</div>
		</Card>
	)
}
