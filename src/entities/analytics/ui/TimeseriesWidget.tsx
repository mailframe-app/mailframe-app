import { Column } from '@consta/charts/Column'
import { Card } from '@consta/uikit/Card'
import { SkeletonBrick } from '@consta/uikit/Skeleton'
import { Text } from '@consta/uikit/Text'
import { useQueries } from '@tanstack/react-query'
import { format, formatISO, parseISO } from 'date-fns'
import { useMemo } from 'react'

import { EmptyBox } from '@/shared/ui'

import {
	type TimeseriesBucket,
	type TimeseriesMetric,
	timeseriesQuery
} from '@/entities/analytics'

type Props = {
	dateRange: [Date, Date] | null
	campaignId?: string
	bucket?: TimeseriesBucket
}

const metrics: TimeseriesMetric[] = ['sent', 'opened', 'clicked']
const metricLabels: Record<TimeseriesMetric, string> = {
	sent: 'Отправлено',
	opened: 'Открыто',
	clicked: 'Переходы'
}

export function TimeseriesWidget({
	dateRange,
	campaignId,
	bucket = 'day'
}: Props) {
	const params = useMemo(() => {
		if (!dateRange) return undefined
		return {
			from:
				formatISO(dateRange[0], { representation: 'date' }) + 'T00:00:00.000Z',
			to:
				formatISO(dateRange[1], { representation: 'date' }) + 'T23:59:59.999Z',
			bucket,
			campaignId
		}
	}, [dateRange?.[0]?.getTime(), dateRange?.[1]?.getTime(), bucket, campaignId])

	const results = useQueries({
		queries: metrics.map(metric => ({
			...timeseriesQuery({ ...params, metric } as any),
			enabled: !!params
		}))
	})

	const isLoading = results.some(r => r.isLoading)
	const isError = results.some(r => r.isError)

	const chartData = useMemo(() => {
		if (isLoading || isError || results.some(r => !r.data)) return []

		const allPoints: {
			t: string
			value: number
			metric: string
			originalDate: string
		}[] = []

		results.forEach((result, i) => {
			if (result.data) {
				const metric = metrics[i]
				const metricLabel = metricLabels[metric]
				result.data.points.forEach(p => {
					const formatPattern = bucket === 'hour' ? 'HH:mm' : 'dd.MM'
					allPoints.push({
						...p,
						t: format(parseISO(p.t), formatPattern),
						metric: metricLabel,
						originalDate: p.t
					})
				})
			}
		})

		// Сортируем точки по исходной дате для корректного отображения на графике
		return allPoints.sort((a, b) => {
			const dateA = parseISO(a.originalDate)
			const dateB = parseISO(b.originalDate)
			return dateA.getTime() - dateB.getTime()
		})
	}, [results, isLoading, isError])

	const hasData = useMemo(() => chartData.length > 0, [chartData])

	return (
		<Card
			verticalSpace='l'
			horizontalSpace='l'
			className='!rounded-lg bg-[var(--color-bg-default)]'
			shadow={false}
		>
			<div className='mb-5 flex flex-col items-center justify-between gap-2 xl:flex-row'>
				<Text as='h2' view='primary' size='xl' weight='semibold'>
					Статистика рассылок
				</Text>
				{!isLoading && !isError && hasData && (
					<div className='flex items-center gap-4'>
						{metrics.map((metric, index) => {
							const colors = ['#588AEF', '#58CFA0', '#5A6C8D']
							return (
								<div key={metric} className='flex items-center gap-2'>
									<div
										className='h-3 w-3 rounded-full'
										style={{
											backgroundColor: colors[index]
										}}
									/>
									<Text view='secondary' size='s'>
										{metricLabels[metric]}
									</Text>
								</div>
							)
						})}
					</div>
				)}
			</div>
			{isLoading && (
				<div className='flex h-[280px] flex-col gap-4'>
					{/* Скелетон для группированного графика */}
					<div className='flex flex-1 items-end justify-between px-4 pb-4'>
						{[1, 2, 3, 4, 5, 6].map(i => (
							<div key={i} className='flex flex-col items-center gap-2'>
								<div className='flex items-end gap-1'>
									<SkeletonBrick height={80} width={20} />
									<SkeletonBrick height={60} width={20} />
									<SkeletonBrick height={40} width={20} />
								</div>
								<SkeletonBrick height={12} width={30} />
							</div>
						))}
					</div>
				</div>
			)}
			{isError && (
				<Text view='alert'>Не удалось загрузить данные для графика</Text>
			)}
			{!isLoading && !isError && !hasData && (
				<div className='flex h-[280px] flex-col items-center justify-center gap-4 text-[var(--color-typo-primary)]'>
					<EmptyBox />
					<Text view='secondary' size='s'>
						За выбранный период нет данных для отображения
					</Text>
				</div>
			)}
			{!isLoading && !isError && hasData && (
				<div className='h-[280px]'>
					<Column
						data={chartData}
						legend={false}
						xField='t'
						yField='value'
						seriesField='metric'
						isGroup
						meta={{
							t: { alias: 'Период' },
							value: { alias: 'Количество' }
						}}
					/>
				</div>
			)}
		</Card>
	)
}
