import { Button } from '@consta/uikit/Button'
import { Modal } from '@consta/uikit/Modal'
import { Text } from '@consta/uikit/Text'
import { useState } from 'react'
import { toast } from 'sonner'

import { useStorageStore } from '@/entities/Storage'

interface EmptyTrashModalProps {
	isOpen: boolean
	onClose: () => void
}

export const EmptyTrashModal = ({ isOpen, onClose }: EmptyTrashModalProps) => {
	const { emptyTrash, trashedFiles } = useStorageStore()
	const [isLoading, setIsLoading] = useState(false)

	const filesCount = trashedFiles.items.length

	const handleEmptyTrash = async () => {
		setIsLoading(true)
		try {
			const result = await emptyTrash()
			if (result.success) {
				toast.success(`Корзина очищена. Удалено ${filesCount} файлов`)
				onClose()
			} else {
				toast.error(result.error || 'Ошибка при очистке корзины')
			}
		} catch {
			toast.error('Произошла ошибка при очистке корзины')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Modal isOpen={isOpen} hasOverlay onClickOutside={onClose} className='max-w-md'>
			<div className='p-6'>
				<Text size='l' weight='semibold' className='mb-4'>
					Очистить корзину
				</Text>

				<Text size='s' view='secondary' className='mb-6'>
					Все файлы в корзине ({filesCount} шт.) будут удалены безвозвратно. Это действие нельзя
					отменить.
				</Text>

				<div className='flex justify-end gap-3'>
					<Button label='Отмена' view='clear' size='s' onClick={onClose} disabled={isLoading} />
					<Button
						label='Очистить корзину'
						view='primary'
						size='s'
						onClick={handleEmptyTrash}
						loading={isLoading}
						style={{ background: 'var(--color-bg-alert)' }}
					/>
				</div>
			</div>
		</Modal>
	)
}
