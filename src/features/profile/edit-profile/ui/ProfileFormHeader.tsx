import { IconRevert } from '@consta/icons/IconRevert'
import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'

interface ProfileFormHeaderProps {
	isDirty: boolean
	isLoading: boolean
	onSave: () => void
	onRevert: () => void
}

export const ProfileFormHeader = ({
	isDirty,
	isLoading,
	onSave,
	onRevert
}: ProfileFormHeaderProps) => {
	return (
		<div className='mb-7 flex items-center justify-between'>
			<div className='flex flex-col'>
				<Text view='primary' size='xl' weight='semibold'>
					Данные аккаунта
				</Text>
				<Text view='secondary' size='s' weight='regular'>
					Редактируйте ваши персональные данные
				</Text>
			</div>
			{isDirty && (
				<div className='flex items-center gap-2'>
					<Button
						view='clear'
						onlyIcon
						size='s'
						iconLeft={IconRevert}
						onClick={onRevert}
					/>
					<Button
						view='primary'
						size='s'
						label='Сохранить'
						onClick={onSave}
						loading={isLoading}
					/>
				</div>
			)}
		</div>
	)
}
