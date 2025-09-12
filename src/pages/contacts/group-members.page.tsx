import { IconAdd } from '@consta/icons/IconAdd'
import { IconAllDone } from '@consta/icons/IconAllDone'
import { IconBackward } from '@consta/icons/IconBackward'
import { IconCopy } from '@consta/icons/IconCopy'
import { IconEdit } from '@consta/icons/IconEdit'
import { IconRemove } from '@consta/icons/IconRemove'
import { IconRevert } from '@consta/icons/IconRevert'
import { IconSortDown } from '@consta/icons/IconSortDown'
import { IconSortUp } from '@consta/icons/IconSortUp'
import { IconTrash } from '@consta/icons/IconTrash'
import { DataCell } from '@consta/table/DataCell'
import type { TableColumn } from '@consta/table/Table'
import { Table } from '@consta/table/Table'
import { Button } from '@consta/uikit/Button'
import { Layout } from '@consta/uikit/Layout'
import { ResponsesEmptyPockets } from '@consta/uikit/ResponsesEmptyPockets'
import { Text } from '@consta/uikit/Text'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
	COL_WIDTH_MAX,
	COL_WIDTH_MIN,
	useColumnsWidthPersistence
} from '@/features/column-manager'
import {
	BulkAddToGroupsModal,
	BulkUpdateFieldModal
} from '@/features/contacts-bulk'
import { AddMembersModal } from '@/features/contacts-groups/group-add-members'
import { CloneGroupModal } from '@/features/contacts-groups/group-clone'
import { DeleteGroupsModal } from '@/features/contacts-groups/group-delete'
import { EditGroupModal } from '@/features/contacts-groups/group-edit'
import {
	ContactRowContent,
	ExpandableEmailCell,
	type TableRow,
	isContactDto,
	isContactInfoRow,
	useExpandableContactRow
} from '@/features/contacts/expandable-contact-row'
import { useTableUrlSync } from '@/features/table-url-sync'

import { PRIVATE_ROUTES } from '@/shared/constants'
import { formatDate, showCustomToast } from '@/shared/lib'
import DeleteConfirmModal from '@/shared/ui/Modals/DeleteConfirmModal'
import { TableSkeleton } from '@/shared/ui/Skeletons'
import {
	RightControlButtons,
	SelectCol,
	TablePagination,
	TableWrapper,
	buildHeader
} from '@/shared/ui/Table'

import ActionsBar from './components/ActionsBar'
import GroupMembersHeader from './ui/GroupMembers/GroupMembersHeader'
import {
	CONTACTS_DEFAULT_LIMIT,
	CONTACTS_DEFAULT_PAGE,
	type ContactFieldType,
	GROUPS_DEFAULT_LIMIT,
	type GetContactsQueryDto,
	useContactFields,
	useContacts,
	useGroups,
	useInvalidateContacts,
	useInvalidateFields,
	useInvalidateGroups,
	useRefetchFields,
	useRemoveMembersFromGroupMutation,
	useUpdateField
} from '@/entities/contacts'

// useTableSelection hook (copied from ContactsTab)
function useTableSelection<T extends { id: string }>(pageItems: T[]) {
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

	const currentPageIds = useMemo(
		() => pageItems.map(item => item.id),
		[pageItems]
	)

	const allOnPageSelected = useMemo(
		() =>
			currentPageIds.length > 0 &&
			currentPageIds.every(id => selectedIds.has(id)),
		[currentPageIds, selectedIds]
	)

	const toggleAllOnPage = useCallback(() => {
		setSelectedIds(prev => {
			const next = new Set(prev)
			if (allOnPageSelected) {
				currentPageIds.forEach(id => next.delete(id))
			} else {
				currentPageIds.forEach(id => next.add(id))
			}
			return next
		})
	}, [allOnPageSelected, currentPageIds])

	const toggleOne = useCallback((id: string) => {
		setSelectedIds(prev => {
			const next = new Set(prev)
			if (next.has(id)) {
				next.delete(id)
			} else {
				next.add(id)
			}
			return next
		})
	}, [])

	const clearSelection = useCallback(() => {
		setSelectedIds(new Set())
	}, [])

	return {
		selectedIds,
		allOnPageSelected,
		toggleAllOnPage,
		toggleOne,
		clearSelection
	}
}

