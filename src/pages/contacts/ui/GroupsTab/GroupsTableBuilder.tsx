import { IconSortDown } from '@consta/icons/IconSortDown'
import { IconSortUp } from '@consta/icons/IconSortUp'
import { DataCell } from '@consta/table/DataCell'
import type { TableColumn } from '@consta/table/Table'
import { Text } from '@consta/uikit/Text'
import { useMemo } from 'react'

import { formatDate } from '@/shared/lib/formatDate'
import { RightControlButtons, SelectCol, buildHeader } from '@/shared/ui'

import type { GroupResponseDto, GroupsSortBy } from '@/entities/contacts'

export type UseGroupsTableBuilderParams = {
	sortBy: GroupsSortBy | undefined
	order: 'asc' | 'desc' | undefined
	setSortBy: (s: GroupsSortBy) => void
	setOrder: (o: 'asc' | 'desc') => void
	setPage: (p: number) => void
	allOnPageSelected: boolean
	toggleAllOnPage: () => void
	selectedIds: Set<string>
	toggleOne: (id: string) => void
}

function useGroupsTableBuilder({
	sortBy,
	order,
	setSortBy,
	setOrder,
	setPage,
	allOnPageSelected,
	toggleAllOnPage,
	selectedIds,
	toggleOne
}: UseGroupsTableBuilderParams): TableColumn<GroupResponseDto>[] {
	const makeHeader = (
		label: string,
		keyName: GroupsSortBy
	): TableColumn<GroupResponseDto>['renderHeaderCell'] => {
		const isActive = sortBy === keyName
		const icon = isActive
			? order === 'asc'
				? IconSortUp
				: IconSortDown
			: IconSortDown
		const view: 'clear' | 'ghost' = isActive ? 'ghost' : 'clear'
		return buildHeader({
			label,
			rightControls: (
				<RightControlButtons
					sortView={view}
					sortIcon={icon}
					onSortClick={() => {
						setPage(1)
						if (isActive) setOrder(order === 'asc' ? 'desc' : 'asc')
						else {
							setSortBy(keyName)
							setOrder('asc')
						}
					}}
				/>
			)
		})
	}

	return useMemo<TableColumn<GroupResponseDto>[]>(
		() => [
			SelectCol<GroupResponseDto>({
				allOnPageSelected,
				toggleAllOnPage,
				selectedIds,
				toggleOne
			}),
			{
				title: 'Название',
				accessor: 'name' as any,
				minWidth: 240,
				width: 300,
				renderHeaderCell: makeHeader('Название', 'name'),
				renderCell: ({ row }) => (
					<DataCell>
						<Text size='m'>{row.name}</Text>
					</DataCell>
				)
			},
			{
				title: 'Описание',
				accessor: 'description' as any,
				width: 'auto',
				minWidth: 200,
				renderHeaderCell: buildHeader({ label: 'Описание' }),
				renderCell: ({ row }) => (
					<DataCell>
						<Text size='m'>{row.description || ''}</Text>
					</DataCell>
				)
			},
			{
				title: 'Контакты',
				accessor: 'stats.contactsCount' as any,
				width: 140,
				minWidth: 120,
				renderHeaderCell: buildHeader({ label: 'Контакты' }),
				renderCell: ({ row }) => {
					const count =
						(row as any)?.contactsCount ?? row.stats?.contactsCount ?? 0
					return (
						<DataCell>
							<Text size='m'>{count}</Text>
						</DataCell>
					)
				}
			},
			{
				title: 'Дата обновления',
				accessor: 'updatedAt' as any,
				width: 200,
				minWidth: 180,
				renderHeaderCell: makeHeader('Дата обновления', 'updatedAt'),
				renderCell: ({ row }) => (
					<DataCell>
						<Text size='m'>{formatDate(row.updatedAt)}</Text>
					</DataCell>
				)
			},
			{
				title: 'Дата создания',
				accessor: 'createdAt' as any,
				width: 200,
				minWidth: 180,
				renderHeaderCell: makeHeader('Дата создания', 'createdAt'),
				renderCell: ({ row }) => (
					<DataCell>
						<Text size='m'>{formatDate(row.createdAt)}</Text>
					</DataCell>
				)
			}
		],
		[
			allOnPageSelected,
			toggleAllOnPage,
			selectedIds,
			toggleOne,
			sortBy,
			order,
			setSortBy,
			setOrder,
			setPage
		]
	)
}

export default useGroupsTableBuilder
