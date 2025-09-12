import { IconRevert } from '@consta/icons/IconRevert'
import { IconTrash } from '@consta/icons/IconTrash'
import { DataCell } from '@consta/table/DataCell'
import { Table } from '@consta/table/Table'
import { Button } from '@consta/uikit/Button'
import { ResponsesEmptyPockets } from '@consta/uikit/ResponsesEmptyPockets'
import { Text } from '@consta/uikit/Text'
import React from 'react'

import { formatDate } from '@/shared/lib/formatDate'
import { TableSkeleton } from '@/shared/ui/Skeletons'
import { TablePagination, TableWrapper } from '@/shared/ui/Table'

import type { GetTrashedContactsResponseDto } from '@/entities/contacts'

type TrashContactsTableProps = {
	data: GetTrashedContactsResponseDto | undefined
	isLoading: boolean
	isError: boolean
	page: number
	limit: number
	setPage: (page: number) => void
	setLimit: (limit: number) => void
	onRestore: (id: string) => void
	onDelete: (id: string) => void
	isRestoring: boolean
	isDeleting: boolean
	search: string
	setSearch: (value: string) => void
}

export const TrashContactsTable: React.FC<TrashContactsTableProps> = ({
	data,
	isLoading,
	isError,
	page,
	limit,
	setPage,
	setLimit,
	onRestore,
	onDelete,
	isRestoring,
	isDeleting,
	search,
	setSearch
}) => {
	const contacts = data?.contacts || []
	const total = data?.pagination?.total || 0
	const offset = (page - 1) * limit

	const columns = [
		{
			title: 'Email',
			accessor: 'email',
			width: 300,
			renderCell: ({ row }: { row: any }) => (
				<DataCell>
					<Text size='m'>{row.email}</Text>
				</DataCell>
			)
		},
		{
			title: 'Дата удаления',
			accessor: 'deletedAt',
			width: 200,
			renderCell: ({ row }: { row: any }) => (
				<DataCell>
					<Text size='m'>{formatDate(row.deletedAt)}</Text>
				</DataCell>
			)
		},
		{
			title: 'Действия',
			accessor: 'actions',
			width: 150,
			renderCell: ({ row }: { row: any }) => (
				<div className='flex items-center gap-2'>
					<Button
						view='clear'
						onlyIcon
						iconLeft={IconRevert}
						title='Восстановить'
						iconSize='s'
						onClick={() => onRestore(row.id)}
						disabled={isRestoring || isDeleting}
					/>
					<Button
						view='clear'
						onlyIcon
						iconLeft={IconTrash}
						title='Удалить навсегда'
						iconSize='s'
						onClick={() => onDelete(row.id)}
						disabled={isRestoring || isDeleting}
					/>
				</div>
			)
		}
	]

	if (isLoading) {
		return <TableSkeleton rows={5} columns={3} />
	}

	if (isError) {
		return (
			<div className='p-4 text-center text-red-500'>
				Не удалось загрузить данные. Попробуйте еще раз.
			</div>
		)
	}

	if (contacts.length === 0) {
		return (
			<div className='flex justify-center py-10'>
				<ResponsesEmptyPockets
					size='m'
					title={search ? 'Ничего не найдено' : 'Корзина пуста'}
					description={
						search
							? 'По вашему запросу ничего не найдено.'
							: 'Здесь будут отображаться удаленные контакты.'
					}
					actions={
						search ? (
							<Button
								size='m'
								view='primary'
								label='Сбросить поиск'
								onClick={() => setSearch('')}
							/>
						) : undefined
					}
				/>
			</div>
		)
	}

	return (
		<>
			<TableWrapper>
				<Table
					rows={contacts}
					columns={columns as any}
					zebraStriped
					getRowKey={row => row.id}
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
		</>
	)
}
