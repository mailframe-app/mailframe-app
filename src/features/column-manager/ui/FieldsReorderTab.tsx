import { Badge } from '@consta/uikit/Badge'
import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import type { DragEndEvent } from '@dnd-kit/core'
import {
	DndContext,
	PointerSensor,
	closestCenter,
	useDroppable,
	useSensor,
	useSensors
} from '@dnd-kit/core'
import {
	SortableContext,
	arrayMove,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import React, { useEffect, useMemo, useState } from 'react'

import { showCustomToast } from '@/shared/lib/toaster'

import {
	useContactFields,
	useInvalidateFields,
	useRefetchFields,
	useReorderFieldsMutation,
	useUpdateFieldMutation
} from '@/entities/contacts'

export type FieldsReorderTabProps = {
	onClose?: () => void
}

type FieldItem = { key: string; name: string }

const Pill: React.FC<{
	id: string
	label: string
	zone: 'visible' | 'hidden'
}> = ({ id, label, zone }) => {
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
		background: 'var(--color-bg-default)',
		borderColor: 'var(--color-control-typo-ghost)'
	}
	const status = zone === 'visible' ? 'success' : 'system'
	return (
		<div
			ref={setNodeRef}
			{...attributes}
			{...listeners}
			className={`mb-1 flex w-full items-center gap-2 ${isDragging ? 'outline-1 outline-[var(--color-control-typo-ghost)]' : ''} cursor-grab`}
			style={style}
			role='listitem'
		>
			<Badge
				label={label}
				status={status as any}
				view='tinted'
				size='l'
				className='w-full'
			/>
		</div>
	)
}

const DroppableZone: React.FC<{
	id: 'visible' | 'hidden'
	children: React.ReactNode
}> = ({ id, children }) => {
	const { setNodeRef, isOver } = useDroppable({ id })
	return (
		<div
			ref={setNodeRef}
			className={`rounded p-2 ${isOver ? 'bg-[var(--color-bg-ghost)]/40' : ''}`}
			style={{ minHeight: '6rem' }}
		>
			{children}
		</div>
	)
}

