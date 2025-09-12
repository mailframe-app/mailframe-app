import { Line } from '@consta/charts/Line'
import { Card } from '@consta/uikit/Card'
import { SkeletonBrick } from '@consta/uikit/Skeleton'
import { Text } from '@consta/uikit/Text'
import { useQueries } from '@tanstack/react-query'
import { format, formatISO, parseISO } from 'date-fns'
import { useMemo } from 'react'

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
			from: formatISO(dateRange[0]),
			to: formatISO(dateRange[1]),
			bucket,
			campaignId
		}
	}, [dateRange, campaignId, bucket])

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
		<Card verticalSpace='xl' horizontalSpace='xl' className='!rounded-xl'>
			{isLoading && <SkeletonBrick height={300} />}
			{isError && (
				<Text view='alert'>Не удалось загрузить данные для графика</Text>
			)}
			{!isLoading && !isError && !hasData && (
				<div className='flex h-[300px] items-center justify-center'>
					<Text view='secondary' size='s'>
						За выбранный период нет данных для отображения
					</Text>
				</div>
			)}
			{!isLoading && !isError && hasData && (
				<div className='h-[300px]'>
					<Line
						data={chartData}
						xField='t'
						yField='value'
						seriesField='metric'
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
