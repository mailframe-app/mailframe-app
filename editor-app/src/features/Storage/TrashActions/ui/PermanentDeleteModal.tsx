import { Button } from '@consta/uikit/Button'
import { Modal } from '@consta/uikit/Modal'
import { Text } from '@consta/uikit/Text'
import { useState } from 'react'
import { toast } from 'sonner'

import { useStorageStore } from '@/entities/Storage'

interface PermanentDeleteModalProps {
	isOpen: boolean
	fileId: string
	fileName: string
	onClose: () => void
}

export const PermanentDeleteModal = ({
	isOpen,
	fileId,
	fileName,
	onClose
}: PermanentDeleteModalProps) => {
	const { permanentDeleteFile } = useStorageStore()
	const [isLoading, setIsLoading] = useState(false)

	const handleDelete = async () => {
		setIsLoading(true)
		try {
			const result = await permanentDeleteFile(fileId)
			if (result.success) {
				toast.success(`Файл "${fileName}" удален навсегда`)
				onClose()
			} else {
				toast.error(result.error || 'Ошибка при удалении файла')
			}
		} catch {
			toast.error('Произошла ошибка при удалении файла')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Modal isOpen={isOpen} hasOverlay onClickOutside={onClose} className='max-w-md'>
			<div className='p-6'>
				<Text size='l' weight='semibold' className='mb-4'>
					Удалить навсегда
				</Text>

				<Text size='s' view='secondary' className='mb-6'>
					Файл "{fileName}" будет удален безвозвратно. Это действие нельзя отменить.
				</Text>

				<div className='flex justify-end gap-3'>
					<Button label='Отмена' view='clear' size='s' onClick={onClose} disabled={isLoading} />
					<Button
						label='Удалить навсегда'
						view='primary'
						size='s'
						onClick={handleDelete}
						loading={isLoading}
						style={{ background: 'var(--color-bg-alert)' }}
					/>
				</div>
			</div>
		</Modal>
	)
}
