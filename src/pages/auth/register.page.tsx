import { Layout } from '@consta/uikit/Layout'

import { RegisterForm } from '@/features/registration'
import { SocialAuth } from '@/features/social-auth'

import { PUBLIC_ROUTES } from '@/shared/constants'
import { AuthFormWrapper } from '@/shared/ui'

function RegisterPage() {
	return (
		<Layout
			className='flex h-full w-full flex-col items-center justify-center'
			direction='column'
		>
			<AuthFormWrapper
				children={
					<SocialAuth
						description='Есть аккаунт?'
						linkText='Войти'
						linkTo={PUBLIC_ROUTES.LOGIN}
					/>
				}
				form={<RegisterForm />}
				title='Добро пожаловать в Mailframe'
				description='Войдите в систему, чтобы продолжить'
			/>
		</Layout>
	)
}

export const Component = RegisterPage
