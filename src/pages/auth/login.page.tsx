import { Layout } from '@consta/uikit/Layout'

import { AuthProvider, LoginForm, MfaForm, useAuth } from '@/features/auth'
import { SocialAuth } from '@/features/social-auth'

import { AuthFormWrapper } from '@/shared/ui'

function LoginPageContent() {
	const { showMfa } = useAuth()

	return (
		<Layout
			className='flex h-full w-full flex-col items-center justify-center'
			direction='column'
		>
			{showMfa ? (
				<AuthFormWrapper
					form={<MfaForm />}
					title='Подтверждение входа'
					description='Для продолжения введите код из приложения-аутентификатора или воспользуйтесь кодом восстановления.'
				></AuthFormWrapper>
			) : (
				<>
					<AuthFormWrapper
						children={<SocialAuth />}
						form={<LoginForm />}
						title='Вход в систему'
					/>
				</>
			)}
		</Layout>
	)
}

export function LoginPage() {
	return (
		<AuthProvider>
			<LoginPageContent />
		</AuthProvider>
	)
}

export const Component = LoginPage
