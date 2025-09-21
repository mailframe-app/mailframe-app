import { IconAdd } from '@consta/icons/IconAdd'
import { IconAllDone } from '@consta/icons/IconAllDone'
import { IconEdit } from '@consta/icons/IconEdit'
import { IconRemove } from '@consta/icons/IconRemove'
import { IconRevert } from '@consta/icons/IconRevert'
import { IconSortDownCenter } from '@consta/icons/IconSortDownCenter'
import { IconSortUpCenter } from '@consta/icons/IconSortUpCenter'
import { IconTrash } from '@consta/icons/IconTrash'
import { DataCell } from '@consta/table/DataCell'
import type { TableColumn } from '@consta/table/Table'
import { Table } from '@consta/table/Table'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { ResponsesEmptyPockets } from '@consta/uikit/ResponsesEmptyPockets'
import { Text } from '@consta/uikit/Text'
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState
} from 'react'

import {
	COL_WIDTH_MAX,
	COL_WIDTH_MIN,
	TableSettingsModal,
	useColumnsWidthPersistence
} from '@/features/column-manager'
import {
	BulkAddToGroupsModal,
	BulkRemoveFromGroupsModal,
	BulkUpdateFieldModal
} from '@/features/contacts-bulk'
import { DeleteContactsModal } from '@/features/contacts/contact-delete'
import { EditContactModal } from '@/features/contacts/contact-edit'
import { useTrashModal } from '@/features/contacts/trash'
import { useTableUrlSync } from '@/features/table-url-sync'

import { formatDate, stableStringify } from '@/shared/lib'
import {
	ActionsCol,
	RightControlButtons,
	SelectCol,
	TablePagination,
	TableSkeleton,
	TableWrapper,
	buildHeader
} from '@/shared/ui'

import ActionsBar from '../../components/ActionsBar'

import {
	CONTACTS_DEFAULT_LIMIT,
	CONTACTS_DEFAULT_PAGE,
	type ContactFieldType,
	type GetContactsQueryDto,
	useContactFields,
	useContacts,
	useGroups,
	useInvalidateContacts,
	useInvalidateFields,
	useInvalidateGroups,
	useRefetchFields,
	useUpdateField
} from '@/entities/contacts'
import { ActionsCreateModal } from '@/widgets/CreateContactsModal'

export interface ContactsTabHandle {
	openCreateModal: () => void
	openTableSettings: () => void
	openTrashModal: () => void
}

// useTableSelection hook (copied from GroupsTab)
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

