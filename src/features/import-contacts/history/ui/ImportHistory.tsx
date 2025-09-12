import { AnimateIconSwitcherProvider } from '@consta/icons/AnimateIconSwitcherProvider'
import { IconArrowRight } from '@consta/icons/IconArrowRight'
import { withAnimateSwitcherHOC } from '@consta/icons/withAnimateSwitcherHOC'
import { Table } from '@consta/table/Table'
import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

import { formatDate } from '@/shared/lib/formatDate'
import { TablePagination, TableWrapper, buildHeader } from '@/shared/ui/Table'

import { importHistoryQuery } from '@/entities/contacts'
import type {
	GetImportHistoryQueryDto,
	ImportHistoryItemDto
} from '@/entities/contacts/api/types'

const IconArrow = withAnimateSwitcherHOC({
	startIcon: IconArrowRight,
	startDirection: 0,
	endDirection: 90
})

type Row = ImportHistoryItemDto | { isInfo: string; errors: string[] | null }

export function ImportHistory() {
	const [opened, setOpened] = useState<string[]>([])
	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(10)
	const { data } = useQuery({
		...importHistoryQuery({ page, limit } as GetImportHistoryQueryDto)
	})

	const rows = useMemo<Row[]>(() => {
		const items = data?.items || []
		const result: Row[] = []
		items.forEach(i => {
			result.push(i)
			if (opened.includes(i.id)) {
				result.push({ isInfo: i.id, errors: i.errors || null })
			}
		})
		return result
	}, [data?.items, opened])

	function toggle(id: string) {
		setOpened(prev =>
			prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
		)
	}

	const renderStatus = (status: string) => {
		const colorMap: Record<string, string> = {
			PROCESSING: 'text-[var(--color-typo-warning)]',
			QUEUED: 'text-[var(--color-typo-warning)]',
			COMPLETED: 'text-[var(--color-typo-success)]',
			FAILED: 'text-[var(--color-typo-alert)]',
			CANCELLED: 'text-[var(--color-typo-secondary)]'
		}
		const statusLabels: Record<string, string> = {
			PROCESSING: 'В обработке',
			QUEUED: 'В очереди',
			COMPLETED: 'Завершён',
			FAILED: 'Ошибка',
			CANCELLED: 'Отменён'
		}
		return (
			<span className={colorMap[status] || ''}>
				{statusLabels[status] || status}
			</span>
		)
	}

	const columns = useMemo(
		() => [
			{
				title: 'Файл',
				accessor: 'fileName',
				renderHeaderCell: buildHeader({ label: 'Файл' }),
				renderCell: ({ row }: { row: Row }) => {
					if ('isInfo' in row) {
						const errs = row.errors || []
						return (
							<div className='border-border rounded border p-3'>
								<Text size='s'>Ошибки ({errs.length})</Text>
								<div className='mt-2 max-h-64 overflow-auto text-xs'>
									{errs.map((e, idx) => (
										<div
											key={idx}
											className='mb-2 break-all whitespace-pre-wrap opacity-80'
										>
											{typeof e === 'string' ? e : JSON.stringify(e)}
										</div>
									))}
									{errs.length === 0 && (
										<Text size='xs' view='secondary'>
											Нет ошибок
										</Text>
									)}
								</div>
							</div>
						)
					}
					const r = row as ImportHistoryItemDto
					const openedNow = opened.includes(r.id)
					return (
						<AnimateIconSwitcherProvider active={openedNow}>
							<div className='flex items-center gap-2'>
								<Button
									size='s'
									view='clear'
									onlyIcon
									iconLeft={IconArrow}
									onClick={() => toggle(r.id)}
								/>
								<Text>{r.fileName}</Text>
							</div>
						</AnimateIconSwitcherProvider>
					)
				},
				colSpan: ({ row }: { row: Row }) => ('isInfo' in row ? 'end' : 1),
				width: 320
			},
			{
				title: 'Статус',
				accessor: 'status',
				renderHeaderCell: buildHeader({ label: 'Статус' }),
				width: 140,
				renderCell: ({ row }: { row: Row }) =>
					'isInfo' in row
						? null
						: renderStatus((row as ImportHistoryItemDto).status)
			},
			{
				title: 'Всего',
				accessor: 'totalRecords',
				renderHeaderCell: buildHeader({ label: 'Всего' }),
				width: 100
			},
			{
				title: 'Успешно',
				accessor: 'successRecords',
				renderHeaderCell: buildHeader({ label: 'Успешно' }),
				width: 120
			},
			{
				title: 'Ошибки',
				accessor: 'failedRecords',
				renderHeaderCell: buildHeader({ label: 'Ошибки' }),
				width: 100
			},
			{
				title: 'Создан',
				accessor: 'createdAt',
				renderHeaderCell: buildHeader({ label: 'Создан' }),
				width: 200,
				renderCell: ({ row }: { row: Row }) =>
					'isInfo' in row
						? null
						: formatDate((row as ImportHistoryItemDto).createdAt)
			},
			{
				title: 'Обновлён',
				accessor: 'updatedAt',
				renderHeaderCell: buildHeader({ label: 'Обновлён' }),
				width: 200,
				renderCell: ({ row }: { row: Row }) =>
					'isInfo' in row
						? null
						: formatDate((row as ImportHistoryItemDto).updatedAt)
			}
		],
		[opened]
	)

	const total = data?.pagination?.total || 0
	const offset = (page - 1) * limit

	return (
		<div className='flex h-full flex-col gap-3 p-4'>
			<Text size='s' view='secondary'>
				Последние сессии импорта. Нажмите на строку, чтобы посмотреть
				подробности.
			</Text>
			<TableWrapper className='flex-1 overflow-auto'>
				<Table
					rows={rows as any[]}
					columns={columns as any}
					stickyHeader
					getRowKey={(row: any) =>
						'isInfo' in row ? `${row.isInfo}-info` : row.id
					}
				/>
			</TableWrapper>
			<TablePagination
				total={total}
				offset={offset}
				step={limit}
				onChange={(newOffset: number) => {
					const newPage = Math.floor(newOffset / limit) + 1
					setPage(newPage)
				}}
				onStepChange={(newStep: number) => {
					setLimit(newStep)
					setPage(1)
				}}
			/>
		</div>
	)
}
