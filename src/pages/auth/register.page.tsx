import { Layout } from '@consta/uikit/Layout'

import { RegisterForm } from '@/features/registration'
import { SocialAuth } from '@/features/social-auth'

import { AuthFormWrapper } from '@/shared/ui'

function RegisterPage() {
	return (
		<Layout
			className='flex h-full w-full flex-col items-center justify-center'
			direction='column'
		>
			<AuthFormWrapper
				children={<SocialAuth />}
				form={<RegisterForm />}
				title='Регистрация'
			/>
		</Layout>
	)
}

export const Component = RegisterPage
