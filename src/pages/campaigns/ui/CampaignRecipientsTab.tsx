import type { IconComponent } from '@consta/icons/Icon'
import { IconAllDone } from '@consta/icons/IconAllDone'
import { IconCancel } from '@consta/icons/IconCancel'
import { DataCell } from '@consta/table/DataCell'
import { Table } from '@consta/table/Table'
import { Badge } from '@consta/uikit/Badge'
import { ResponsesEmptyPockets } from '@consta/uikit/ResponsesEmptyPockets'
import { Text } from '@consta/uikit/Text'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

import { formatDate } from '@/shared/lib/formatDate'
import {
	TablePagination,
	TableSkeleton,
	TableWrapper,
	buildHeader
} from '@/shared/ui'

import { useCampaignLogs } from '@/entities/campaigns'
import type {
	CampaignLogItem,
	LogStatusFilter
} from '@/entities/campaigns/api/types'

type Props = {
	campaignId: string
}

const statusConfig: Partial<
	Record<
		LogStatusFilter,
		{
			status: 'success' | 'error'
			icon: IconComponent
		}
	>
> = {
	SENT: { status: 'success', icon: IconAllDone },
	FAILED: { status: 'error', icon: IconCancel }
}

const RecipientStatusBadge = ({ status }: { status: LogStatusFilter }) => {
	// Если статус не SENT или FAILED, не показываем бейдж
	if (status !== 'SENT' && status !== 'FAILED') return null

	const config = statusConfig[status]
	if (!config) return null

	const { status: badgeStatus, icon: IconComponent } = config

	return (
		<Badge
			iconLeft={IconComponent}
			size='s'
			status={badgeStatus}
			view='stroked'
			form='round'
		/>
	)
}

export function CampaignRecipientsTab({ campaignId }: Props) {
	const [searchParams, setSearchParams] = useSearchParams()

	const page = Number(searchParams.get('page')) || 1
	const limit = Number(searchParams.get('limit')) || 25

	const { data, isLoading, isError } = useCampaignLogs(campaignId, {
		page,
		limit
	})

	const columns = useMemo(
		() => [
			{
				title: 'Email',
				accessor: 'email',
				width: 400,
				renderHeaderCell: buildHeader({ label: 'Email' }),
				renderCell: ({ row }: { row: CampaignLogItem }) => (
					<DataCell>
						<div className='flex items-center gap-4'>
							<RecipientStatusBadge status={row.status} />
							<Text size='m' view='primary'>
								{row.email}
							</Text>
						</div>
					</DataCell>
				)
			},
			{
				title: 'Доставлено',
				accessor: 'sentAt',
				renderHeaderCell: buildHeader({ label: 'Доставлено' }),
				renderCell: ({ row }: { row: CampaignLogItem }) => (
					<DataCell>
						<Text size='m'>{formatDate(row.sentAt) || '—'}</Text>
					</DataCell>
				)
			},
			{
				title: 'Открыто',
				accessor: 'openedAt',
				renderHeaderCell: buildHeader({ label: 'Открыто' }),
				renderCell: ({ row }: { row: CampaignLogItem }) => (
					<DataCell>
						<Text size='m'>{formatDate(row.openedAt) || '—'}</Text>
					</DataCell>
				)
			},
			{
				title: 'Переход',
				accessor: 'clickedAt',
				renderHeaderCell: buildHeader({ label: 'Переход' }),
				renderCell: ({ row }: { row: CampaignLogItem }) => (
					<DataCell>
						<Text size='m'>{formatDate(row.clickedAt) || '—'}</Text>
					</DataCell>
				)
			},
			{
				title: 'Примечание',
				accessor: 'errorMessage',
				renderHeaderCell: buildHeader({ label: 'Примечание' }),
				renderCell: ({ row }: { row: CampaignLogItem }) => (
					<DataCell>
						<Text size='m' view='alert'>
							{row.errorMessage || '—'}
						</Text>
					</DataCell>
				)
			}
		],
		[]
	)

	const handlePageChange = (offset: number) => {
		const newParams = new URLSearchParams(searchParams)
		newParams.set('page', String(offset / limit + 1))
		setSearchParams(newParams)
	}

	const handleStepChange = (step: number) => {
		const newParams = new URLSearchParams(searchParams)
		newParams.set('limit', String(step))
		newParams.set('page', '1')
		setSearchParams(newParams)
	}

	if (isLoading) {
		return <TableSkeleton columns={5} withSelectColumn={false} />
	}

	if (isError) {
		return (
			<div className='p-4 text-sm text-red-500'>
				Не удалось загрузить получателей. Попробуйте обновить страницу.
			</div>
		)
	}

	if (!data || data.items.length === 0) {
		return (
			<div className='flex w-full justify-center py-10'>
				<ResponsesEmptyPockets
					size='m'
					title='Получателей пока нет'
					description='Как только появятся данные о получателях, они будут отображены здесь.'
					actions={<div />}
				/>
			</div>
		)
	}

	return (
		<div>
			<TableWrapper>
				<Table
					rows={data.items}
					columns={columns}
					getRowKey={(row: CampaignLogItem) => row.id}
				/>
			</TableWrapper>
			{data && data.total > 0 && (
				<div className='mt-8'>
					<TablePagination
						total={data.total}
						offset={(page - 1) * limit}
						step={limit}
						onChange={handlePageChange}
						onStepChange={handleStepChange}
					/>
				</div>
			)}
		</div>
	)
}
