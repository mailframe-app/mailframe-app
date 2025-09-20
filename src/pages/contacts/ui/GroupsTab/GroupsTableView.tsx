import { IconAllDone } from '@consta/icons/IconAllDone'
import { IconCopy } from '@consta/icons/IconCopy'
import { IconEdit } from '@consta/icons/IconEdit'
import { IconOperators } from '@consta/icons/IconOperators'
import { IconRevert } from '@consta/icons/IconRevert'
import { IconShare } from '@consta/icons/IconShare'
import { IconTrash } from '@consta/icons/IconTrash'
import type { TableColumn } from '@consta/table/Table'
import { Table } from '@consta/table/Table'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { ResponsesEmptyPockets } from '@consta/uikit/ResponsesEmptyPockets'
import { forwardRef, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { TableSkeleton } from '@/shared/ui/Skeletons'
import { TablePagination, TableWrapper } from '@/shared/ui/Table'

import ActionsBar from '../../components/ActionsBar'

import type { GroupResponseDto, GroupsSortBy } from '@/entities/contacts'
import {
	ContextMenu as WidgetContextMenu,
	buildItems
} from '@/widgets/contextMenu'

type GroupsTableViewProps = {
	search: string
	setSearch: (value: string) => void
	page: number
	setPage: (page: number) => void
	limit: number
	setLimit: (limit: number) => void
	sortBy: GroupsSortBy | undefined
	setSortBy: (sortBy: GroupsSortBy) => void
	order: 'asc' | 'desc' | undefined
	setOrder: (order: 'asc' | 'desc') => void
	items: GroupResponseDto[]
	total: number
	offset: number
	showInitialSkeleton: boolean
	columns: TableColumn<GroupResponseDto>[]
	selectedIds: Set<string>
	clearSelection: () => void
	onOpenMerge: () => void
	onOpenDelete: (ids: string[], name?: string) => void
	onOpenEdit: (group: GroupResponseDto) => void
	onOpenClone: (data: { id: string; name: string }) => void
}

export const GroupsTableView = forwardRef<HTMLDivElement, GroupsTableViewProps>(
	(props, ref) => {
		const {
			search,
			setSearch,
			setPage,
			limit,
			setLimit,
			items,
			total,
			offset,
			showInitialSkeleton,
			columns,
			selectedIds,
			clearSelection,
			onOpenMerge,
			onOpenDelete,
			onOpenEdit,
			onOpenClone
		} = props

		const navigate = useNavigate()
		const [isActionsOpen, setIsActionsOpen] = useState(false)
		const [rowMenuOpen, setRowMenuOpen] = useState<{
			isOpen: boolean
			x: number
			y: number
			row: GroupResponseDto | null
		}>({ isOpen: false, x: 0, y: 0, row: null })
		const rowMenuAnchorRef = useRef<HTMLDivElement>(null)
		const contextMenuRef = useRef<HTMLDivElement>(null)

		const renderTable = () => {
			return (
				<Card
					verticalSpace='l'
					horizontalSpace='l'
					className='!rounded-lg'
					shadow={false}
					style={{
						backgroundColor: 'var(--color-bg-default)'
					}}
				>
					<ActionsBar
						placeholder='Поиск по группам'
						search={search}
						onSearchChange={v => {
							setPage(1)
							setSearch(v)
						}}
						isActionsOpen={isActionsOpen}
						onToggleActions={() => setIsActionsOpen((prev: boolean) => !prev)}
						onCloseActions={() => setIsActionsOpen(false)}
						actionsDisabled={selectedIds.size === 0}
						items={[
							{
								key: 'merge',
								label: 'Объединить группы',
								leftIcon: IconShare,
								onClick: onOpenMerge
							},
							{
								key: 'bulkDelete',
								label: 'Удалить группы',
								status: 'alert',
								leftIcon: IconTrash,
								onClick: () => onOpenDelete(Array.from(selectedIds))
							}
						]}
						rightExtras={
							selectedIds.size > 0 && (
								<div className='flex items-center gap-2'>
									<Button
										view='clear'
										iconLeft={IconAllDone}
										label={`${selectedIds.size}`}
										title={`Выбрано элементов: ${selectedIds.size}`}
									/>
									<Button
										view='clear'
										onlyIcon
										iconSize='s'
										iconLeft={IconRevert}
										onClick={clearSelection}
										title='Отменить выделение'
									/>
								</div>
							)
						}
					/>
					{showInitialSkeleton && (
						<div className='w-full py-4'>
							<TableSkeleton rows={6} columns={5} withSelectColumn />
						</div>
					)}
					{!showInitialSkeleton &&
						(items.length === 0 ? (
							<div className='flex w-full justify-center p-6 py-10'>
								<ResponsesEmptyPockets
									size='m'
									title='По заданным условиям ничего не найдено'
									description='Попробуйте изменить условия поиска'
									actions={
										<Button
											size='m'
											view='primary'
											label='Сбросить фильтры'
											onClick={() => setSearch('')}
										/>
									}
								/>
							</div>
						) : (
							<>
								<TableWrapper>
									<Table
										rows={items as any}
										columns={columns as any}
										resizable='outside'
										getRowKey={(row: any) => row.id}
										headerZIndex={10}
										stickyHeader={false}
										rowHoverEffect
										onRowClick={(
											row: GroupResponseDto,
											{ e }: { e: React.MouseEvent }
										) => {
											if (
												(e.target as HTMLElement).closest('[data-no-row-click]')
											) {
												return
											}
											e.preventDefault()
											setRowMenuOpen({
												isOpen: true,
												x: e.clientX,
												y: e.clientY,
												row
											})
										}}
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
						))}
				</Card>
			)
		}

		const renderContextMenu = () => {
			if (!rowMenuOpen.isOpen) return null

			return (
				<>
					<div
						ref={rowMenuAnchorRef}
						style={{
							position: 'fixed',
							left: rowMenuOpen.x,
							top: rowMenuOpen.y,
							width: 1,
							height: 1,
							pointerEvents: 'none'
						}}
					/>
					<div ref={contextMenuRef}>
						<WidgetContextMenu
							items={buildItems<GroupResponseDto>(
								rowMenuOpen.row as GroupResponseDto,
								[
									{
										key: 'open',
										label: 'Открыть',
										leftIcon: IconOperators,
										onClick: r => navigate(`/contacts/groups/${r.id}`)
									},
									{
										key: 'edit',
										label: 'Редактировать',
										leftIcon: IconEdit,
										onClick: r => onOpenEdit(r)
									},
									{
										key: 'clone',
										label: 'Копировать',
										leftIcon: IconCopy,
										onClick: r =>
											onOpenClone({
												id: r.id,
												name: r.name
											})
									},
									{
										key: 'delete',
										label: 'Удалить',
										status: 'alert',
										leftIcon: IconTrash,
										onClick: r => onOpenDelete([r.id], r.name)
									}
								]
							)}
							anchorRef={rowMenuAnchorRef as any}
							isOpen
							onClickOutside={() =>
								setRowMenuOpen({
									isOpen: false,
									x: 0,
									y: 0,
									row: null
								})
							}
							row={rowMenuOpen.row}
						/>
					</div>
				</>
			)
		}

		return (
			<div ref={ref}>
				{renderTable()}
				{renderContextMenu()}
			</div>
		)
	}
)

export default GroupsTableView