export const ContactsTab = forwardRef<ContactsTabHandle>((_props, ref) => {
	const { openTrashModal } = useTrashModal()

	// URL синхронизация состояния таблицы
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
		setSortOrder,
		filters
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

	// Параметры запроса
	const params: GetContactsQueryDto = useMemo(
		() => ({
			page,
			limit,
			search: debouncedSearch || undefined,
			sortBy,
			sortOrder,
			filters:
				filters && Object.keys(filters as any).length
					? stableStringify(filters)
					: undefined
		}),
		[page, limit, debouncedSearch, sortBy, sortOrder, filters]
	)

	// Загружаем данные
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

	// Bulk action modals state
	const [isAddToGroupsOpen, setIsAddToGroupsOpen] = useState(false)
	const [isRemoveFromGroupsOpen, setIsRemoveFromGroupsOpen] = useState(false)
	const [isUpdateFieldOpen, setIsUpdateFieldOpen] = useState(false)
	const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false)

	// Single contact delete modal state
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [contactToDelete, setContactToDelete] = useState<any>(null)

	// Single contact edit modal state
	const [isEditModalOpen, setIsEditModalOpen] = useState(false)
	const [contactToEdit, setContactToEdit] = useState<any>(null)

	// Groups data for bulk operations
	const { data: groupsData } = useGroups({ page: 1, limit: 100 } as any)

	// Invalidate helpers
	const invalidateContacts = useInvalidateContacts()
	const invalidateGroups = useInvalidateGroups()
	const invalidateFields = useInvalidateFields()
	const refetchFieldsNow = useRefetchFields()

	// Column width persistence
	const keyToId = useMemo(() => {
		const map = new Map<string, string>()
		;(fieldsData?.fields || []).forEach((f: any) => map.set(f.key, f.id))
		return map
	}, [fieldsData])

	const updateFieldMutation = useUpdateField()
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

	// Empty states logic (как в GroupsTab)
	const [showBigEmpty, setShowBigEmpty] = useState(false)
	const didInitCheckRef = useRef(false)

	useEffect(() => {
		if (didInitCheckRef.current) return
		const noQuery = (debouncedSearch || '').trim() === ''
		const totalContacts = contactsData?.pagination?.total || 0
		if (
			!isContactsLoading &&
			!isContactsError &&
			noQuery &&
			totalContacts === 0
		) {
			setShowBigEmpty(true)
			didInitCheckRef.current = true
		}
	}, [
		isContactsLoading,
		isContactsError,
		contactsData?.pagination?.total,
		debouncedSearch
	])

	// Selection logic
	const {
		selectedIds,
		allOnPageSelected,
		toggleAllOnPage,
		toggleOne,
		clearSelection
	} = useTableSelection(items)
	const [isActionsOpen, setIsActionsOpen] = useState(false)
	const [isCreateContactsOpen, setIsCreateContactsOpen] = useState(false)
	const [isTableSettingsOpen, setIsTableSettingsOpen] = useState(false)

	// Common handlers (after all dependencies are declared)
	const handleSingleDeleteSuccess = useCallback(() => {
		invalidateContacts()
		setIsDeleteModalOpen(false)
		setContactToDelete(null)
	}, [invalidateContacts])

	const handleSingleDeleteClose = useCallback(() => {
		setIsDeleteModalOpen(false)
		setContactToDelete(null)
	}, [])

	const handleBulkDeleteSuccess = useCallback(() => {
		invalidateContacts()
		clearSelection()
	}, [invalidateContacts, clearSelection])

	const handleBulkActionSuccess = useCallback(() => {
		invalidateContacts()
		invalidateGroups()
		clearSelection()
	}, [invalidateContacts, invalidateGroups, clearSelection])

	const handleBulkUpdateSuccess = useCallback(() => {
		invalidateContacts()
		invalidateFields()
		clearSelection()
	}, [invalidateContacts, invalidateFields, clearSelection])

	const handleSingleEditClose = useCallback(() => {
		setIsEditModalOpen(false)
		setContactToEdit(null)
	}, [])

	const handleSingleEditSuccess = useCallback(() => {
		invalidateContacts()
		setIsEditModalOpen(false)
		setContactToEdit(null)
	}, [invalidateContacts])

	// Expose methods via ref
	useImperativeHandle(ref, () => ({
		openCreateModal: () => setIsCreateContactsOpen(true),
		openTableSettings: () => setIsTableSettingsOpen(true),
		openTrashModal: openTrashModal
	}))

	// Функция создания хедера с сортировкой
	const makeHeader = (label: string, keyName: string) => {
		const isActive = sortBy === keyName
		const icon = isActive
			? sortOrder === 'asc'
				? IconSortUpCenter
				: IconSortDownCenter
			: IconSortDownCenter
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

	// Функция рендера по типу поля
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

	// Построение колонок
	const columns: TableColumn<any>[] = useMemo(() => {
		if (!fieldsData?.fields) return []

		// Функция для ограничения ширины колонок
		const clamp = (v: number | undefined) => {
			const n = typeof v === 'number' ? v : 150
			return Math.max(COL_WIDTH_MIN, Math.min(COL_WIDTH_MAX, n))
		}

		// SelectCol как первая колонка
		const selectCol = SelectCol<any>({
			allOnPageSelected,
			toggleAllOnPage,
			selectedIds,
			toggleOne
		})

		// Построение пользовательских колонок на основе fields
		const userColumns: TableColumn<any>[] = (fieldsData.fields || [])
			.filter(f => f.isVisible && f.key !== 'status')
			.sort((a, b) => a.sortOrder - b.sortOrder)
			.map(f => ({
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
			}))

		// Колонка действий
		const actionsCol = ActionsCol<any>({
			onEdit: row => {
				setContactToEdit(row)
				setIsEditModalOpen(true)
			},
			onDelete: row => {
				setContactToDelete(row)
				setIsDeleteModalOpen(true)
			}
		})

		const cols = [selectCol, ...userColumns, actionsCol]

		return cols
	}, [
		fieldsData,
		sortBy,
		sortOrder,
		allOnPageSelected,
		selectedIds,
		registerHeaderRef
	])

	// Вычисления для пагинации
	const total = contactsData?.pagination.total || 0
	const offset = (page - 1) * limit

	// Обработка состояний ошибок
	if (isFieldsError || isContactsError) {
		return (
			<div className='p-4 text-sm text-red-500'>
				Не удалось загрузить данные. Попробуйте обновить страницу.
			</div>
		)
	}

	// Определяем, нужно ли показывать скелетон
	const showSkeleton = isFieldsLoading || isContactsLoading

	// Большое пустое состояние
	if (showBigEmpty) {
		return (
			<>
				<div className='flex w-full justify-center py-10'>
					<ResponsesEmptyPockets
						size='m'
						title='Здесь пока ничего нет'
						description='Добавляйте контакты, чтобы использовать их в рассылках'
						actions={
							<Button
								size='m'
								view='primary'
								label='Добавить контакты'
								onClick={() => setIsCreateContactsOpen(true)}
							/>
						}
					/>
				</div>
				<ActionsCreateModal
					isOpen={isCreateContactsOpen}
					onClose={() => setIsCreateContactsOpen(false)}
				/>
			</>
		)
	}

	return (
		<Card
			verticalSpace='l'
			horizontalSpace='l'
			className='!rounded-lg'
			style={{
				backgroundColor: 'var(--color-bg-default)'
			}}
			shadow={false}
		>
			<ActionsBar
				placeholder='Поиск по полям'
				search={search}
				onSearchChange={handleSearchChange}
				isActionsOpen={isActionsOpen}
				onToggleActions={() => setIsActionsOpen(prev => !prev)}
				onCloseActions={() => setIsActionsOpen(false)}
				actionsDisabled={selectedIds.size === 0}
				items={[
					{
						key: 'addToGroups',
						label: 'Добавить в группы',
						leftIcon: IconAdd,
						onClick: () => {
							setIsAddToGroupsOpen(true)
							setIsActionsOpen(false)
						}
					},
					{
						key: 'removeFromGroups',
						label: 'Исключить из групп',
						leftIcon: IconRemove,
						onClick: () => {
							setIsRemoveFromGroupsOpen(true)
							setIsActionsOpen(false)
						}
					},
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
						key: 'delete',
						label: 'Удалить контакты',
						status: 'alert',
						leftIcon: IconTrash,
						onClick: () => {
							setIsBulkDeleteOpen(true)
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
									title={`Выбрано контактов: ${selectedIds.size}`}
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

			{showSkeleton ? (
				<div className='w-full'>
					<TableSkeleton
						rows={10}
						columns={fieldsData?.fields?.filter(f => f.isVisible)?.length || 3}
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
							rows={items as any}
							columns={columns as any}
							resizable='outside'
							getRowKey={(row: any) => row.id}
							headerZIndex={10}
							stickyHeader={false}
						/>
					</div>
				</TableWrapper>
			)}

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

			{/* Bulk Action Modals */}
			<BulkAddToGroupsModal
				isOpen={isAddToGroupsOpen}
				onClose={() => setIsAddToGroupsOpen(false)}
				contactIds={Array.from(selectedIds)}
				groups={(groupsData?.items || []).map((g: any) => ({
					id: g.id as string,
					name: g.name as string
				}))}
				onSuccess={handleBulkActionSuccess}
			/>

			<BulkRemoveFromGroupsModal
				isOpen={isRemoveFromGroupsOpen}
				onClose={() => setIsRemoveFromGroupsOpen(false)}
				contactIds={Array.from(selectedIds)}
				groups={(groupsData?.items || []).map((g: any) => ({
					id: g.id as string,
					name: g.name as string
				}))}
				onSuccess={handleBulkActionSuccess}
			/>

			<BulkUpdateFieldModal
				isOpen={isUpdateFieldOpen}
				onClose={() => setIsUpdateFieldOpen(false)}
				contactIds={Array.from(selectedIds)}
				fields={(fieldsData?.fields || []).map((f: any) => ({
					key: f.key as string,
					name: f.name as string
				}))}
				onSuccess={handleBulkUpdateSuccess}
			/>

			<DeleteContactsModal
				isOpen={isBulkDeleteOpen}
				onClose={() => setIsBulkDeleteOpen(false)}
				contactIds={Array.from(selectedIds)}
				onDeleted={handleBulkDeleteSuccess}
			/>

			{/* Table Settings Modal */}
			<TableSettingsModal
				isOpen={isTableSettingsOpen}
				onClose={() => setIsTableSettingsOpen(false)}
			/>

			{/* Create Contacts Modal */}
			<ActionsCreateModal
				isOpen={isCreateContactsOpen}
				onClose={() => setIsCreateContactsOpen(false)}
			/>

			{/* Single Contact Delete Modal */}
			{contactToDelete && (
				<DeleteContactsModal
					isOpen={isDeleteModalOpen}
					onClose={handleSingleDeleteClose}
					contactIds={[contactToDelete.id]}
					contactTitle={contactToDelete.email}
					onDeleted={handleSingleDeleteSuccess}
				/>
			)}

			{/* Single Contact Edit Modal */}
			{contactToEdit && (
				<EditContactModal
					isOpen={isEditModalOpen}
					onClose={handleSingleEditClose}
					contact={contactToEdit}
					onUpdated={handleSingleEditSuccess}
				/>
			)}
		</Card>
	)
})

ContactsTab.displayName = 'ContactsTab'
