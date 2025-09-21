import { Table } from '@consta/table/Table'
import { Card } from '@consta/uikit/Card'
import { SkeletonBrick } from '@consta/uikit/Skeleton'
import { Text } from '@consta/uikit/Text'
import { useQuery } from '@tanstack/react-query'
import { formatISO } from 'date-fns'
import { useMemo } from 'react'

import { formatDate } from '@/shared/lib/formatDate'
import { EmptyBox, buildHeader } from '@/shared/ui'

import { errorsTopQuery } from '@/entities/analytics'

type Props = {
	dateRange: [Date, Date] | null
}

export function ErrorsTopWidget({ dateRange }: Props) {
	const params = useMemo(() => {
		if (!dateRange) return undefined
		return {
			from: formatISO(dateRange[0]),
			to: formatISO(dateRange[1])
		}
	}, [dateRange])

	const { data, isLoading, isError } = useQuery({
		...errorsTopQuery(params),
		enabled: !!params
	})

	const columns = useMemo(
		() => [
			{
				title: 'Код ошибки',
				accessor: 'message',
				renderHeaderCell: buildHeader({ label: 'Код ошибки' }),
				width: 400
			},
			{
				title: 'Количество',
				accessor: 'count',
				renderHeaderCell: buildHeader({ label: 'Количество' }),
				width: 120
			},
			{
				title: 'Доля',
				accessor: 'share',
				renderHeaderCell: buildHeader({ label: 'Доля' }),
				width: 100,
				renderCell: ({ row }: { row: any }) => (
					<div className='flex h-full items-center p-2'>
						<Text>{(row.share * 100).toFixed(1)}%</Text>
					</div>
				)
			},
			{
				title: 'Последний раз',
				accessor: 'lastAt',
				renderHeaderCell: buildHeader({ label: 'Последний раз' }),
				width: 150,
				renderCell: ({ row }: { row: any }) => (
					<div className='flex h-full items-center p-2'>
						{row.lastAt ? formatDate(row.lastAt) : '—'}
					</div>
				)
			}
		],
		[]
	)

	if (isLoading) {
		return (
			<Card
				verticalSpace='l'
				horizontalSpace='l'
				className='!rounded-lg bg-[var(--color-bg-default)]'
				shadow={false}
			>
				<Text
					as='h2'
					view='primary'
					size='xl'
					weight='semibold'
					className='mb-4'
				>
					Ошибки доставки
				</Text>
				<SkeletonBrick height={300} />
			</Card>
		)
	}

	if (isError) {
		return (
			<Card
				verticalSpace='l'
				horizontalSpace='l'
				className='!rounded-lg bg-[var(--color-bg-default)]'
				shadow={false}
			>
				<Text
					as='h2'
					view='primary'
					size='xl'
					weight='semibold'
					className='mb-4'
				>
					Ошибки доставки
				</Text>
				<Text view='alert'>Не удалось загрузить данные об ошибках</Text>
			</Card>
		)
	}

	if (!data || data.items.length === 0) {
		return (
			<Card
				verticalSpace='l'
				horizontalSpace='l'
				className='!rounded-lg bg-[var(--color-bg-default)]'
				shadow={false}
			>
				<Text
					as='h2'
					view='primary'
					size='xl'
					weight='semibold'
					className='mb-4'
				>
					Ошибки доставки
				</Text>
				<div className='flex h-[300px] flex-col items-center justify-center gap-4 text-[var(--color-typo-primary)]'>
					<EmptyBox />
					<Text view='secondary' size='s'>
						За выбранный период нет данных об ошибках
					</Text>
				</div>
			</Card>
		)
	}

	return (
		<Card
			verticalSpace='l'
			horizontalSpace='l'
			className='!rounded-lg bg-[var(--color-bg-default)]'
			shadow={false}
		>
			<Text as='h2' view='primary' size='xl' weight='semibold' className='mb-4'>
				Ошибки доставки
			</Text>
			<div className=''>
				<Table
					rows={data.items}
					columns={columns}
					stickyHeader
					getRowKey={(row: any) => row.message}
				/>
			</div>
		</Card>
	)
}
