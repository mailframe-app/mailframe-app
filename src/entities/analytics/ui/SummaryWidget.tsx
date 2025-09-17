import { Card } from '@consta/uikit/Card'
import { Grid, GridItem } from '@consta/uikit/Grid'
import { SkeletonBrick } from '@consta/uikit/Skeleton'
import { Text } from '@consta/uikit/Text'
import { useQuery } from '@tanstack/react-query'
import { formatISO } from 'date-fns'
import { useMemo } from 'react'

import { summaryQuery } from '@/entities/analytics'

type Props = {
	dateRange: [Date, Date] | null
}

const Stat = ({
	title,
	value,
	rate
}: {
	title: string
	value?: number
	rate?: number
}) => (
	<div className='flex h-full flex-col justify-between'>
		<Text view='secondary' size='s'>
			{title}
		</Text>
		<div className='flex items-baseline justify-between'>
			<Text size='3xl' weight='bold' view='primary'>
				{value ?? 0}
			</Text>
			{rate !== undefined && (
				<Text size='l' view='secondary'>
					{`${Math.round(rate * 1000) / 10} %`}
				</Text>
			)}
		</div>
	</div>
)

export function SummaryWidget({ dateRange }: Props) {
	const params = useMemo(() => {
		if (!dateRange) return undefined
		return {
			from: formatISO(dateRange[0]),
			to: formatISO(dateRange[1])
		}
	}, [dateRange])

	const { data, isLoading, isError } = useQuery({
		...summaryQuery(params),
		enabled: !!params
	})

	if (isLoading) {
		return (
			<Grid cols={12} gap='xl'>
				{Array.from({ length: 7 }).map((_, i) => (
					<GridItem key={i} col={i < 3 ? 4 : 3}>
						<Card verticalSpace='l' horizontalSpace='l' className='!rounded-xl'>
							<div className='flex h-[68px] flex-col justify-between'>
								<SkeletonBrick className='w-3/5' height={16} />
								<div className='flex items-baseline justify-between'>
									<SkeletonBrick className='h-8 w-2/5' height={32} />
									<SkeletonBrick className='h-6 w-1/4' height={24} />
								</div>
							</div>
						</Card>
					</GridItem>
				))}
			</Grid>
		)
	}

	if (isError) {
		return (
			<Grid cols={12} gap='xl'>
				<GridItem col={12}>
					<Card verticalSpace='xl' horizontalSpace='xl' className='!rounded-xl'>
						<Text view='alert'>Не удалось загрузить сводку</Text>
					</Card>
				</GridItem>
			</Grid>
		)
	}

	if (!data) return null

	const { totals, rates } = data

	const metrics = [
		{
			title: 'Всего рассылок',
			value: totals.campaignsTotal
		},
		{
			title: 'Отправлено писем',
			value: totals.recipients
		},
		{
			title: 'Доставлено',
			value: totals.sent,
			rate: rates.deliveryRate
		},
		{
			title: 'Открыто',
			value: totals.opens,
			rate: rates.openRate
		},
		{
			title: 'Переходы по ссылкам',
			value: totals.clicks,
			rate: rates.clickToOpen
		},
		{
			title: 'Отписалось',
			value: totals.unsubs,
			rate: rates.unsubRate
		},
		{
			title: 'Ошибки',
			value: totals.failed,
			rate: rates.failRate
		}
	]

	return (
		<Grid cols={12} gap='xl'>
			{metrics.map((metric, i) => (
				<GridItem key={metric.title} col={i < 3 ? 4 : 3}>
					<Card
						verticalSpace='l'
						horizontalSpace='l'
						className='h-full !rounded-xl'
					>
						<Stat
							title={metric.title}
							value={metric.value}
							rate={metric.rate}
						/>
					</Card>
				</GridItem>
			))}
		</Grid>
	)
}
