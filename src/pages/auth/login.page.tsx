import { Layout } from '@consta/uikit/Layout'

import { AuthProvider, LoginForm, MfaForm, useAuth } from '@/features/auth'
import { SocialAuth } from '@/features/social-auth'

import { PUBLIC_ROUTES } from '@/shared/constants'
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
						children={
							<SocialAuth
								description='Нет аккаунта?'
								linkText='Зарегистрироваться'
								linkTo={PUBLIC_ROUTES.REGISTER}
							/>
						}
						form={<LoginForm />}
						title='Добро пожаловать в Mailframe'
						description='Войдите в систему, чтобы продолжить'
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
