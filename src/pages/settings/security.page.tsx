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
			{/* <Card
				verticalSpace='l'
				horizontalSpace='l'
				className='flex h-full w-full flex-col !rounded-lg bg-[var(--color-bg-default)]'
				shadow={false}
			> */}
			<Layout direction='column' className='flex-col gap-4'>
				<Card
					verticalSpace='l'
					horizontalSpace='l'
					className='flex h-full w-full flex-col gap-4 !rounded-lg bg-[var(--color-bg-default)]'
					shadow={false}
				>
					<div className='flex flex-col'>
						<Text as='h2' view='primary' size='l' weight='semibold'>
							Управление аккаунтом
						</Text>
						<Text view='secondary' size='s' weight='regular'>
							Настройка безопасности вашего аккаунта
						</Text>
					</div>
					<EmailVerificationCard />
					<PasswordSecurityCard />
				</Card>
				<Card
					verticalSpace='l'
					horizontalSpace='l'
					className='flex h-full w-full flex-col gap-4 !rounded-lg bg-[var(--color-bg-default)]'
					shadow={false}
				>
					<div className='flex flex-col'>
						<Text as='h2' view='primary' size='l' weight='semibold'>
							Многофакторная аутентификация
						</Text>
						<Text view='secondary' size='s' weight='regular'>
							Двухфакторная аутентификация — это дополнительный уровень защиты
							для вашего аккаунта
						</Text>
					</div>
					<MfaStatus />
				</Card>
				<Card
					verticalSpace='l'
					horizontalSpace='l'
					className='flex h-full w-full flex-col gap-4 !rounded-lg bg-[var(--color-bg-default)]'
					shadow={false}
				>
					<div className='flex flex-col'>
						<Text as='h2' view='primary' size='l' weight='semibold'>
							Активные подключения
						</Text>
						<Text view='secondary' size='s' weight='regular'>
							Список активных подключений к вашему аккаунту
						</Text>
					</div>
					<Sessions />
				</Card>
			</Layout>
			{/* </Card> */}
		</Layout>
	)
}

export const Component = SecurityPage
