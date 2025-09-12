import { IconRevert } from '@consta/icons/IconRevert'
import { IconTrash } from '@consta/icons/IconTrash'
import { Button } from '@consta/uikit/Button'

interface EditSmtpSettingsHeaderProps {
	isDirty: boolean
	isLoading: boolean
	onSave: () => void
	onCancel: () => void
	onDelete: () => void
}

export const EditSmtpSettingsHeader = ({
	isDirty,
	isLoading,
	onSave,
	onCancel,
	onDelete
}: EditSmtpSettingsHeaderProps) => {
	return (
		<div className='flex items-center gap-2'>
			<Button
				view='clear'
				onlyIcon
				size='s'
				iconLeft={IconRevert}
				onClick={onCancel}
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
				title='Удалить'
				style={{ background: 'var(--color-bg-alert)' }}
			/>
		</div>
	)
}
