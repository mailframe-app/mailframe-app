import { IconAdd } from '@consta/icons/IconAdd'
import { IconClose } from '@consta/icons/IconClose'
import { Badge } from '@consta/uikit/Badge'
import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import type { DragEndEvent } from '@dnd-kit/core'
import {
	DndContext,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors
} from '@dnd-kit/core'
import {
	SortableContext,
	arrayMove,
	horizontalListSortingStrategy,
	useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import React, { useEffect, useMemo, useState } from 'react'

import {
	GroupSelector,
	useGroupManagement
} from '@/features/import-contacts/manage-groups'

import { showCustomToast } from '@/shared/lib/toaster'

import { useSummaryModal } from '../model/useSummaryModal'
import type { Summary } from '../ui/SummaryResult'

import { openAddFieldModal } from './AddFieldModal'
import type {
	BulkCreateContactsDto,
	ContactFieldDefinitionDto,
	DeletedFieldDto
} from '@/entities/contacts'
import {
	useBulkCreateContactsMutation,
	useContactFields,
	useDeletedFields
} from '@/entities/contacts'

type PillProps = {
	id: string
	label: string
	removable?: boolean
	onRemove?: (id: string) => void
}

const Pill: React.FC<PillProps> = ({ id, label, removable, onRemove }) => {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging
	} = useSortable({ id })
	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		background: 'var(--color-bg-default)'
	}
	const status: any = 'success'
	return (
		<div
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			className={`flex items-center gap-1 ${isDragging ? 'outline outline-[var(--color-control-typo-ghost)]' : ''} cursor-grab rounded px-1 py-1`}
			style={style}
			role='listitem'
		>
			<Badge label={label} status={status} view='tinted' size='m' />
			{removable && (
				<Button
					view='clear'
					size='xs'
					onlyIcon
					iconLeft={IconClose}
					onClick={e => {
						e.stopPropagation()
						onRemove?.(id)
					}}
				/>
			)}
		</div>
	)
}

type NewFieldDef = { key: string; name: string }

