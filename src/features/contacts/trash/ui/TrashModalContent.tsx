import { TextField } from '@consta/uikit/TextField'
import React, { useEffect, useState } from 'react'

import { DeleteConfirmModal } from '@/shared/ui/Modals'

import { useContactsTrash } from '../model/hooks/useContactsTrash'

import { TrashContactsTable } from './TrashContactsTable'

interface TrashModalContentProps {
	onClose: () => void
}

export const TrashModalContent: React.FC<TrashModalContentProps> = ({}) => {
	const [page, setPage] = useState(1)
	const [limit, setLimit] = useState(10)
	const [search, setSearch] = useState('')
	const [debouncedSearch, setDebouncedSearch] = useState('')

	useEffect(() => {
		const timer = setTimeout(() => setDebouncedSearch(search), 300)
		return () => clearTimeout(timer)
	}, [search])

	const {
		data,
		isLoading,
		isError,
		restore,
		delete: permanentDelete,
		isRestoring,
		isDeleting
	} = useContactsTrash({
		page,
		limit,
		search: debouncedSearch || undefined
	})

	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
	const [contactToDelete, setContactToDelete] = useState<string | null>(null)

	const handleDelete = (id: string) => {
		setContactToDelete(id)
		setDeleteConfirmOpen(true)
	}

	const confirmDelete = async () => {
		if (contactToDelete) {
			await permanentDelete(contactToDelete)
			setDeleteConfirmOpen(false)
			setContactToDelete(null)
		}
	}

	const handleSearchChange = (value: string | null) => {
		setPage(1)
		setSearch(value || '')
	}

	return (
		<div className='flex flex-col gap-4'>
			<TextField
				placeholder='Поиск по email'
				value={search}
				onChange={handleSearchChange}
				withClearButton
				size='m'
			/>
			<TrashContactsTable
				data={data}
				isLoading={isLoading}
				isError={isError}
				page={page}
				limit={limit}
				setPage={setPage}
				setLimit={setLimit}
				onRestore={restore}
				onDelete={handleDelete}
				isRestoring={isRestoring}
				isDeleting={isDeleting}
				search={debouncedSearch}
				setSearch={setSearch}
			/>
			<DeleteConfirmModal
				isOpen={deleteConfirmOpen}
				onClose={() => setDeleteConfirmOpen(false)}
				onConfirm={confirmDelete}
				title='Удалить контакт навсегда?'
				description='Это действие нельзя отменить. Вся связанная с контактом информация будет удалена.'
				loading={isDeleting}
			/>
		</div>
	)
}
