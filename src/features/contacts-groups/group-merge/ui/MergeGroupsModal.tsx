import { Button } from '@consta/uikit/Button'
import { CheckboxGroup } from '@consta/uikit/CheckboxGroup'
import { Select, type SelectPropGetItemLabel } from '@consta/uikit/SelectCanary'
import { Switch } from '@consta/uikit/Switch'
import { Text } from '@consta/uikit/Text'
import { useDebounce } from '@consta/uikit/useDebounce'
import { useMemo, useState } from 'react'

import ModalShell from '@/shared/ui/Modals/ModalShell'

import { useMergeGroups } from '../model/useMergeGroups'

import { useGroups } from '@/entities/contacts'

export type MergeGroupsModalProps = {
	isOpen: boolean
	onClose: () => void
	items: { id: string; name: string }[]
	onMerged?: (res?: unknown) => void
}

type GroupItem = { id: string; name: string }

const getItemLabel: SelectPropGetItemLabel<GroupItem> = ({ name }) => name

const isSubstring = (s: string, sub: string) =>
	s.toLowerCase().includes(sub.toLowerCase())

export function MergeGroupsModal({
	isOpen,
	onClose,
	items,
	onMerged
}: MergeGroupsModalProps) {
	// Target Select
	const [target, setTarget] = useState<GroupItem | null>()
	const [searchValue, setSearchValue] = useState('')
	const setSearchValueDebounce = useDebounce(setSearchValue, 300)

	// Источники
	const [sourceIds, setSourceIds] = useState<Set<string>>(
		new Set(items.map(i => i.id))
	)
	const sourcePool: GroupItem[] = useMemo(() => items, [items])
	const selectedSourceItems: GroupItem[] = useMemo(
		() => sourcePool.filter(i => sourceIds.has(i.id)),
		[sourcePool, sourceIds]
	)

	// Загружаем все группы для селекта цели
	const { data: groupsData } = useGroups({
		page: 1,
		limit: 25,
		search: undefined
	})
	const allGroups: GroupItem[] = useMemo(
		() => groupsData?.items ?? [],
		[groupsData]
	)

	// Фильтрация и сортировка
	const selectItems = useMemo(() => {
		const searchWords = searchValue.trim().split(/\s+/).filter(Boolean)
		if (searchWords.length === 0) return allGroups
		const propsToSearch = ['name'] as const
		const weights: Record<string, number> = {}

		for (let index = 0; index < allGroups.length; index++) {
			const item = allGroups[index]
			let weight = 0

			for (let index = 0; index < searchWords.length; index++) {
				const word = searchWords[index].toLocaleLowerCase()

				for (let index = 0; index < propsToSearch.length; index++) {
					if (isSubstring(item[propsToSearch[index]], word)) {
						weight++
					}
				}
			}

			weights[item.id] = weight
		}
		return allGroups
			.filter(item => weights[item.id])
			.sort((a, b) => weights[b.id] - weights[a.id])
	}, [searchValue, allGroups])

	const { merge, isPending } = useMergeGroups()
	const [deleteSources, setDeleteSources] = useState<boolean>(true)
	const isConfirmDisabled =
		!target || selectedSourceItems.length < 1 || isPending

	const safeTarget = useMemo(
		() => (target && selectItems.some(i => i.id === target.id) ? target : null),
		[target, selectItems]
	)

	const footer = (
		<div className='flex justify-end gap-2'>
			<Button
				view='ghost'
				label='Отмена'
				onClick={onClose}
				disabled={isPending}
			/>
			<Button
				view='primary'
				label='Объединить'
				onClick={async () => {
					const res = await merge({
						targetId: target?.id || '',
						sourceIds: selectedSourceItems
							.map(s => s.id)
							.filter(id => id !== (target?.id || '')),
						deleteSources
					})
					onMerged?.(res)
					onClose()
				}}
				loading={isPending}
				disabled={isConfirmDisabled}
			/>
		</div>
	)

	return (
		<ModalShell
			isOpen={isOpen}
			onClose={onClose}
			title='Объединить группы контактов'
			description='Выберите целевую группу и группы-источники для объединения. После объединения контакты из исходных групп будут объединены в целевую группу.'
			footer={footer}
		>
			<div className='grid grid-cols-1 gap-3'>
				<div>
					<Text size='s' view='secondary' className='mb-1'>
						Целевая группа
					</Text>
					<Select
						items={selectItems}
						getItemLabel={getItemLabel}
						placeholder='Выберите вариант'
						value={safeTarget}
						onChange={setTarget}
						onInput={setSearchValueDebounce}
						input
						getItemKey={(i: GroupItem) => i.id}
						labelForEmptyItems='Группы не найдены'
					/>
				</div>

				<div>
					<Text size='s' view='secondary' className='mb-1'>
						Группы для объединения
					</Text>
					<CheckboxGroup
						items={sourcePool}
						value={selectedSourceItems}
						getItemKey={(i: GroupItem) => i.id}
						getItemLabel={(i: GroupItem) =>
							i.id === (target?.id || '') ? `${i.name} (целевая)` : i.name
						}
						onChange={(valueList: GroupItem[] | null) => {
							const list = valueList ?? []
							setSourceIds(new Set(list.map(v => v.id)))
						}}
						size='s'
						direction='column'
					/>
				</div>
				<div>
					<Switch
						checked={deleteSources}
						onChange={() => setDeleteSources(v => !v)}
						label={
							deleteSources
								? 'Удалять исходные группы после объединения'
								: 'Исходные группы останутся после объединения'
						}
						size='s'
					/>
				</div>
			</div>
		</ModalShell>
	)
}
