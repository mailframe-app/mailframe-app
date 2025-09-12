import { Layout } from '@consta/uikit/Layout'

import { RecoveryPasswordForm } from '@/features/recovery-password'

import { AuthFormWrapper } from '@/shared/ui'

function RecoveryPasswordPage() {
	return (
		<Layout
			className='flex h-full w-full flex-col items-center justify-center'
			direction='column'
		>
			<AuthFormWrapper
				form={<RecoveryPasswordForm />}
				title='Создать новый пароль'
				description='Введите новый пароль'
			/>
		</Layout>
	)
}

export const Component = RecoveryPasswordPage