function ManualCreateForm() {
	const { data: contactFieldsData } = useContactFields()
	const { data: deletedFieldsData } = useDeletedFields()

	const contactFields = useMemo(
		() => contactFieldsData?.fields || [],
		[contactFieldsData]
	)
	const allFieldsForLookup = useMemo(() => {
		const deleted = deletedFieldsData?.deletedFields || []
		return [...contactFields, ...deleted]
	}, [contactFields, deletedFieldsData])

	const visibleFields = useMemo(
		() => contactFields.filter((f: ContactFieldDefinitionDto) => f.isVisible),
		[contactFields]
	)

	const [order, setOrder] = useState<string[]>([])
	const [newlyDefinedFields, setNewlyDefinedFields] = useState<NewFieldDef[]>(
		[]
	)

	useEffect(() => {
		setOrder(visibleFields.map(f => f.key))
	}, [visibleFields])

	const [customKeys, setCustomKeys] = useState<Set<string>>(new Set())

	const [input, setInput] = useState<string>('')
	const [selectedGroup, setSelectedGroup] = useState<{
		id: string
		name: string
	} | null>(null)

	const bulkMutation = useBulkCreateContactsMutation()
	const { openSummaryModal } = useSummaryModal()

	const fieldsByKey = useMemo(() => {
		const map: Record<
			string,
			| (ContactFieldDefinitionDto | DeletedFieldDto)
			| { key: string; name: string }
		> = {}
		allFieldsForLookup.forEach(f => {
			map[f.key] = f
		})
		newlyDefinedFields.forEach(f => {
			map[f.key] = f
		})
		customKeys.forEach(k => {
			map[k] = { key: k, name: k } as any
		})
		return map
	}, [allFieldsForLookup, customKeys, newlyDefinedFields])

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
	)

	const onDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (!over) return
		const activeId = String(active.id)
		const overId = String(over.id)
		if (activeId === overId) return
		const oldIndex = order.indexOf(activeId)
		const newIndex = order.indexOf(overId)
		if (oldIndex === -1 || newIndex === -1) return
		setOrder(prev => arrayMove(prev, oldIndex, newIndex))
	}

	const resetForm = () => {
		setInput('')
		setSelectedGroup(null)
		setCustomKeys(new Set())
		setOrder(visibleFields.map(f => f.key))
		setNewlyDefinedFields([])
	}

	const handleRemoveCustom = (id: string) => {
		if (!customKeys.has(id)) return
		setOrder(prev => prev.filter(k => k !== id))
		setCustomKeys(prev => {
			const next = new Set(prev)
			next.delete(id)
			return next
		})
	}

	function parseInput(): BulkCreateContactsDto['contacts'] {
		const lines = input
			.split('\n')
			.map(l => l.trim())
			.filter(Boolean)

		const newFieldKeys = new Set(newlyDefinedFields.map(f => f.key))

		const contacts = lines.map(line => {
			const parts = line.split(',').map(p => p.trim())

			const emailIndex = order.indexOf('email')
			const email = emailIndex !== -1 ? parts[emailIndex] || '' : ''

			const fields = order
				.map((fieldKey, index) => {
					if (fieldKey === 'email') {
						return null
					}
					const value = parts[index] || ''
					if (!value) return null

					const fieldData: any = { fieldKey, value }
					if (newFieldKeys.has(fieldKey)) {
						const fieldDef = newlyDefinedFields.find(f => f.key === fieldKey)
						if (fieldDef) {
							fieldData.name = fieldDef.name
						}
					}
					return fieldData
				})
				.filter(Boolean) as { fieldKey: string; value: string }[]

			return { email, fields }
		})
		return contacts
	}

	async function handleSubmit() {
		try {
			const contacts = parseInput()
			const payload: BulkCreateContactsDto = { contacts }
			if (selectedGroup) payload.groupId = selectedGroup.id
			if (newlyDefinedFields.length > 0) {
				payload.createNewFields = true
			}

			const res: any = await bulkMutation.mutateAsync(payload)
			const s: Summary = {
				success: Boolean(res?.success),
				processed: Number(res?.processed || 0),
				failed: Number(res?.failed || 0),
				errors: res?.errors || []
			}
			openSummaryModal(s)
			showCustomToast({ title: 'Создание выполнено', type: 'success' })
			resetForm()
		} catch (e: any) {
			showCustomToast({
				title: e?.message || 'Не удалось создать контакты',
				type: 'error'
			})
		}
	}

	const groupSelectorProps = useGroupManagement({
		value: selectedGroup,
		onChange: setSelectedGroup
	})

	return (
		<div className='flex w-full max-w-[980px] flex-col gap-6'>
			<div>
				<Text size='l' weight='bold' view='primary'>
					Поля
				</Text>
				<Text size='s' view='secondary' className='mt-2'>
					1. Расположите поля в том же порядке, в котором вы хотите добавлять
					контакты (например: Email, затем ФИО, затем Телефон).
				</Text>
				<Text size='s' view='secondary' className='mt-2'>
					2. Если в ваших данных есть поля, которых нет в системе, вы можете
					добавить их вручную.
				</Text>
				<Text size='s' view='secondary' className='mt-2'>
					3. Система будет сопоставлять данные построчно, основываясь на
					выбранной вами последовательности.
				</Text>
				<div className='mt-3 flex items-center gap-2'>
					<div className='flex-grow rounded border border-[var(--color-bg-border)] p-1'>
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={onDragEnd}
						>
							<SortableContext
								items={order}
								strategy={horizontalListSortingStrategy}
							>
								<div role='list' className='flex w-full flex-wrap gap-2'>
									{order.map(k => (
										<Pill
											key={k}
											id={k}
											label={(fieldsByKey[k]?.name as any) || k}
											removable={customKeys.has(k)}
											onRemove={handleRemoveCustom}
										/>
									))}
								</div>
							</SortableContext>
						</DndContext>
					</div>
					<Button
						onlyIcon
						iconLeft={IconAdd}
						view='primary'
						iconSize='s'
						size='m'
						onClick={() =>
							openAddFieldModal({
								currentOrder: order,
								onApply: ({ existingKeys, newFields }) => {
									setOrder(prev => [
										...prev,
										...existingKeys,
										...newFields.map(f => f.key)
									])
									setNewlyDefinedFields(prev => [...prev, ...newFields])
								}
							})
						}
					/>
				</div>
			</div>

			<div>
				<Text size='l' weight='bold' view='primary'>
					Добавление контактов
				</Text>
				<Text size='s' view='secondary' className='mt-2'>
					Введите по одному контакту в строке. Поля разделяются запятыми в
					порядке, указанном выше.
				</Text>
				<div className='mt-3'>
					<TextField
						size='m'
						type='textarea'
						rows={8}
						placeholder={
							'contact1@domain.com, Фамилия Имя, Москва\ncontact2@domain.com, Должность, Компания'
						}
						value={input}
						onChange={v => setInput((v as string) || '')}
					/>
				</div>
			</div>

			<div>
				<Text size='l' weight='bold' view='primary'>
					Группа
				</Text>
				<div className='mt-3 max-w-[420px]'>
					<GroupSelector {...groupSelectorProps} />
				</div>
			</div>

			<div className='mt-2 flex justify-end'>
				<Button
					view='primary'
					label='Создать контакты'
					onClick={handleSubmit}
					disabled={!input.trim()}
				/>
			</div>
		</div>
	)
}

export default ManualCreateForm
