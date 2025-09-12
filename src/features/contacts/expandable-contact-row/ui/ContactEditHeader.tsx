import { IconRevert } from '@consta/icons/IconRevert'
import { IconTrash } from '@consta/icons/IconTrash'
import { Button } from '@consta/uikit/Button'

interface ContactEditHeaderProps {
	isDirty: boolean
	isLoading: boolean
	onSave: () => void
	onCancel: () => void
	onDelete: () => void
}

export const ContactEditHeader = ({
	isDirty,
	isLoading,
	onSave,
	onCancel,
	onDelete
}: ContactEditHeaderProps) => {
	return (
		<div className='flex items-center gap-2'>
			<Button
				view='clear'
				onlyIcon
				size='s'
				iconLeft={IconRevert}
				onClick={onCancel}
				title='Отменить изменения'
			/>
			<Button
				view='primary'
				size='s'
				label='Сохранить'
				onClick={onSave}
				loading={isLoading}
				disabled={!isDirty}
			/>
			<Button
				view='primary'
				onlyIcon
				size='s'
				iconLeft={IconTrash}
				onClick={onDelete}
				title='Удалить контакт'
				style={{ background: 'var(--color-bg-alert)' }}
			/>
		</div>
	)
}