const FieldsReorderTab: React.FC<FieldsReorderTabProps> = ({ onClose }) => {
	const { data: fieldsData } = useContactFields()
	const invalidateFields = useInvalidateFields()
	const refetchFields = useRefetchFields()
	const updateFieldMutation = useUpdateFieldMutation()
	const reorderFieldsMutation = useReorderFieldsMutation()
	const [saving, setSaving] = useState(false)

	const initialVisible = useMemo(() => {
		const items: FieldItem[] = (fieldsData?.fields || [])
			.filter((f: any) => f.isVisible)
			.sort((a: any, b: any) => a.sortOrder - b.sortOrder)
			.map((f: any) => ({ key: f.key, name: f.name || f.key }))
		return items
	}, [fieldsData])

	const initialHidden = useMemo(() => {
		const items: FieldItem[] = (fieldsData?.fields || [])
			.filter((f: any) => !f.isVisible)
			.sort((a: any, b: any) => a.sortOrder - b.sortOrder)
			.map((f: any) => ({ key: f.key, name: f.name || f.key }))
		return items
	}, [fieldsData])

	const [visibleKeys, setVisibleKeys] = useState<string[]>([])
	const [hiddenKeys, setHiddenKeys] = useState<string[]>([])

	const keyToItem = useMemo(() => {
		const map = new Map<string, FieldItem>()
		;(fieldsData?.fields || []).forEach((f: any) => {
			map.set(f.key, { key: f.key, name: f.name || f.key })
		})
		return map
	}, [fieldsData])

	useEffect(() => {
		setVisibleKeys(initialVisible.map(i => i.key))
		setHiddenKeys(initialHidden.map(i => i.key))
	}, [initialVisible, initialHidden])

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 4 } })
	)

	const containerOf = (id: string) => {
		if (visibleKeys.includes(id)) return 'visible'
		if (hiddenKeys.includes(id)) return 'hidden'
		return undefined
	}

	const onDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (!over) return
		const activeId = String(active.id)
		const overId = String(over.id)

		const from = containerOf(activeId)
		const to =
			containerOf(overId) ||
			(overId === 'visible' || overId === 'hidden'
				? (overId as 'visible' | 'hidden')
				: undefined)
		if (!from || !to) return

		if (from === to) {
			const list = from === 'visible' ? visibleKeys : hiddenKeys
			const oldIndex = list.indexOf(activeId)
			const newIndex = list.indexOf(overId)
			if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
				const moved = arrayMove(list, oldIndex, newIndex)
				from === 'visible' ? setVisibleKeys(moved) : setHiddenKeys(moved)
			}
			return
		}

		if (from === 'visible' && to === 'hidden') {
			setVisibleKeys(prev => prev.filter(k => k !== activeId))
			const idx = hiddenKeys.indexOf(overId)
			const next = [...hiddenKeys]
			if (idx >= 0) next.splice(idx, 0, activeId)
			else next.push(activeId)
			setHiddenKeys(next)
			return
		}

		if (from === 'hidden' && to === 'visible') {
			setHiddenKeys(prev => prev.filter(k => k !== activeId))
			const idx = visibleKeys.indexOf(overId)
			const next = [...visibleKeys]
			if (idx >= 0) next.splice(idx, 0, activeId)
			else next.push(activeId)
			setVisibleKeys(next)
			return
		}
	}

	const handleSave = async () => {
		if (!fieldsData?.fields) return
		try {
			setSaving(true)
			const byKey = new Map<string, any>()
			fieldsData.fields.forEach((f: any) => byKey.set(f.key, f))

			// 1) Visibility changes (only changed)
			const visibilityPromises: Promise<any>[] = []
			for (const f of fieldsData.fields) {
				const desiredVisible = visibleKeys.includes(f.key)
				if (Boolean(f.isVisible) !== Boolean(desiredVisible)) {
					visibilityPromises.push(
						updateFieldMutation.mutateAsync({
							id: f.id,
							payload: { isVisible: desiredVisible }
						})
					)
				}
			}
			if (visibilityPromises.length) {
				await Promise.all(visibilityPromises)
			}

			// 2) Full order: visible then hidden
			const orderedKeys = [...visibleKeys, ...hiddenKeys]
			const desiredIds = orderedKeys
				.map(k => byKey.get(k)?.id)
				.filter((v: string | undefined): v is string => Boolean(v))

			const allIds = (fieldsData.fields || []).map((f: any) => f.id)
			const countsMatch = desiredIds.length === allIds.length

			if (countsMatch) {
				const currentIds = [...fieldsData.fields]
					.sort((a: any, b: any) => a.sortOrder - b.sortOrder)
					.map((f: any) => f.id)
				const orderChanged = desiredIds.some(
					(id, idx) => id !== currentIds[idx]
				)
				if (orderChanged) {
					await reorderFieldsMutation.mutateAsync({
						fieldIds: desiredIds
					})
				}
			}

			invalidateFields()
			await refetchFields()
			showCustomToast({
				title: 'Успешно',
				description: 'Настройки таблицы сохранены',
				type: 'success'
			})
			onClose?.()
		} catch (e: any) {
			showCustomToast({
				title: 'Ошибка',
				description: e?.message || 'Не удалось сохранить настройки',
				type: 'error'
			})
		} finally {
			setSaving(false)
		}
	}

	const handleReset = () => {
		setVisibleKeys(initialVisible.map(i => i.key))
		setHiddenKeys(initialHidden.map(i => i.key))
		showCustomToast({
			title: 'Информация',
			description: 'Изменения отменены',
			type: 'info'
		})
	}

	return (
		<div className='flex h-full flex-col gap-3 overflow-auto'>
			<Text size='l' weight='bold' view='primary'>
				Порядок и видимость колонок
			</Text>
			<Text size='s' view='secondary'>
				Перетащите поля для изменения порядка (выше — видимые, ниже — скрытые).
			</Text>

			<div className='flex flex-row gap-3'>
				<div className='relative h-full min-h-[280px] w-1/2 p-3'>
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={onDragEnd}
					>
						<DroppableZone id='visible'>
							<Text size='s' view='secondary' className='mb-2'>
								Видимые
							</Text>
							<SortableContext
								items={visibleKeys}
								strategy={verticalListSortingStrategy}
							>
								<div role='list' className='flex w-full flex-col'>
									{visibleKeys.map(key => {
										const item = keyToItem.get(key)
										if (!item) return null
										return (
											<Pill
												key={key}
												id={key}
												label={item.name}
												zone='visible'
											/>
										)
									})}
								</div>
							</SortableContext>
						</DroppableZone>

						<div className='pointer-events-none my-2 h-0 border-t border-dashed border-[var(--color-control-typo-ghost)]' />

						<DroppableZone id='hidden'>
							<Text size='s' view='secondary' className='mb-2'>
								Скрытые
							</Text>
							<SortableContext
								items={hiddenKeys}
								strategy={verticalListSortingStrategy}
							>
								<div role='list' className='flex w-full flex-col'>
									{hiddenKeys.map(key => {
										const item = keyToItem.get(key)
										if (!item) return null
										return (
											<Pill
												key={key}
												id={key}
												label={item.name}
												zone='hidden'
											/>
										)
									})}
								</div>
							</SortableContext>
						</DroppableZone>
					</DndContext>
				</div>
				<div className='my-auto flex shrink-0 flex-col gap-2'>
					<Button
						view='primary'
						label='Сохранить'
						onClick={handleSave}
						disabled={saving}
					/>
					<Button
						view='secondary'
						label='Сбросить'
						onClick={handleReset}
						disabled={saving}
					/>
				</div>
			</div>
		</div>
	)
}

export default FieldsReorderTab
