import { Button } from '@consta/uikit/Button'
import { Layout } from '@consta/uikit/Layout'
import { Modal } from '@consta/uikit/Modal'
import { Text } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { useState } from 'react'

interface CreateFolderModalProps {
	isOpen: boolean
	onClose: () => void
	onSubmit: (name: string) => Promise<boolean>
	loading?: boolean
}

export const CreateFolderModal = ({
	isOpen,
	onClose,
	onSubmit,
	loading = false
}: CreateFolderModalProps) => {
	const [folderName, setFolderName] = useState('')
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async () => {
		if (!folderName.trim()) {
			setError('Введите название папки')
			return
		}

		const success = await onSubmit(folderName)
		if (success) {
			setFolderName('')
			setError(null)
		}
	}

	const handleClose = () => {
		setFolderName('')
		setError(null)
		onClose()
	}

	return (
		<Modal isOpen={isOpen} onEsc={handleClose} hasOverlay>
			<Layout direction='column' className='p-6' style={{ width: '400px' }}>
				<Text size='xl' weight='bold' className='mb-4'>
					Создать папку
				</Text>

				<TextField
					label='Название папки'
					value={folderName}
					onChange={value => {
						setFolderName(value || '')
						if (error) setError(null)
					}}
					status={error ? 'alert' : undefined}
					caption={error || undefined}
					autoFocus
					className='mb-4'
				/>

				<Layout direction='row' className='justify-end gap-2'>
					<Button label='Отмена' view='ghost' onClick={handleClose} disabled={loading} />
					<Button label='Создать' onClick={handleSubmit} loading={loading} />
				</Layout>
			</Layout>
		</Modal>
	)
}
