import { IconArrowNext } from '@consta/icons/IconArrowNext'
import { IconArrowPrevious } from '@consta/icons/IconArrowPrevious'
import { Button } from '@consta/uikit/Button'
import { Checkbox } from '@consta/uikit/Checkbox'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { useEffect, useMemo, useState } from 'react'

import { showCustomToast } from '@/shared/lib/toaster'
import ModalShell from '@/shared/ui/Modals/ModalShell'

import { useUpdateContactMutation } from '@/entities/contacts'

export type GroupItem = { key: string; label: string }

export type ManageContactGroupsModalProps = {
	isOpen: boolean
	onClose: () => void
	contactId: string | null
	allGroups: GroupItem[]
	initialSelected: GroupItem[]
	onSaved?: () => void
}

export function ManageContactGroupsModal({
	isOpen,
	onClose,
	contactId,
	allGroups,
	initialSelected,
	onSaved
}: ManageContactGroupsModalProps) {
	const [selected, setSelected] = useState<GroupItem[]>(initialSelected)
	const [rightSearch, setRightSearch] = useState('')
	const [leftSelectedIds, setLeftSelectedIds] = useState<Set<string>>(new Set())
	const [rightSelectedIds, setRightSelectedIds] = useState<Set<string>>(
		new Set()
	)

	// reset state on contact/modal open change
	useEffect(() => {
		if (!isOpen) return
		setSelected(initialSelected)
		setRightSearch('')
		setLeftSelectedIds(new Set())
		setRightSelectedIds(new Set())
	}, [isOpen, contactId, initialSelected])

	const availableRightGroups = useMemo(() => {
		const selectedKeys = new Set(selected.map(g => g.key))
		return allGroups.filter(
			g =>
				!selectedKeys.has(g.key) &&
				g.label.toLowerCase().includes(rightSearch.toLowerCase())
		)
	}, [allGroups, selected, rightSearch])

	const moveToRight = () => {
		setSelected(prev => prev.filter(g => !leftSelectedIds.has(g.key)))
		setLeftSelectedIds(new Set())
	}
	const moveToLeft = () => {
		const toAdd = availableRightGroups.filter(g => rightSelectedIds.has(g.key))
		setSelected(prev => {
			const map = new Map(prev.map(p => [p.key, p]))
			toAdd.forEach(g => map.set(g.key, g))
			return Array.from(map.values())
		})
		setRightSelectedIds(new Set())
	}

	const mutation = useUpdateContactMutation()
	const footer = (
		<div className='flex justify-end gap-2'>
			<Button
				view='ghost'
				label='Отмена'
				onClick={onClose}
				disabled={mutation.isPending}
			/>
			<Button
				view='primary'
				label='Сохранить'
				loading={mutation.isPending}
				onClick={() => {
					if (!contactId) return
					const groupIds = selected.map(g => g.key)
					mutation.mutate({ id: contactId, payload: { groupIds } } as any, {
						onSuccess: () => {
							showCustomToast({
								title: 'Контакт обновлён',
								type: 'success'
							})
							onSaved?.()
							onClose()
						},
						onError: (e: any) =>
							showCustomToast({
								title: 'Ошибка обновления контакта',
								description: e?.message || 'Не удалось обновить контакт',
								type: 'error'
							})
					})
				}}
			/>
		</div>
	)

	return (
		<ModalShell
			isOpen={isOpen}
			onClose={onClose}
			title='Управление группами'
			footer={footer}
			containerClassName='w-[880px] max-w-[96vw] p-6'
		>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
				<div className='min-h-[320px] rounded border p-3'>
					<Text size='s' view='secondary' className='mb-2'>
						Состоит в группах
					</Text>
					<div className='flex max-h-[280px] flex-col gap-2 overflow-auto pr-1'>
						{selected.map(g => (
							<Checkbox
								key={g.key}
								size='s'
								checked={leftSelectedIds.has(g.key)}
								onChange={e => {
									const checked = Boolean(
										(e?.target as HTMLInputElement)?.checked
									)
									setLeftSelectedIds(prev => {
										const next = new Set(prev)
										checked ? next.add(g.key) : next.delete(g.key)
										return next
									})
								}}
								label={g.label}
							/>
						))}
						{selected.length === 0 && (
							<Text size='s' view='secondary'>
								Нет групп
							</Text>
						)}
					</div>
				</div>
				<div className='flex flex-col items-center justify-center gap-3'>
					<Button
						onlyIcon
						size='m'
						view='secondary'
						iconLeft={IconArrowPrevious}
						onClick={moveToRight}
					/>
					<Button
						onlyIcon
						size='m'
						view='secondary'
						iconLeft={IconArrowNext}
						onClick={moveToLeft}
					/>
				</div>
				<div className='min-h-[320px] rounded border p-3'>
					<div className='mb-3'>
						<TextField
							size='s'
							placeholder='Поиск по группам'
							value={rightSearch}
							onChange={v => setRightSearch((v as string) || '')}
						/>
					</div>
					<div className='flex max-h-[280px] flex-col gap-2 overflow-auto pr-1'>
						{availableRightGroups.map(g => (
							<Checkbox
								key={g.key}
								size='s'
								checked={rightSelectedIds.has(g.key)}
								onChange={e => {
									const checked = Boolean(
										(e?.target as HTMLInputElement)?.checked
									)
									setRightSelectedIds(prev => {
										const next = new Set(prev)
										checked ? next.add(g.key) : next.delete(g.key)
										return next
									})
								}}
								label={g.label}
							/>
						))}
						{availableRightGroups.length === 0 && (
							<Text size='s' view='secondary'>
								Группы не найдены
							</Text>
						)}
					</div>
				</div>
			</div>
		</ModalShell>
	)
}

export default ManageContactGroupsModal
