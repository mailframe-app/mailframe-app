import { Card } from '@consta/uikit/Card'
import { Grid, GridItem } from '@consta/uikit/Grid'
import { SkeletonBrick } from '@consta/uikit/Skeleton'
import { Text } from '@consta/uikit/Text'
import { useMemo, useState } from 'react'

import { StatCard, StatCardSkeleton } from './StatCard'
import { useCampaignStats } from '@/entities/campaigns'
import { ErrorsTopWidget } from '@/pages/analytics/ui/widgets/ErrorsTopWidget'
import {
	TIME_SCALES,
	type TimeScale,
	TimeScaleSelector,
	getDateRangeForScale
} from '@/pages/analytics/ui/widgets/TimeScaleSelector'
import { TimeseriesWidget } from '@/pages/analytics/ui/widgets/TimeseriesWidget'

type Props = {
	campaignId: string
}

export function CampaignAnalyticsTab({ campaignId }: Props) {
	const { data, isLoading, isError } = useCampaignStats(campaignId, {
		errorsLimit: 5
	})

	const [selectedTimeScale, setSelectedTimeScale] = useState<TimeScale>(
		TIME_SCALES[0]
	)

	const dateRange = useMemo<[Date, Date] | null>(() => {
		if (!data?.createdAt) return null
		return getDateRangeForScale(selectedTimeScale, data.createdAt)
	}, [data?.createdAt, selectedTimeScale])

	const deliveryRate =
		data && data.recipientsCount > 0
			? (data.sentCount / data.recipientsCount) * 100
			: 0
	const openRate =
		data && data.sentCount > 0 ? (data.opensCount / data.sentCount) * 100 : 0
	const clickRate =
		data && data.opensCount > 0 ? (data.clicksCount / data.opensCount) * 100 : 0
	const errorRate =
		data && data.recipientsCount > 0
			? (data.failedCount / data.recipientsCount) * 100
			: 0
	const unsubscribeRate =
		data && data.sentCount > 0
			? (data.unsubscribesCount / data.sentCount) * 100
			: 0

	if (isLoading) {
		return (
			<div className='flex flex-col gap-8'>
				<div>
					<SkeletonBrick height={24} className='mb-1 w-1/4' />
					<SkeletonBrick height={16} className='w-1/3' />
				</div>
				<Grid cols={4} gap='xl'>
					{Array.from({ length: 4 }).map((_, i) => (
						<GridItem key={i}>
							<StatCardSkeleton />
						</GridItem>
					))}
				</Grid>
				<SkeletonBrick height={400} />
				<SkeletonBrick height={300} />
			</div>
		)
	}

	if (isError) {
		return (
			<div className='flex items-center justify-center p-10'>
				<Text>Не удалось загрузить статистику кампании.</Text>
			</div>
		)
	}

	if (!data) return null

	return (
		<div className='flex flex-col gap-6'>
			<Card
				verticalSpace='l'
				horizontalSpace='l'
				className='flex items-center justify-between !rounded-lg bg-[var(--color-bg-default)]'
				shadow={false}
			>
				<div className='flex flex-col justify-between'>
					<Text size='xl' weight='semibold' view='primary'>
						Доставлено: {deliveryRate.toFixed(0)}%
					</Text>
					<Text size='s' view='secondary'>
						{data.sentCount} из {data.recipientsCount} писем
					</Text>
				</div>
				<TimeScaleSelector
					value={selectedTimeScale}
					onChange={setSelectedTimeScale}
				/>
			</Card>

			<Grid cols={4} gap='xl'>
				<GridItem>
					<StatCard
						title='Уникальных открытий'
						value={data.opensCount}
						percent={openRate}
						color='#22C55E'
					/>
				</GridItem>
				<GridItem>
					<StatCard
						title='Переходы по ссылкам'
						value={data.clicksCount}
						percent={clickRate}
						color='#3B82F6'
					/>
				</GridItem>
				<GridItem>
					<StatCard
						title='Ошибки доставки'
						value={data.failedCount}
						percent={errorRate}
						color='#EF4444'
					/>
				</GridItem>
				<GridItem>
					<StatCard
						title='Отписки и жалобы'
						value={data.unsubscribesCount}
						percent={unsubscribeRate}
						color='#F97316'
					/>
				</GridItem>
			</Grid>

			<TimeseriesWidget
				dateRange={dateRange}
				campaignId={campaignId}
				bucket={selectedTimeScale.bucket}
			/>

			{data.errorsTop && data.errorsTop.length > 0 && (
				<div>
					<Text
						size='2xl'
						weight='semibold'
						view='primary'
						className='mb-4 block'
					>
						Топ ошибок
					</Text>
					<ErrorsTopWidget dateRange={dateRange} />
				</div>
			)}
		</div>
	)
}
