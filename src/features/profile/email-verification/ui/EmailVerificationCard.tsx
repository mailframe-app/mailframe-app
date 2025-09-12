import { IconMail } from '@consta/icons/IconMail'
import { Badge } from '@consta/uikit/Badge'
import { Button } from '@consta/uikit/Button'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'

import {
	useProfile,
	useSendEmailVerificationMutation
} from '@/entities/profile'

export const EmailVerificationCard = () => {
	const profile = useProfile()
	const sendVerification = useSendEmailVerificationMutation()

	const handleSendVerification = () => {
		sendVerification.mutate()
	}

	const isEmailVerified = profile?.isEmailVerified || false
	const email = profile?.email || ''

	return (
		<Card
			verticalSpace='xl'
			horizontalSpace='xl'
			className='w-full !rounded-xl'
		>
			<div className='flex items-center justify-between gap-4'>
				<div className='flex items-center'>
					<div
						className='mr-4 rounded-full px-3 py-2'
						style={{
							backgroundColor: 'var(--color-control-bg-primary)'
						}}
					>
						<IconMail size='m' className='text-white' />
					</div>
					<div>
						<div className='mb-1 flex items-center'>
							<Text weight='bold' view='primary' className='mr-2'>
								Почта
							</Text>
							<Badge
								label={isEmailVerified ? 'Подтверждена' : 'Не подтверждена'}
								status={isEmailVerified ? 'success' : 'error'}
								size='s'
								view='tinted'
							/>
						</div>
						<Text view='secondary' size='xs' className='mt-1'>
							Ваша учетная запись привязана к адресу {email}. На него мы
							отправляем важные уведомления и информацию о безопасности.
						</Text>
					</div>
				</div>
				{!isEmailVerified && (
					<Button
						label='Подтвердить'
						view='secondary'
						onClick={handleSendVerification}
						loading={sendVerification.isPending}
					/>
				)}
			</div>
		</Card>
	)
}
