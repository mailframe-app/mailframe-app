import { Button } from '@consta/uikit/Button'
import React from 'react'

import ModalShell from './ModalShell'

export type DeleteConfirmModalProps = {
	isOpen: boolean
	onClose: () => void
	onConfirm: () => void
	title?: React.ReactNode
	description?: React.ReactNode
	confirmLabel?: string
	cancelLabel?: string
	loading?: boolean
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title = 'Удалить элемент',
	description = 'Вы уверены, что хотите удалить? Это действие нельзя отменить.',
	confirmLabel = 'Удалить',
	cancelLabel = 'Отмена',
	loading = false
}) => {
	return (
		<ModalShell
			closeButton={false}
			isOpen={isOpen}
			onClose={onClose}
			title={title}
			description={description}
			containerClassName='w-[400px] p-6'
			footer={
				<div className='grid w-full grid-cols-2 gap-2'>
					<Button
						view='ghost'
						width='full'
						label={cancelLabel}
						onClick={onClose}
						disabled={loading}
					/>
					<Button
						view='primary'
						width='full'
						label={confirmLabel}
						onClick={onConfirm}
						loading={loading}
						style={{ background: 'var(--color-bg-alert)' }}
					/>
				</div>
			}
		></ModalShell>
	)
}

export default DeleteConfirmModal
