import { Card } from '@consta/uikit/Card'
import { Grid, GridItem } from '@consta/uikit/Grid'
import { SkeletonBrick } from '@consta/uikit/Skeleton'
import { Text } from '@consta/uikit/Text'
import { useQuery } from '@tanstack/react-query'
import { formatISO } from 'date-fns'

import { DistributionOutline, EmailNew, MailAll, UserAdmin } from '@/shared/ui'

import { summaryQuery } from '@/entities/analytics'

type Props = {
	dateRange: [Date, Date] | null
}

const Stat = ({
	title,
	value,
	icon,
	color
}: {
	title: string
	value?: number
	icon?: React.ReactNode
	color?: string
}) => (
	<div className='flex h-full flex-col justify-between'>
		<div className='flex items-center gap-3'>
			<div
				className={`inline-flex h-10 w-10 items-center justify-center rounded-full border md:h-12 md:w-12`}
				style={{ borderColor: `var(${color})` }}
			>
				<div
					className={`rounded-full p-2`}
					style={{
						backgroundColor: `color-mix(in srgb, var(${color}) 20%, transparent)`
					}}
				>
					{icon}
				</div>
			</div>
			<div className='flex flex-col'>
				<Text size='s' weight='semibold' view='secondary'>
					{title}
				</Text>
				<Text size='xl' weight='semibold' view='primary'>
					{value ?? 0}
				</Text>
			</div>
		</div>
	</div>
)

export function SummaryWidget({ dateRange }: Props) {
	const { data, isLoading, isError } = useQuery({
		...summaryQuery(
			dateRange
				? {
						from:
							formatISO(dateRange[0], { representation: 'date' }) +
							'T00:00:00.000Z',
						to:
							formatISO(dateRange[1], { representation: 'date' }) +
							'T23:59:59.999Z'
					}
				: undefined
		),
		enabled: !!dateRange
	})

	if (isLoading) {
		return (
			<div className='mb-6 grid grid-cols-2 gap-6 sm:grid-cols-2 xl:grid-cols-4'>
				{Array.from({ length: 4 }).map((_, i) => (
					<Card
						key={i}
						verticalSpace='l'
						horizontalSpace='l'
						className='!rounded-lg bg-[var(--color-bg-default)]'
						shadow={false}
					>
						<div className='flex h-[68px] flex-col justify-between'>
							<SkeletonBrick className='w-3/5' height={16} />
							<div className='flex items-baseline justify-between'>
								<SkeletonBrick className='h-8 w-2/5' height={32} />
								<SkeletonBrick className='h-6 w-1/4' height={24} />
							</div>
						</div>
					</Card>
				))}
			</div>
		)
	}

	if (isError) {
		return (
			<Grid cols={12} gap='xl' className='mb-6'>
				<GridItem col={12}>
					<Card
						verticalSpace='l'
						horizontalSpace='l'
						className='!rounded-lg bg-[var(--color-bg-default)]'
						shadow={false}
					>
						<Text view='alert'>Не удалось загрузить сводку</Text>
					</Card>
				</GridItem>
			</Grid>
		)
	}

	if (!data) return null

	const { totals, rates } = data

	const metrics: Array<{
		title: string
		value: number
		icon: React.ReactNode
		rate?: number
		color?: string
	}> = [
		{
			title: 'Количество рассылок',
			value: totals.campaignsTotal,
			color: '--color-typo-brand',
			icon: (
				<DistributionOutline className='h-6 w-6 text-[var(--color-typo-brand)]' />
			)
		},
		{
			title: 'Количество контактов',
			value: totals.contactsTotal,
			color: '--color-bg-caution',
			icon: <UserAdmin className='h-6 w-6 text-[var(--color-bg-caution)]' />
		},
		{
			title: 'Отправлено писем',
			value: totals.recipients,
			color: '--color-bg-contact',
			icon: <MailAll className='h-6 w-6 text-[var(--color-bg-contact)]' />
		},
		{
			title: 'Доставлено писем',
			value: totals.sent,
			rate: rates.deliveryRate,
			color: '--color-bg-success',
			icon: <EmailNew className='h-6 w-6 text-[var(--color-bg-success)]' />
		}
	]

	return (
		<div className='mb-6 grid grid-cols-2 gap-6 sm:grid-cols-2 xl:grid-cols-4'>
			{metrics.map(metric => (
				<Card
					key={metric.title}
					verticalSpace='l'
					horizontalSpace='l'
					className='h-full !rounded-lg bg-[var(--color-bg-default)]'
					shadow={false}
				>
					<Stat
						title={metric.title}
						value={metric.value}
						icon={metric.icon}
						color={metric.color}
					/>
				</Card>
			))}
		</div>
	)
}
