import { IconRevert } from '@consta/icons/IconRevert'
import { IconTrash } from '@consta/icons/IconTrash'
import type { TableColumn } from '@consta/table/Table'
import { Table } from '@consta/table/Table'
import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { useMemo, useState } from 'react'

import { formatDate } from '@/shared/lib/formatDate'
import { showCustomToast } from '@/shared/lib/toaster'
import { DeleteConfirmModal, ModalShell } from '@/shared/ui/Modals'
import { TableWrapper, buildHeader } from '@/shared/ui/Table'

import {
	useDeletedFields,
	usePermanentDeleteField,
	useRestoreField
} from '@/entities/contacts'

export function TrashTab() {
	const { data } = useDeletedFields()
	const restore = useRestoreField()
	const permDelete = usePermanentDeleteField()
	const rows = data?.deletedFields || []

	const [isDeleteOpen, setIsDeleteOpen] = useState(false)
	const [deleteId, setDeleteId] = useState<string | null>(null)

	const [isRestoreOpen, setIsRestoreOpen] = useState(false)
	const [restoreId, setRestoreId] = useState<string | null>(null)

	const header = buildHeader({})

	const confirmPermanentDelete = () => {
		if (!deleteId) return
		permDelete.mutate(deleteId, {
			onSuccess: (res: any) => {
				showCustomToast({
					title: 'Успешно',
					description: res?.message ?? res?.data?.message ?? 'Удалено навсегда',
					type: 'success'
				})
				setIsDeleteOpen(false)
				setDeleteId(null)
			},
			onError: (e: any) =>
				showCustomToast({
					title: 'Ошибка',
					description:
						e?.response?.data?.message ?? e?.message ?? 'Ошибка удаления',
					type: 'error'
				})
		})
	}

	const confirmRestore = () => {
		if (!restoreId) return
		restore.mutate(restoreId, {
			onSuccess: (res: any) => {
				showCustomToast({
					title: 'Успешно',
					description: res?.message ?? res?.data?.message ?? 'Восстановлено',
					type: 'success'
				})
				setIsRestoreOpen(false)
				setRestoreId(null)
			},
			onError: (e: any) =>
				showCustomToast({
					title: 'Ошибка',
					description:
						e?.response?.data?.message ?? e?.message ?? 'Ошибка восстановления',
					type: 'error'
				})
		})
	}

	const cols: TableColumn<any>[] = useMemo(
		() => [
			{
				title: 'Название',
				accessor: 'name' as any,
				width: 240,
				minWidth: 160,
				renderHeaderCell: header
			},
			{
				title: 'Ключ',
				accessor: 'key' as any,
				width: 200,
				minWidth: 160,
				renderHeaderCell: header
			},
			{
				title: 'Тип',
				accessor: 'fieldType' as any,
				width: 160,
				minWidth: 140,
				renderHeaderCell: header
			},
			{
				title: 'Удалено',
				accessor: 'deletedAt' as any,
				width: 220,
				minWidth: 160,
				renderHeaderCell: header,
				renderCell: ({ row }) => (
					<div className='flex h-full w-full items-center p-2'>
						<Text size='m'>{formatDate(row?.deletedAt)}</Text>
					</div>
				)
			},
			{
				title: 'Действия',
				accessor: 'actions' as any,
				width: 100,
				minWidth: 100,
				renderHeaderCell: header,
				renderCell: ({ row }) => (
					<div className='flex h-full w-full items-center justify-center'>
						<Button
							size='s'
							view='clear'
							onlyIcon
							iconLeft={IconRevert}
							label='Восстановить'
							onClick={() => {
								setRestoreId(row.id)
								setIsRestoreOpen(true)
							}}
						/>
						<Button
							size='s'
							view='clear'
							onlyIcon
							iconLeft={IconTrash}
							label='Удалить навсегда'
							onClick={() => {
								setDeleteId(row.id)
								setIsDeleteOpen(true)
							}}
						/>
					</div>
				)
			}
		],
		[header]
	)

	return (
		<div className='flex h-full flex-col gap-3'>
			{/* Заголовок */}
			<Text size='l' weight='bold' view='primary'>
				Корзина полей
			</Text>
			<Text size='s' view='secondary'>
				Здесь вы можете удалить поля навсегда или восстановить их из корзины.
			</Text>
			<div className='p-2' />

			{/* Таблица */}
			<TableWrapper>
				{rows.length ? (
					<Table
						rows={rows as any}
						columns={cols as any}
						zebraStriped
						resizable='outside'
						stickyHeader={false}
						getRowKey={(r: any) => r.id}
					/>
				) : (
					<div className='flex h-full items-center justify-center p-4'>
						<Text size='s' view='secondary'>
							У вас пока нет удалённых полей.
						</Text>
					</div>
				)}
			</TableWrapper>

			{/* Модалка подтверждения удаления */}
			<DeleteConfirmModal
				isOpen={isDeleteOpen}
				onClose={() => {
					setIsDeleteOpen(false)
					setDeleteId(null)
				}}
				onConfirm={confirmPermanentDelete}
				loading={permDelete.isPending}
				title='Вы уверены, что хотите удалить поле навсегда?  '
				description='Это действие нельзя отменить. Поле и вся информация, связанная с ним, будет удалена.'
				confirmLabel='Удалить'
				cancelLabel='Отмена'
			/>

			{/* Модалка подтверждения восстановления */}
			<ModalShell
				isOpen={isRestoreOpen}
				onClose={() => {
					setIsRestoreOpen(false)
					setRestoreId(null)
				}}
				title='Вы уверены, что хотите восстановить поле?'
				description='Поле будет восстановлено в списке полей. Вы сможете использовать его для заполнения контактов.'
				containerClassName='w-[400px] p-6'
				footer={
					<div className='grid w-full grid-cols-2 gap-2'>
						<Button
							view='ghost'
							width='full'
							label='Отмена'
							onClick={() => {
								setIsRestoreOpen(false)
								setRestoreId(null)
							}}
							disabled={restore.isPending}
						/>
						<Button
							view='primary'
							width='full'
							label='Восстановить'
							onClick={confirmRestore}
							loading={restore.isPending}
						/>
					</div>
				}
			></ModalShell>
		</div>
	)
}
