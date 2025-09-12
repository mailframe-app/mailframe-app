import { Card } from '@consta/uikit/Card'
import { Layout } from '@consta/uikit/Layout'
import { Text } from '@consta/uikit/Text'

import { MfaStatus } from '@/features/mfa'
import { EmailVerificationCard } from '@/features/profile/email-verification'
import { PasswordSecurityCard } from '@/features/profile/password-security'

import { Sessions } from '@/entities/session'

function SecurityPage() {
	return (
		<Layout direction='column' className='w-full'>
			<Card
				verticalSpace='2xl'
				horizontalSpace='2xl'
				className='flex h-full w-full flex-col !rounded-2xl'
			>
				<Text size='2xl' weight='bold' view='primary' className='mb-4'>
					Безопасность
				</Text>

				<Layout direction='column' className='flex-col gap-4'>
					<Text size='m' weight='bold' view='primary'>
						Управление аккаунтом
					</Text>
					<EmailVerificationCard />
					<PasswordSecurityCard />
					<Text size='m' weight='bold' view='primary' className='mt-4'>
						Многофакторная аутентификация
					</Text>
					<MfaStatus />
					<Text size='m' weight='bold' view='primary' className='mt-4'>
						Активные подключения
					</Text>
					<Sessions />
				</Layout>
			</Card>
		</Layout>
	)
}

export const Component = SecurityPage