function GroupMembersPage() {
	const navigate = useNavigate()
	const { groupId = '' } =
		useParams<'/contacts/groups/:groupId'>() as unknown as {
			groupId: string
		}

	// URL-synced table state (search has built-in debounce)
	const {
		page,
		setPage,
		limit,
		setLimit,
		search,
		setSearch,
		debouncedSearch,
		sortBy,
		setSortBy,
		sortOrder,
		setSortOrder
	} = useTableUrlSync({
		defaults: { page: CONTACTS_DEFAULT_PAGE, limit: CONTACTS_DEFAULT_LIMIT }
	})

	// Search handler with page reset
	const handleSearchChange = useCallback(
		(value: string) => {
			setPage(1)
			setSearch(value)
		},
		[setPage, setSearch]
	)

	// Data params
	const params: GetContactsQueryDto = useMemo(
		() => ({
			page,
			limit,
			search: debouncedSearch || undefined,
			sortBy,
			sortOrder,
			groupId // Filter by group
		}),
		[page, limit, debouncedSearch, sortBy, sortOrder, groupId]
	)

	// Load data
	const {
		data: fieldsData,
		isLoading: isFieldsLoading,
		isError: isFieldsError
	} = useContactFields()

	const {
		data: contactsData,
		isLoading: isContactsLoading,
		isError: isContactsError
	} = useContacts(params)

	const items = useMemo(() => contactsData?.contacts || [], [contactsData])
	const total = contactsData?.pagination.total || 0
	const offset = (page - 1) * limit

	// Group metadata
	const { data: groupsList } = useGroups({
		page: 1,
		limit: GROUPS_DEFAULT_LIMIT
	} as any)
	const groupMeta = useMemo(
		() => groupsList?.items?.find(g => g.id === groupId),
		[groupsList, groupId]
	)

	// Big empty state logic (like in ContactsTab)
	const [showBigEmpty, setShowBigEmpty] = useState(false)
	const didInitCheckRef = useRef(false)

	useEffect(() => {
		if (didInitCheckRef.current) return
		const noQuery = (debouncedSearch || '').trim() === ''
		if (!isContactsLoading && !isContactsError && noQuery && total === 0) {
			setShowBigEmpty(true)
			didInitCheckRef.current = true
		}
	}, [isContactsLoading, isContactsError, total, debouncedSearch])

	// Selection logic
	const {
		selectedIds,
		allOnPageSelected,
		toggleAllOnPage,
		toggleOne,
		clearSelection
	} = useTableSelection(items)

	// Modal states
	const [isActionsOpen, setIsActionsOpen] = useState(false)
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [isCloneOpen, setIsCloneOpen] = useState(false)
	const [isDeleteOpen, setIsDeleteOpen] = useState(false)
	const [isAddOpen, setIsAddOpen] = useState(false)
	const [isUpdateFieldOpen, setIsUpdateFieldOpen] = useState(false)
	const [isMoveOpen, setIsMoveOpen] = useState(false)
	const [isCopyOpen, setIsCopyOpen] = useState(false)
	const [isExcludeOpen, setIsExcludeOpen] = useState(false)

	// Invalidate helpers
	const invalidateContacts = useInvalidateContacts()
	const invalidateGroups = useInvalidateGroups()
	const invalidateFields = useInvalidateFields()
	const refetchFieldsNow = useRefetchFields()

	// Mutations
	const excludeMutation = useRemoveMembersFromGroupMutation()
	const updateFieldMutation = useUpdateField()

	// Column width persistence
	const keyToId = useMemo(() => {
		const map = new Map<string, string>()
		;(fieldsData?.fields || []).forEach((f: any) => map.set(f.key, f.id))
		return map
	}, [fieldsData])

	const { registerHeaderRef, enable } = useColumnsWidthPersistence({
		keyToId,
		ignoreInitialMs: 800,
		shouldSend: (key, width) => {
			const f = (fieldsData?.fields || []).find((x: any) => x.key === key)
			if (!f) return false
			const current = Math.round(Number(f.columnWidth ?? 0))
			return current !== Math.round(width)
		},
		onCommit: async updates => {
			await Promise.all(
				updates.map(u =>
					updateFieldMutation
						.mutateAsync({
							id: u.id,
							dto: { columnWidth: u.width }
						} as any)
						.catch(() => null)
				)
			)
			await refetchFieldsNow()
		}
	})

	// Expandable rows state
	const { expandedRows, toggleRow, closeRow } = useExpandableContactRow()

	// Get email value function
	const getEmailValue = useCallback((contact: any): string => {
		return contact.email || ''
	}, [])

	// Create rows with info-rows for expanded contacts
	const rows = useMemo(() => {
		const result: TableRow[] = []

		items.forEach(contact => {
			result.push(contact)

			// Add info-row after contact if expanded
			if (expandedRows.includes(contact.id)) {
				result.push({
					isInfo: true,
					contactId: contact.id,
					contact
				})
			}
		})

		return result
	}, [items, expandedRows])

	// Header creation function with sorting
	const makeHeader = (label: string, keyName: string) => {
		const isActive = sortBy === keyName
		const icon = isActive
			? sortOrder === 'asc'
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
						if (isActive) {
							setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
						} else {
							setSortBy(keyName)
							setSortOrder('asc')
						}
					}}
				/>
			)
		})
	}

	// Render by field type function
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

	// Build columns
	const columns: TableColumn<TableRow>[] = useMemo(() => {
		if (!fieldsData?.fields) return []

		// Column width clamp function
		const clamp = (v: number | undefined) => {
			const n = typeof v === 'number' ? v : 150
			return Math.max(COL_WIDTH_MIN, Math.min(COL_WIDTH_MAX, n))
		}

		// SelectCol as first column - adapt for TableRow
		const selectColBase = SelectCol<any>({
			allOnPageSelected,
			toggleAllOnPage,
			selectedIds,
			toggleOne
		})

		const selectCol: TableColumn<TableRow> = {
			...selectColBase,
			renderCell: ({ row }: { row: TableRow }) => {
				// Hide checkbox for info-rows
				if (isContactInfoRow(row)) {
					return null
				}

				// For regular contacts - use original renderCell
				if (selectColBase.renderCell) {
					return selectColBase.renderCell({ row } as any)
				}

				return null
			}
		}

		// Build user columns based on fields
		const userColumns: TableColumn<TableRow>[] = (fieldsData.fields || [])
			.filter(f => f.isVisible && f.key !== 'status')
			.sort((a, b) => a.sortOrder - b.sortOrder)
			.map(f => {
				// Special handling for email column
				if (f.fieldType === 'EMAIL') {
					return {
						title: f.name,
						accessor: f.key as any,
						width: clamp(f.columnWidth),
						minWidth: COL_WIDTH_MIN,
						maxWidth: COL_WIDTH_MAX,
						renderHeaderCell: () => (
							<div ref={registerHeaderRef(f.key)}>
								{makeHeader(f.name, f.key)!(undefined as any)}
							</div>
						),
						renderCell: ({ row }: { row: TableRow }) => {
							if (isContactInfoRow(row)) {
								return (
									<ContactRowContent
										contact={row.contact}
										onClose={() => closeRow(row.contactId)}
									/>
								)
							}

							if (isContactDto(row)) {
								return (
									<ExpandableEmailCell
										contact={row}
										email={getEmailValue(row)}
										isExpanded={expandedRows.includes(row.id)}
										onToggle={toggleRow}
									/>
								)
							}

							return null
						},
						colSpan: ({ row }: { row: TableRow }) =>
							isContactInfoRow(row) ? 'end' : 1
					}
				}

				// Regular columns
				return {
					title: f.name,
					accessor: f.key as any,
					width: clamp(f.columnWidth),
					minWidth: COL_WIDTH_MIN,
					maxWidth: COL_WIDTH_MAX,
					renderHeaderCell: () => (
						<div ref={registerHeaderRef(f.key)}>
							{makeHeader(f.name, f.key)!(undefined as any)}
						</div>
					),
					renderCell: renderByType(f)
				}
			})

		return [selectCol, ...userColumns]
	}, [
		fieldsData,
		sortBy,
		sortOrder,
		allOnPageSelected,
		selectedIds,
		registerHeaderRef,
		expandedRows,
		toggleRow,
		closeRow,
		getEmailValue
	])

	// Show skeleton condition
	const showSkeleton = isFieldsLoading || isContactsLoading

	// Error handling
	if (isFieldsError || isContactsError) {
		return (
			<Layout direction='column' className='w-full'>
				<div className='mb-2 flex items-start justify-between'>
					<div className='flex items-start gap-4'>
						<Button
							view='ghost'
							onlyIcon
							iconLeft={IconBackward}
							size='m'
							aria-label='Назад'
							onClick={() => navigate(PRIVATE_ROUTES.CONTACTS + '?tab=groups')}
						/>
						<div className='flex flex-col'>
							<Text size='3xl' view='primary' weight='bold' className='mb-2'>
								{groupMeta?.name || 'Группа'}
							</Text>
						</div>
					</div>
				</div>
				<div className='p-4 text-sm text-red-500'>
					Не удалось загрузить данные. Попробуйте обновить страницу.
				</div>
			</Layout>
		)
	}

	return (
		<Layout direction='column' className='w-full'>
			{/* Header */}
			<GroupMembersHeader
				title={groupMeta?.name || 'Группа'}
				description={groupMeta?.description}
				updatedAt={
					groupMeta?.updatedAt ? formatDate(groupMeta.updatedAt) : undefined
				}
				onBack={() => navigate(PRIVATE_ROUTES.CONTACTS + '?tab=groups')}
				settingsItems={[
					{
						key: 'rename',
						label: 'Редактировать группу',
						leftIcon: IconEdit,
						onClick: () => setIsEditOpen(true)
					},
					{
						key: 'duplicate',
						label: 'Дублировать группу',
						leftIcon: IconCopy,
						onClick: () => setIsCloneOpen(true)
					},
					{
						key: 'delete',
						label: 'Удалить группу',
						leftIcon: IconTrash,
						status: 'alert',
						onClick: () => setIsDeleteOpen(true)
					}
				]}
				rightContent={
					<Button
						view='primary'
						size='m'
						label='Добавить участников'
						onClick={() => setIsAddOpen(true)}
					/>
				}
			/>

			{/* Big empty state */}
			{showBigEmpty ? (
				<div className='flex w-full justify-center py-10'>
					<ResponsesEmptyPockets
						size='m'
						title='В группе пока нет участников'
						description='Добавляйте участников в группу, чтобы использовать их в рассылках'
						actions={
							<Button
								size='m'
								view='primary'
								label='Добавить участников'
								onClick={() => setIsAddOpen(true)}
							/>
						}
					/>
				</div>
			) : (
				<>
					{/* Actions Bar */}
					<ActionsBar
						placeholder='Поиск участников'
						search={search}
						onSearchChange={handleSearchChange}
						isActionsOpen={isActionsOpen}
						onToggleActions={() => setIsActionsOpen(prev => !prev)}
						onCloseActions={() => setIsActionsOpen(false)}
						actionsDisabled={selectedIds.size === 0}
						items={[
							{
								key: 'updateField',
								label: 'Редактировать поле',
								leftIcon: IconEdit,
								onClick: () => {
									setIsUpdateFieldOpen(true)
									setIsActionsOpen(false)
								}
							},
							{
								key: 'copyToGroup',
								label: 'Копировать в группу',
								leftIcon: IconCopy,
								onClick: () => {
									setIsCopyOpen(true)
									setIsActionsOpen(false)
								}
							},
							{
								key: 'moveToGroup',
								label: 'Переместить в группу',
								leftIcon: IconAdd,
								onClick: () => {
									setIsMoveOpen(true)
									setIsActionsOpen(false)
								}
							},

							{
								key: 'excludeFromGroup',
								label: 'Исключить из группы',
								status: 'alert',
								leftIcon: IconRemove,
								onClick: () => {
									setIsExcludeOpen(true)
									setIsActionsOpen(false)
								}
							}
						]}
						rightExtras={
							<div className='flex items-center gap-2'>
								{selectedIds.size > 0 && (
									<>
										<Button
											view='clear'
											iconLeft={IconAllDone}
											label={`${selectedIds.size}`}
											title={`Выбрано участников: ${selectedIds.size}`}
										/>
										<Button
											view='clear'
											onlyIcon
											iconSize='s'
											iconLeft={IconRevert}
											onClick={clearSelection}
											title='Отменить выделение'
										/>
									</>
								)}
							</div>
						}
					/>

					{/* Table */}
					{showSkeleton ? (
						<div className='w-full'>
							<TableSkeleton
								rows={10}
								columns={
									fieldsData?.fields?.filter(f => f.isVisible)?.length || 3
								}
								withSelectColumn={true}
							/>
						</div>
					) : items.length === 0 ? (
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
										onClick={() => {
											setSearch('')
											setPage(1)
										}}
									/>
								}
							/>
						</div>
					) : (
						<TableWrapper>
							<div onPointerDown={() => enable()}>
								<Table
									rows={rows as any}
									columns={columns as any}
									resizable='outside'
									getRowKey={(row: TableRow) => {
										if (isContactInfoRow(row)) {
											return `${row.contactId}-info`
										}
										if (isContactDto(row)) {
											return row.id
										}
										return 'unknown'
									}}
									headerZIndex={10}
									stickyHeader={false}
									rowHoverEffect
								/>
							</div>
						</TableWrapper>
					)}

					{/* Pagination */}
					{!showSkeleton && items.length > 0 && (
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
					)}
				</>
			)}

			{/* Group Management Modals */}
			<EditGroupModal
				isOpen={isEditOpen}
				onClose={() => setIsEditOpen(false)}
				groupId={groupId}
				initial={{
					name: groupMeta?.name || '',
					description: groupMeta?.description || ''
				}}
				onUpdated={() => invalidateGroups()}
			/>

			{groupMeta && (
				<CloneGroupModal
					isOpen={isCloneOpen}
					onClose={() => setIsCloneOpen(false)}
					source={{
						id: groupMeta.id as string,
						name: groupMeta.name as string
					}}
					defaultName={`${groupMeta?.name || ''} (копия)`}
					defaultIncludeMembers={true}
					onCloned={res => {
						invalidateGroups()
						const id = (res?.newGroupId as string) || ''
						if (id) navigate(`/contacts/groups/${id}`)
					}}
				/>
			)}

			<DeleteGroupsModal
				isOpen={isDeleteOpen}
				onClose={() => setIsDeleteOpen(false)}
				groupIds={[groupId]}
				groupName={groupMeta?.name}
			/>

			{/* Bulk Action Modals */}
			<BulkUpdateFieldModal
				isOpen={isUpdateFieldOpen}
				onClose={() => setIsUpdateFieldOpen(false)}
				contactIds={Array.from(selectedIds)}
				fields={(fieldsData?.fields || []).map((f: any) => ({
					key: f.key as string,
					name: f.name as string
				}))}
				onSuccess={() => {
					clearSelection()
					invalidateContacts()
					invalidateFields()
				}}
			/>

			<BulkAddToGroupsModal
				isOpen={isMoveOpen}
				onClose={() => setIsMoveOpen(false)}
				contactIds={Array.from(selectedIds)}
				groups={(groupsList?.items || [])
					.filter((g: any) => g.id !== groupId) // Exclude current group
					.map((g: any) => ({
						id: g.id as string,
						name: g.name as string
					}))}
				onSuccess={async () => {
					// After adding to new group, remove from current group
					await excludeMutation.mutateAsync({
						id: groupId,
						payload: { contactIds: Array.from(selectedIds) } as any
					})
					clearSelection()
					invalidateContacts()
					invalidateGroups()
				}}
			/>

			<BulkAddToGroupsModal
				isOpen={isCopyOpen}
				onClose={() => setIsCopyOpen(false)}
				contactIds={Array.from(selectedIds)}
				groups={(groupsList?.items || [])
					.filter((g: any) => g.id !== groupId) // Exclude current group
					.map((g: any) => ({
						id: g.id as string,
						name: g.name as string
					}))}
				onSuccess={() => {
					clearSelection()
					invalidateGroups()
				}}
			/>

			{/* Exclude from Group Modal */}
			<DeleteConfirmModal
				isOpen={isExcludeOpen}
				onClose={() => setIsExcludeOpen(false)}
				title='Исключить из группы'
				description={`Вы действительно хотите исключить выбранные контакты (${selectedIds.size} шт.) из группы${groupMeta?.name ? ` "${groupMeta.name}"` : ''}?`}
				confirmLabel='Исключить'
				onConfirm={() =>
					excludeMutation.mutate(
						{
							id: groupId,
							payload: {
								contactIds: Array.from(selectedIds)
							} as any
						},
						{
							onSuccess: () => {
								showCustomToast({
									title: 'Исключено из группы',
									type: 'success'
								})
								setIsExcludeOpen(false)
								clearSelection()
								invalidateContacts()
								invalidateGroups()
							},
							onError: (e: any) =>
								showCustomToast({
									title: 'Ошибка исключения из группы',
									description:
										e?.message || 'Не удалось исключить контакты из группы',
									type: 'error'
								})
						}
					)
				}
			/>

			{/* Add Participants Modal */}
			<AddMembersModal
				isOpen={isAddOpen}
				onClose={() => setIsAddOpen(false)}
				groupId={groupId}
			/>
		</Layout>
	)
}

export const Component = GroupMembersPage
