import { Button } from '@consta/uikit/Button'
import { Layout } from '@consta/uikit/Layout'
import { Modal } from '@consta/uikit/Modal'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useStorageStore } from '@/entities/Storage'

interface RenameFolderModalProps {
	isOpen: boolean
	folderId: string
	folderName: string
	onClose: () => void
}

export const RenameFolderModal = ({
	isOpen,
	folderId,
	folderName,
	onClose
}: RenameFolderModalProps) => {
	const [newName, setNewName] = useState('')
	const [error, setError] = useState<string | null>(null)
	const { renameFolder, loading } = useStorageStore()

	useEffect(() => {
		if (isOpen) {
			setNewName(folderName)
			setError(null)
		}
	}, [isOpen, folderName])

	const handleSubmit = async () => {
		if (!newName.trim()) {
			setError('Введите название папки')
			return
		}

		try {
			const result = await renameFolder(folderId, newName)
			if (result.success) {
				toast.success(`Папка "${folderName}" переименована в "${newName}"`)
				onClose()
			} else if (result.error) {
				toast.error(result.error)
			}
		} catch {
			toast.error('Произошла ошибка при переименовании папки')
		}
	}

	return (
		<Modal isOpen={isOpen} onEsc={onClose} hasOverlay>
			<Layout direction='column' className='p-6' style={{ width: '400px' }}>
				<Text size='xl' weight='bold' className='mb-4'>
					Переименовать папку
				</Text>

				<TextField
					label='Название папки'
					value={newName}
					onChange={value => {
						setNewName(value || '')
						if (error) setError(null)
					}}
					status={error ? 'alert' : undefined}
					caption={error || undefined}
					autoFocus
					className='mb-4'
				/>

				<Layout direction='row' className='justify-end gap-2'>
					<Button label='Отмена' view='ghost' onClick={onClose} disabled={loading.operation} />
					<Button label='Сохранить' onClick={handleSubmit} loading={loading.operation} />
				</Layout>
			</Layout>
		</Modal>
	)
}
