import { IconSortDown } from '@consta/icons/IconSortDown'
import { IconSortUp } from '@consta/icons/IconSortUp'
import { DataCell } from '@consta/table/DataCell'
import type { TableColumn } from '@consta/table/Table'
import { Badge } from '@consta/uikit/Badge'
import { Text } from '@consta/uikit/Text'
import { useMemo } from 'react'

import {
	COL_WIDTH_MAX,
	COL_WIDTH_MIN,
	STATUS_COL_WIDTH
} from '@/features/column-manager'

import { formatDate } from '@/shared/lib/formatDate'
import { RightControlButtons, SelectCol, buildHeader } from '@/shared/ui'

import type { ContactFieldType } from '@/entities/contacts'

export type UseGroupMembersTableParams<_T extends { id: string }> = {
	fieldsData: { fields?: Array<any> } | undefined
	sortBy: string | undefined
	sortOrder: 'asc' | 'desc' | undefined
	setSortBy: (key: string) => void
	setSortOrder: (order: 'asc' | 'desc') => void
	setPage: (page: number) => void
	selectedIds: Set<string>
	allOnPageSelected: boolean
	toggleAllOnPage: () => void
	toggleOne: (id: string) => void
}

export default function useGroupMembersTable<T extends { id: string } = any>({
	fieldsData,
	sortBy,
	sortOrder,
	setSortBy,
	setSortOrder,
	setPage,
	selectedIds,
	allOnPageSelected,
	toggleAllOnPage,
	toggleOne
}: UseGroupMembersTableParams<T>) {
	const columns: TableColumn<T>[] = useMemo(() => {
		const clamp = (v: number | undefined) => {
			const n = typeof v === 'number' ? v : 150
			return Math.max(COL_WIDTH_MIN, Math.min(COL_WIDTH_MAX, n))
		}

		const makeHeader = (
			label: string,
			keyName: string
		): TableColumn<T>['renderHeaderCell'] => {
			const isActive = sortBy === keyName
			const icon = isActive
				? sortOrder === 'asc'
					? IconSortUp
					: IconSortDown
				: IconSortDown
			const sortView: 'clear' | 'ghost' = isActive ? 'ghost' : 'clear'
			return buildHeader({
				label,
				rightControls: (
					<RightControlButtons
						sortView={sortView}
						sortIcon={icon}
						onSortClick={() => {
							setPage(1)
							if (isActive)
								setSortOrder(
									(sortOrder === 'asc' ? 'desc' : 'asc') as 'asc' | 'desc'
								)
							else {
								setSortBy(keyName)
								setSortOrder('asc')
							}
						}}
					/>
				)
			})
		}

		const renderByType =
			(f: any) =>
			({ row }: { row: any }) => {
				const raw = row?.[f.key]
				const t = f.fieldType as ContactFieldType
				if (raw == null)
					return (
						<DataCell>
							<Text size='m'>-</Text>
						</DataCell>
					)
				switch (t) {
					case 'DATE':
						return (
							<DataCell>
								<Text size='m'>{formatDate(raw)}</Text>
							</DataCell>
						)
					case 'NUMBER': {
						const num = Number(raw)
						return (
							<DataCell>
								<Text size='m'>
									{Number.isFinite(num)
										? num.toLocaleString('ru-RU')
										: String(raw)}
								</Text>
							</DataCell>
						)
					}
					case 'URL':
						return (
							<DataCell>
								<a
									href={String(raw)}
									target='_blank'
									rel='noreferrer'
									className='underline'
								>
									<Text size='m'>{String(raw)}</Text>
								</a>
							</DataCell>
						)
					case 'EMAIL':
						return (
							<DataCell>
								<a href={`mailto:${String(raw)}`} className='underline'>
									<Text size='m'>{String(raw)}</Text>
								</a>
							</DataCell>
						)
					case 'SELECT': {
						const options = f?.fieldMetadata?.options || []
						const val = String(raw)
						const found = options.find((o: any) => o.value === val)
						return (
							<DataCell>
								<Text size='m'>{found?.label ?? val}</Text>
							</DataCell>
						)
					}
					default:
						return (
							<DataCell>
								<Text size='m'>{String(raw)}</Text>
							</DataCell>
						)
				}
			}

		const selectCol = SelectCol<T>({
			allOnPageSelected,
			toggleAllOnPage,
			selectedIds,
			toggleOne
		}) as unknown as TableColumn<T>

		const userColumns: TableColumn<T>[] = (fieldsData?.fields || [])
			.filter((f: any) => f.isVisible && f.key !== 'status')
			.sort((a: any, b: any) => a.sortOrder - b.sortOrder)
			.map((f: any) => ({
				title: f.name,
				accessor: f.key as any,
				width: clamp(f.columnWidth),
				minWidth: COL_WIDTH_MIN,
				renderHeaderCell: makeHeader(f.name, f.key),
				renderCell: renderByType(f)
			}))

		const statusCol: TableColumn<T> = {
			title: 'Статус',
			accessor: 'status' as any,
			width: STATUS_COL_WIDTH,
			minWidth: STATUS_COL_WIDTH,
			renderHeaderCell: makeHeader('Статус', 'status'),
			renderCell: ({ row }: any) => {
				const status = row.status as string | undefined
				const map: Record<string, { status: any; label: string }> = {
					ACTIVE: { status: 'success', label: 'Активен' },
					UNSUBSCRIBED: { status: 'warning', label: 'Отписан' },
					BOUNCED: { status: 'alert', label: 'Недоставлено' },
					SPAM: { status: 'error', label: 'Спам' }
				}
				const badge = status
					? map[status] || { status: 'normal', label: status }
					: undefined
				return (
					<DataCell>
						{badge ? (
							<Badge
								size='s'
								status={badge.status as any}
								label={badge.label}
							/>
						) : (
							'-'
						)}
					</DataCell>
				)
			}
		}

		return [selectCol, ...userColumns, statusCol]
	}, [
		fieldsData,
		sortBy,
		sortOrder,
		setPage,
		setSortBy,
		setSortOrder,
		selectedIds,
		allOnPageSelected,
		toggleAllOnPage,
		toggleOne
	])

	return { columns }
}
