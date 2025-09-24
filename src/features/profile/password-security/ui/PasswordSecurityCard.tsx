import { IconLock } from '@consta/icons/IconLock'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'

import { usePasswordChangeModal } from '@/features/profile/change-password'

export const PasswordSecurityCard = () => {
	const { openPasswordChangeModal } = usePasswordChangeModal()

	return (
		<Card
			verticalSpace='l'
			horizontalSpace='l'
			className='w-full !rounded-lg border border-[var(--color-bg-ghost)]'
			shadow={false}
		>
			<div className='flex items-center justify-between gap-4'>
				<div className='flex items-center'>
					<div
						className='mr-4 rounded-full px-3 py-2'
						style={{
							backgroundColor: 'var(--color-control-bg-primary)'
						}}
					>
						<IconLock size='m' className='text-white' />
					</div>
					<div>
						<div className='mb-1'>
							<Text weight='bold' view='primary'>
								Пароль
							</Text>
						</div>
						<Text view='secondary' size='xs' className='mt-1'>
							Пароль — ключ к вашей учетной записи. Никому его не сообщайте. При
							необходимости вы можете изменить его здесь для повышения
							безопасности.
						</Text>
					</div>
				</div>
				<Button
					label='Изменить'
					view='clear'
					className='!border !border-[var(--color-bg-ghost)]'
					onClick={openPasswordChangeModal}
				/>
			</div>
		</Card>
	)
}
