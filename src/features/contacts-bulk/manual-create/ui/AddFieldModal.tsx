import { IconAdd } from '@consta/icons/IconAdd'
import { IconTrash } from '@consta/icons/IconTrash'
import { Button } from '@consta/uikit/Button'
import { Select } from '@consta/uikit/SelectCanary'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { nanoid } from 'nanoid'
import { useMemo, useState } from 'react'

import { modals } from '@/shared/lib/modals'
import ModalShell from '@/shared/ui/Modals/ModalShell'

import type { ContactFieldDefinitionDto } from '@/entities/contacts'
import { useContactFields, useDeletedFields } from '@/entities/contacts'

type Item = {
	label: string
	id: string
	key: string
}

type NewField = {
	id: string
	key: string
	name: string
}

type AddFieldFormProps = {
	onClose: () => void
	currentOrder: string[]
	onApply: (payload: {
		existingKeys: string[]
		newFields: { key: string; name: string }[]
	}) => void
}

function AddFieldForm({ onClose, currentOrder, onApply }: AddFieldFormProps) {
	const { data: contactFieldsData } = useContactFields()
	const { data: deletedFieldsData } = useDeletedFields()

	const hiddenFields: Item[] = useMemo(
		() =>
			(contactFieldsData?.fields || [])
				.filter(
					(f: ContactFieldDefinitionDto) =>
						!currentOrder.includes(f.key) && !f.isVisible
				)
				.map((f: ContactFieldDefinitionDto) => ({
					label: f.name,
					id: f.id,
					key: f.key
				})),
		[contactFieldsData, currentOrder]
	)

	const deletedFields: Item[] = useMemo(
		() =>
			(deletedFieldsData?.deletedFields || []).map((f: any) => ({
				label: f.name,
				id: f.id,
				key: f.key
			})),
		[deletedFieldsData]
	)

	const [selectedHidden, setSelectedHidden] = useState<Item[] | null>(null)
	const [selectedDeleted, setSelectedDeleted] = useState<Item[] | null>(null)
	const [newFields, setNewFields] = useState<NewField[]>([])

	const handleAddNewField = () => {
		setNewFields(prev => [...prev, { id: nanoid(), key: '', name: '' }])
	}

	const handleRemoveNewField = (id: string) => {
		setNewFields(prev => prev.filter(f => f.id !== id))
	}

	const handleNewFieldChange = (
		id: string,
		field: 'key' | 'name',
		value: string
	) => {
		setNewFields(prev =>
			prev.map(f => (f.id === id ? { ...f, [field]: value } : f))
		)
	}

	const handleApply = () => {
		const existingKeys = [
			...(selectedHidden?.map(item => item.key) || []),
			...(selectedDeleted?.map(item => item.key) || [])
		]
		const newFieldsToCreate = newFields
			.filter(f => f.key && f.name)
			.map(({ key, name }) => ({ key, name }))

		onApply({ existingKeys, newFields: newFieldsToCreate })
		onClose()
	}

	return (
		<ModalShell
			isOpen
			onClose={onClose}
			title='Добавить поля'
			containerClassName='w-[600px] max-w-[92vw]'
			footer={
				<div className='flex w-full justify-end gap-2 pt-4'>
					<Button view='ghost' label='Отмена' onClick={onClose} />
					<Button view='primary' label='Применить' onClick={handleApply} />
				</div>
			}
		>
			<div className='flex flex-col gap-4'>
				<div>
					<Text view='secondary' className='mb-1'>
						Скрытые поля
					</Text>
					<Select
						multiple
						placeholder='Выберите поля для добавления'
						items={hiddenFields}
						value={selectedHidden}
						onChange={setSelectedHidden}
						getItemLabel={(item: Item) => item.label}
						getItemKey={(item: Item) => item.id}
					/>
				</div>
				<div>
					<Text view='secondary' className='mb-1'>
						Удаленные поля
					</Text>
					<Select
						multiple
						placeholder='Выберите поля для добавления'
						items={deletedFields}
						value={selectedDeleted}
						onChange={setSelectedDeleted}
						getItemLabel={(item: Item) => item.label}
						getItemKey={(item: Item) => item.id}
					/>
				</div>
				<div
					className='mt-2 border-t pt-4'
					style={{ borderColor: 'var(--color-bg-border)' }}
				>
					<div className='flex items-center justify-between'>
						<Text view='secondary'>Создать новые поля</Text>
						<Button
							onlyIcon
							iconLeft={IconAdd}
							view='secondary'
							size='s'
							onClick={handleAddNewField}
						/>
					</div>
					<div className='mt-2 flex flex-col gap-2'>
						{newFields.map(field => (
							<div key={field.id} className='flex gap-2'>
								<TextField
									size='s'
									placeholder='Ключ (например, company)'
									value={field.key}
									onChange={v =>
										handleNewFieldChange(field.id, 'key', (v as string) || '')
									}
								/>
								<TextField
									size='s'
									placeholder='Название (например, Компания)'
									value={field.name}
									onChange={v =>
										handleNewFieldChange(field.id, 'name', (v as string) || '')
									}
								/>
								<Button
									onlyIcon
									iconLeft={IconTrash}
									view='ghost'
									size='s'
									onClick={() => handleRemoveNewField(field.id)}
								/>
							</div>
						))}
					</div>
				</div>
			</div>
		</ModalShell>
	)
}

type OpenModalProps = {
	currentOrder: string[]
	onApply: (payload: {
		existingKeys: string[]
		newFields: { key: string; name: string }[]
	}) => void
}

export function openAddFieldModal({ currentOrder, onApply }: OpenModalProps) {
	modals.openRender(({ close }) => (
		<AddFieldForm
			onClose={close}
			currentOrder={currentOrder}
			onApply={onApply}
		/>
	))
}
