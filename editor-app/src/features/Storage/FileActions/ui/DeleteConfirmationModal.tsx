import { Button } from '@consta/uikit/Button'
import { Layout } from '@consta/uikit/Layout'
import { Modal } from '@consta/uikit/Modal'
import { Text } from '@consta/uikit/Text'

interface DeleteConfirmationModalProps {
	isOpen: boolean
	itemName: string
	onClose: () => void
	onConfirm: () => void
	loading?: boolean
	itemType?: 'файл' | 'папку'
}

export const DeleteConfirmationModal = ({
	isOpen,
	itemName,
	onClose,
	onConfirm,
	loading = false,
	itemType = 'файл'
}: DeleteConfirmationModalProps) => {
	const handleConfirm = () => {
		onConfirm()
		onClose()
	}

	return (
		<Modal isOpen={isOpen} onEsc={onClose} hasOverlay>
			<Layout direction='column' className='p-6' style={{ width: '400px' }}>
				<Text size='xl' weight='bold' className='mb-2'>
					Подтвердите удаление
				</Text>
				<Text className='mb-6'>
					Вы уверены, что хотите удалить {itemType} "{itemName}"?
				</Text>
				<Layout direction='row' className='justify-end gap-2'>
					<Button label='Отмена' view='ghost' onClick={onClose} disabled={loading} />
					<Button
						label='Удалить'
						view='primary'
						status='alert'
						onClick={handleConfirm}
						loading={loading}
						style={{
							background: 'var(--color-bg-alert)'
						}}
					/>
				</Layout>
			</Layout>
		</Modal>
	)
}
