import { Button } from '@consta/uikit/Button'
import { Layout } from '@consta/uikit/Layout'
import { Modal } from '@consta/uikit/Modal'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { useStorageStore } from '@/entities/Storage'

interface RenameFileModalProps {
	isOpen: boolean
	fileId: string
	fileName: string
	onClose: () => void
}

export const RenameFileModal = ({ isOpen, fileId, fileName, onClose }: RenameFileModalProps) => {
	const [newName, setNewName] = useState('')
	const [error, setError] = useState<string | null>(null)
	const { renameFile, loading } = useStorageStore()

	useEffect(() => {
		if (isOpen) {
			setNewName(fileName)
			setError(null)
		}
	}, [isOpen, fileName])

	const handleSubmit = async () => {
		if (!newName.trim()) {
			setError('Введите название файла')
			return
		}

		try {
			const result = await renameFile(fileId, newName)
			if (result.success) {
				toast.success(`Файл "${fileName}" переименован в "${newName}"`)
				onClose()
			} else if (result.error) {
				toast.error(result.error)
			}
		} catch {
			toast.error('Произошла ошибка при переименовании файла')
		}
	}

	return (
		<Modal isOpen={isOpen} onEsc={onClose} hasOverlay>
			<Layout direction='column' className='p-6' style={{ width: '400px' }}>
				<Text size='xl' weight='bold' className='mb-4'>
					Переименовать файл
				</Text>

				<TextField
					label='Название файла'
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
