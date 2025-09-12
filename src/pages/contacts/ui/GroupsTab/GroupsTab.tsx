import { Button } from '@consta/uikit/Button'
import { Layout } from '@consta/uikit/Layout'
import { ResponsesEmptyPockets } from '@consta/uikit/ResponsesEmptyPockets'
import { Text } from '@consta/uikit/Text'
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState
} from 'react'

import GroupsTabModals, { type GroupsTabModalsHandle } from './GroupsTabModals'
import useGroupsTableBuilder from './GroupsTableBuilder'
import { GroupsTableView } from './GroupsTableView'
import { useGroupsTableManager } from './useGroupsTableManager'
import { useTableSelection } from './useTableSelection'
import type { GroupResponseDto } from '@/entities/contacts'
import { useGroups } from '@/entities/contacts'

export type GroupsTabHandle = { openCreate: () => void }

const GroupsTabInner = (_: unknown, ref: React.Ref<GroupsTabHandle>) => {
	const {
		search,
		setSearch,
		page,
		setPage,
		limit,
		setLimit,
		sortBy,
		setSortBy,
		order,
		setOrder,
		params
	} = useGroupsTableManager()

	const { data, isLoading, isError } = useGroups(params)
	const items = useMemo(() => data?.items || [], [data])
	const total = data?.total || 0
	const offset = (page - 1) * limit
	const showInitialSkeleton = isLoading && items.length === 0
	const [showBigEmpty, setShowBigEmpty] = useState(false)
	const didInitCheckRef = useRef(false)
	useEffect(() => {
		if (didInitCheckRef.current) return
		const noQuery = (params.search || '').trim() === ''
		if (!isLoading && !isError && noQuery) {
			if (total === 0) setShowBigEmpty(true)
			didInitCheckRef.current = true
		}
	}, [isLoading, isError, total, params.search])

	const {
		selectedIds,
		allOnPageSelected,
		toggleOne,
		toggleAllOnPage,
		clearSelection
	} = useTableSelection(items)

	// Modals moved to GroupsTabModals
	const modalsRef = useRef<GroupsTabModalsHandle>(null)
	const tableViewRef = useRef<HTMLDivElement>(null)
	useImperativeHandle(ref, () => ({
		openCreate: () => modalsRef.current?.openCreate()
	}))

	// Table columns
	const columns = useGroupsTableBuilder({
		sortBy,
		order,
		setSortBy,
		setOrder,
		setPage,
		allOnPageSelected,
		toggleAllOnPage,
		selectedIds,
		toggleOne
	})

	// Render helpers
	const renderError = () => {
		if (!isError) return null
		return (
			<div className='p-4'>
				<Text size='xl' view='alert'>
					Не удалось загрузить группы. Попробуйте обновить страницу.
				</Text>
			</div>
		)
	}

	const renderEmptyState = () => {
		if (!showBigEmpty) return null
		return (
			<div className='flex w-full justify-center py-10'>
				<ResponsesEmptyPockets
					size='m'
					title='Здесь пока ничего нет'
					description='Объединяйте контакты в группы для использования их в рассылке'
					actions={
						<Button
							size='m'
							view='primary'
							label='Создать группу'
							onClick={() => modalsRef.current?.openCreate()}
						/>
					}
				/>
			</div>
		)
	}

	// Main render
	if (isError) {
		return renderError()
	}

	return (
		<Layout direction='column' className='w-full'>
			<GroupsTabModals
				ref={modalsRef}
				items={items as GroupResponseDto[]}
				selectedIds={selectedIds}
				onClearSelection={clearSelection}
			/>

			{renderEmptyState()}
			{!showBigEmpty && (
				<GroupsTableView
					ref={tableViewRef}
					search={search}
					setSearch={setSearch}
					page={page}
					setPage={setPage}
					limit={limit}
					setLimit={setLimit}
					sortBy={sortBy}
					setSortBy={setSortBy}
					order={order}
					setOrder={setOrder}
					items={items}
					total={total}
					offset={offset}
					showInitialSkeleton={showInitialSkeleton}
					columns={columns}
					selectedIds={selectedIds}
					clearSelection={clearSelection}
					onOpenMerge={() => modalsRef.current?.openMerge()}
					onOpenDelete={(ids, name) => modalsRef.current?.openDelete(ids, name)}
					onOpenEdit={group => modalsRef.current?.openEdit(group)}
					onOpenClone={data => modalsRef.current?.openClone(data)}
				/>
			)}
		</Layout>
	)
}

const GroupsTab = forwardRef(GroupsTabInner)

export default GroupsTab
