import { Card } from '@consta/uikit/Card'
import { Grid, GridItem } from '@consta/uikit/Grid'
import { SkeletonBrick } from '@consta/uikit/Skeleton'
import { Text } from '@consta/uikit/Text'
import { useQuery } from '@tanstack/react-query'
import { formatISO } from 'date-fns'

import {
	DistributionOutline,
	EmailNew,
	MailAll,
	UserAdmin
} from '@/shared/ui/MailIcons'

import { summaryQuery } from '@/entities/analytics'

type Props = {
	dateRange: [Date, Date] | null
}

const Stat = ({
	title,
	value,
	rate,
	icon
}: {
	title: string
	value?: number
	rate?: number
	icon?: React.ReactNode
}) => (
	<div className='flex h-full flex-col justify-between'>
		<Text view='secondary' size='s' weight='medium' className='mb-3'>
			{title}
		</Text>
		<div className='flex items-center justify-between'>
			<div className='flex items-center gap-3'>
				<div className='inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-typo-brand)] bg-[#0071b2]/15'>
					{/* bg-[#0071b2]/25 */}
					{icon}
				</div>
				<Text size='xl' weight='semibold' view='primary'>
					{value ?? 0}
				</Text>
			</div>
			{rate !== undefined && (
				<Text size='l' view='secondary'>
					{`${Math.round(rate * 1000) / 10} %`}
				</Text>
			)}
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
						className='!rounded-xl bg-[var(--color-bg-default)]'
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
						verticalSpace='xl'
						horizontalSpace='xl'
						className='!rounded-xl bg-[var(--color-bg-default)]'
					>
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
			title: 'Создано рассылок',
			value: totals.campaignsTotal,
			icon: (
				<DistributionOutline className='h-6 w-6 text-[var(--color-typo-brand)]' />
			)
		},
		{
			title: 'Добавлено контактов',
			value: totals.contactsTotal,
			icon: <UserAdmin className='h-6 w-6 text-[var(--color-typo-brand)]' />
		},
		{
			title: 'Отправлено писем',
			value: totals.recipients,
			icon: <MailAll className='h-6 w-6 text-[var(--color-typo-brand)]' />
		},
		{
			title: 'Доставлено писем',
			value: totals.sent,
			rate: rates.deliveryRate,
			icon: <EmailNew className='h-6 w-6 text-[var(--color-typo-brand)]' />
		}
	]

	return (
		<div className='mb-6 grid grid-cols-2 gap-6 sm:grid-cols-2 xl:grid-cols-4'>
			{metrics.map(metric => (
				<Card
					key={metric.title}
					verticalSpace='l'
					horizontalSpace='l'
					className='h-full !rounded-xl bg-[var(--color-bg-default)]'
				>
					<Stat
						title={metric.title}
						value={metric.value}
						rate={metric.rate}
						icon={metric.icon}
					/>
				</Card>
			))}
		</div>
	)
}
