import { Button } from '@consta/uikit/Button'
import { Checkbox } from '@consta/uikit/Checkbox'
import { Loader } from '@consta/uikit/Loader'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { useEffect, useMemo, useState } from 'react'

import { showCustomToast } from '@/shared/lib/toaster'
import ModalShell from '@/shared/ui/Modals/ModalShell'
import { TablePagination } from '@/shared/ui/Table'

import {
	useAddMembersToGroupMutation,
	useContacts,
	useInvalidateContacts,
	useInvalidateGroups
} from '@/entities/contacts'

interface AddMembersModalProps {
	isOpen: boolean
	onClose: () => void
	groupId: string
}

export function AddMembersModal({
	isOpen,
	onClose,
	groupId
}: AddMembersModalProps) {
	// Search state
	const [addSearch, setAddSearch] = useState('')
	const [debouncedAddSearch, setDebouncedAddSearch] = useState('')
	useEffect(() => {
		const id = setTimeout(() => setDebouncedAddSearch(addSearch.trim()), 400)
		return () => clearTimeout(id)
	}, [addSearch])

	// Pagination state
	const [addPage, setAddPage] = useState(1)
	const [addLimit, setAddLimit] = useState(25)

	// Query params
	const addParams = useMemo(
		() => ({
			page: addPage,
			limit: addLimit,
			search: debouncedAddSearch || undefined
		}),
		[addPage, addLimit, debouncedAddSearch]
	)

	// Data fetching
	const { data: addContactsData, isLoading: isAddLoading } = useContacts(
		addParams as any
	)
	const addItems = addContactsData?.contacts || []
	const addTotal = addContactsData?.pagination.total || 0
	const addOffset = (addPage - 1) * addLimit

	// Selection state
	const [selectedAddIds, setSelectedAddIds] = useState<Set<string>>(new Set())
	const addPageIds = useMemo(
		() => (addItems as any[]).map(r => r.id as string),
		[addItems]
	)
	const addAllOnPageSelected =
		addPageIds.length > 0 && addPageIds.every(id => selectedAddIds.has(id))

	const toggleAddAllOnPage = () => {
		setSelectedAddIds(prev => {
			const next = new Set(prev)
			if (addAllOnPageSelected) addPageIds.forEach(id => next.delete(id))
			else addPageIds.forEach(id => next.add(id))
			return next
		})
	}

	const toggleAddOne = (id: string) => {
		setSelectedAddIds(prev => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})
	}

	// Mutations and invalidation
	const addMembersMutation = useAddMembersToGroupMutation()
	const invalidateContacts = useInvalidateContacts()
	const invalidateGroups = useInvalidateGroups()

	// Handle add members
	const handleAddMembers = () => {
		addMembersMutation.mutate(
			{
				id: groupId,
				payload: {
					contactIds: Array.from(selectedAddIds)
				} as any
			},
			{
				onSuccess: () => {
					showCustomToast({
						title: 'Участники добавлены',
						type: 'success'
					})
					onClose()
					setSelectedAddIds(new Set())
					setAddSearch('')
					setAddPage(1)
					invalidateContacts()
					invalidateGroups()
				},
				onError: (e: any) =>
					showCustomToast({
						title: e?.message || 'Ошибка добавления участников',
						type: 'error'
					})
			}
		)
	}

	// Reset state when modal closes
	useEffect(() => {
		if (!isOpen) {
			setSelectedAddIds(new Set())
			setAddSearch('')
			setAddPage(1)
		}
	}, [isOpen])

	return (
		<ModalShell
			isOpen={isOpen}
			onClose={onClose}
			title='Добавить участников'
			containerClassName='w-[900px] max-w-[96vw] p-6'
			footer={
				<div className='flex w-full justify-end gap-2'>
					<Button view='ghost' label='Отмена' onClick={onClose} />
					<Button
						view='primary'
						label='Добавить'
						onClick={handleAddMembers}
						disabled={selectedAddIds.size === 0 || addMembersMutation.isPending}
					/>
				</div>
			}
		>
			<div className='mb-3'>
				<TextField
					size='m'
					placeholder='Поиск по email и полям'
					value={addSearch}
					onChange={v => setAddSearch((v as string) || '')}
				/>
			</div>
			<div className='mb-2'>
				<Checkbox
					size='s'
					checked={addAllOnPageSelected}
					onChange={toggleAddAllOnPage}
					label='Выбрать все (на странице)'
				/>
			</div>
			<div className='max-h-[320px] overflow-auto rounded border p-2 pr-1'>
				{isAddLoading ? (
					<div className='flex w-full justify-center py-6'>
						<Loader type='dots' size='s' />
					</div>
				) : (
					(addItems as any[]).map(r => (
						<label key={r.id} className='flex items-center gap-2 py-1'>
							<input
								type='checkbox'
								checked={selectedAddIds.has(r.id)}
								onChange={() => toggleAddOne(r.id)}
							/>
							<span>{r.email}</span>
						</label>
					))
				)}
				{!isAddLoading && (addItems as any[]).length === 0 && (
					<Text size='s' view='secondary'>
						Ничего не найдено
					</Text>
				)}
			</div>
			<div className='mt-3 flex items-center justify-between'>
				<div>
					<Text size='s' view='secondary' className='mb-2 block'>
						Выбрано: {selectedAddIds.size}
					</Text>
				</div>
				<TablePagination
					total={addTotal}
					offset={addOffset}
					step={addLimit}
					onChange={(newOffset: number) => {
						const newPage = Math.floor(newOffset / addLimit) + 1
						setAddPage(newPage)
					}}
					onStepChange={(newStep: number) => {
						setAddLimit(newStep)
						setAddPage(1)
					}}
				/>
			</div>
		</ModalShell>
	)
}
