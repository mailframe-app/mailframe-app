import { Card } from '@consta/uikit/Card'
import { Grid, GridItem } from '@consta/uikit/Grid'
import { SkeletonBrick } from '@consta/uikit/Skeleton'
import { Text } from '@consta/uikit/Text'
import { useQuery } from '@tanstack/react-query'
import { formatISO } from 'date-fns'
import { type ReactNode, useMemo } from 'react'

import {
	DistributionOutline,
	EmailNew,
	MailAlert,
	MailAll,
	MailCheck,
	MailReply,
	MailUnsub,
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
	icon,
	color
}: {
	title: string
	value?: number
	rate?: number
	icon?: ReactNode
	color?: string
}) => (
	<div className='flex h-full flex-col'>
		<Text view='secondary' size='s' weight='medium' className='mb-3'>
			{title}
		</Text>
		<div className='flex items-center justify-between'>
			<div className='flex items-center gap-3'>
				<div
					className={`inline-flex h-12 w-12 items-center justify-center rounded-full border`}
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
			color: '--color-typo-brand',
			icon: <MailAll className='h-6 w-6 text-[var(--color-bg-brand)]' />
		},
		{
			title: 'Доставлено писем',
			value: totals.sent,
			rate: rates.deliveryRate,
			color: '--color-bg-contact',
			icon: <EmailNew className='h-6 w-6 text-[var(--color-bg-contact)]' />
		},
		{
			title: 'Открыто',
			value: totals.opens,
			rate: rates.openRate,
			color: '--color-typo-success',
			icon: <MailCheck className='h-6 w-6 text-[var(--color-typo-success)]' />
		},
		{
			title: 'Переходы по ссылкам',
			value: totals.clicks,
			rate: rates.clickToOpen,
			color: '--color-typo-brand',
			icon: <MailReply className='h-6 w-6 text-[var(--color-typo-brand)]' />
		},
		{
			title: 'Отписалось',
			value: totals.unsubs,
			rate: rates.unsubRate,
			color: '--color-typo-warning',
			icon: <MailUnsub className='h-6 w-6 text-[var(--color-typo-warning)]' />
		},
		{
			title: 'Ошибки',
			value: totals.failed,
			rate: rates.failRate,
			icon: <MailAlert className='h-6 w-6 text-[var(--color-bg-alert)]' />,
			color: '--color-bg-alert'
		}
	]

	return (
		<Grid cols={12} gap='xl'>
			{metrics.map((metric, i) => (
				<GridItem key={metric.title} col={i < 3 ? 4 : 3}>
					<Card
						verticalSpace='l'
						horizontalSpace='l'
						className='h-full !rounded-xl bg-[var(--color-bg-default)]'
					>
						<Stat
							title={metric.title}
							value={metric.value}
							rate={metric.rate}
							icon={metric.icon}
							color={metric.color}
						/>
					</Card>
				</GridItem>
			))}
		</Grid>
	)
}
