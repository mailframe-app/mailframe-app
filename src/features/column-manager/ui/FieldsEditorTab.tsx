import { IconCheck } from '@consta/icons/IconCheck'
import { IconEdit } from '@consta/icons/IconEdit'
import { IconTrash } from '@consta/icons/IconTrash'
import type { TableColumn } from '@consta/table/Table'
import { Table } from '@consta/table/Table'
import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { useMemo, useState } from 'react'

import { CreateFieldModal } from '@/features/column-manager/CreateField'
import { FieldEditModal } from '@/features/column-manager/EditField'

import { showCustomToast } from '@/shared/lib/toaster'
import { DeleteConfirmModal } from '@/shared/ui/Modals'
import { TableWrapper, buildHeader } from '@/shared/ui/Table'

import type { ContactFieldDefinitionDto } from '@/entities/contacts'
import { useContactFields, useSoftDeleteField } from '@/entities/contacts'

export function FieldEditorTab() {
	// Запрос полей
	const { data: fieldsData } = useContactFields()
	const fields = fieldsData?.fields ?? []

	// Состояния модальных окон
	const [isEditOpen, setIsEditOpen] = useState(false)
	const [isCreateOpen, setIsCreateOpen] = useState(false)
	const [editing, setEditing] = useState<ContactFieldDefinitionDto | null>(null)
	const [isDeleteOpen, setIsDeleteOpen] = useState(false)
	const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)

	// Запросы
	const deleteMutation = useSoftDeleteField()

	// Построение ячейки заголовка
	const header = buildHeader({})

	// Построение ячейки для булевых значений
	const booleanCell =
		(key: 'isSystem' | 'isRequired' | 'isVisible') =>
		({ row }: { row: ContactFieldDefinitionDto }) => (
			<div className='flex h-full w-full items-center justify-center'>
				{row?.[key] ? <IconCheck size='m' view='primary' /> : null}
			</div>
		)

	// Построение таблицы
	const cols: TableColumn<ContactFieldDefinitionDto>[] = useMemo(
		() => [
			{
				title: 'Название',
				accessor: 'name' as any,
				width: 160,
				minWidth: 120,
				renderHeaderCell: header
			},
			{
				title: 'Ключ',
				accessor: 'key' as any,
				width: 160,
				minWidth: 120,
				renderHeaderCell: header
			},
			{
				title: 'Тип',
				accessor: 'fieldType' as any,
				width: 140,
				minWidth: 120,
				renderHeaderCell: header
			},
			{
				title: 'Обязательное',
				accessor: 'isRequired' as any,
				width: 140,
				minWidth: 120,
				renderHeaderCell: header,
				renderCell: booleanCell('isRequired')
			},
			{
				title: 'Видимое',
				accessor: 'isVisible' as any,
				width: 140,
				minWidth: 120,
				renderHeaderCell: header,
				renderCell: booleanCell('isVisible')
			},
			// {
			// 	title: 'Ширина',
			// 	accessor: 'columnWidth' as any,
			// 	width: 120,
			// 	minWidth: 100,
			// 	renderHeaderCell: header,
			// 	renderCell: ({ row }) => (
			// 		<div className='flex h-full w-full items-center justify-center'>
			// 			<Text size='m'>{row?.columnWidth ?? '-'} px</Text>
			// 		</div>
			// 	)
			// },
			{
				title: 'Действия',
				accessor: 'actions' as any,
				width: 140,
				minWidth: 120,
				renderHeaderCell: header,
				renderCell: ({ row }) => (
					<div className='flex h-full w-full items-center justify-center'>
						<Button
							size='s'
							view='clear'
							onlyIcon
							iconLeft={IconEdit}
							label='Редактировать'
							onClick={() => {
								setEditing(row)
								setIsEditOpen(true)
							}}
						/>
						<Button
							size='s'
							view='clear'
							onlyIcon
							iconLeft={IconTrash}
							label='Удалить'
							disabled={!!row?.isSystem}
							onClick={() => {
								setDeleteTargetId(row.id)
								setIsDeleteOpen(true)
							}}
						/>
					</div>
				)
			}
		],
		[]
	)

	// Асинхронное удаление поля
	const confirmDelete = () => {
		if (!deleteTargetId) return
		deleteMutation.mutate(deleteTargetId, {
			onSuccess: (res: any) => {
				const msg = res?.message ?? res?.data?.message ?? 'Поле удалено'
				showCustomToast({
					title: 'Поле успешно удалено',
					description: msg,
					type: 'success'
				})
				setIsDeleteOpen(false)
				setDeleteTargetId(null)
			},
			onError: (e: any) => {
				const msg =
					e?.response?.data?.message ?? e?.message ?? 'Ошибка удаления'
				showCustomToast({
					title: 'Ошибка удаления поля',
					description: msg,
					type: 'error'
				})
			}
		})
	}

	return (
		<div className='flex h-full flex-col gap-3'>
			{/* Заголовок */}
			<div className='flex items-center justify-between'>
				<div className='flex flex-col gap-2'>
					<Text size='l' weight='bold' view='primary'>
						Редактор полей
					</Text>
					<Text size='s' view='secondary'>
						Вы можете добавлять, редактировать и удалять поля, которые будут
						использоваться для заполнения контактов.
					</Text>
				</div>

				{/* Кнопка создания поля */}
				<Button
					view='primary'
					label='Создать поле'
					onClick={() => setIsCreateOpen(true)}
				/>
			</div>

			{/* Таблица полей */}
			<div className='p-2' />
			<TableWrapper>
				<Table<ContactFieldDefinitionDto>
					rows={fields}
					columns={cols as any}
					zebraStriped
					resizable='outside'
					getRowKey={r => r.id}
				/>
			</TableWrapper>

			{/* Модальное окно создания поля */}
			{isCreateOpen && (
				<CreateFieldModal
					isOpen={isCreateOpen}
					onClose={() => setIsCreateOpen(false)}
				/>
			)}

			{/* Модальное окно редактирования поля */}
			{isEditOpen && editing && (
				<FieldEditModal
					isOpen={isEditOpen}
					onClose={() => {
						setIsEditOpen(false)
						setEditing(null)
					}}
					initial={editing}
				/>
			)}

			{/* Модальное окно удаления поля */}
			<DeleteConfirmModal
				isOpen={isDeleteOpen}
				onClose={() => setIsDeleteOpen(false)}
				onConfirm={confirmDelete}
				loading={deleteMutation.isPending}
				title='Вы уверены, что хотите удалить выбранное поле?'
				description='Это действие переводит поле в корзину. Вы можете удалить или восстановить его из корзины в любое время.'
				confirmLabel='Удалить'
				cancelLabel='Отмена'
			/>
		</div>
	)
}
