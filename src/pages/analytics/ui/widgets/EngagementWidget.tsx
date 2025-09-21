import { Bar } from '@consta/charts/Bar'
import { Card } from '@consta/uikit/Card'
import { SkeletonBrick } from '@consta/uikit/Skeleton'
import { Text } from '@consta/uikit/Text'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

import { engagementDistributionQuery } from '@/entities/analytics'

export function EngagementWidget() {
	const params = useMemo(() => {
		return {
			bins: 10
		}
	}, [])

	const { data, isLoading, isError } = useQuery({
		...engagementDistributionQuery(params),
		enabled: true
	})

	const chartData = useMemo(() => {
		if (!data || data.bins.length === 0) return []

		return data.bins.map(bin => ({
			range: `${bin.range[0]}-${bin.range[1]}`,
			count: bin.count
		}))
	}, [data?.bins])

	if (isLoading) {
		return (
			<Card verticalSpace='xl' horizontalSpace='xl' className='!rounded-xl'>
				<SkeletonBrick height={300} />
			</Card>
		)
	}

	if (isError) {
		return (
			<Card verticalSpace='xl' horizontalSpace='xl' className='!rounded-xl'>
				<Text view='alert'>Не удалось загрузить данные о вовлеченности</Text>
			</Card>
		)
	}

	if (!data || data.bins.length === 0) {
		return (
			<Card verticalSpace='xl' horizontalSpace='xl' className='!rounded-xl'>
				<div className='flex h-[300px] items-center justify-center'>
					<Text view='secondary' size='s'>
						За выбранный период нет данных о вовлеченности
					</Text>
				</div>
			</Card>
		)
	}

	return (
		<Card verticalSpace='xl' horizontalSpace='xl' className='!rounded-xl'>
			<div className='h-[300px]'>
				<Bar
					data={chartData}
					xField='range'
					yField='count'
					meta={{
						range: { alias: 'Диапазон' },
						count: { alias: 'Количество' }
					}}
				/>
			</div>
		</Card>
	)
}
