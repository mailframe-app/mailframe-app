import { Layout } from '@consta/uikit/Layout'

import { ForgotPassword } from '@/features/recovery-password'

function ForgotPasswordPage() {
	return (
		<Layout
			className='flex h-full w-full flex-col items-center justify-center'
			direction='column'
		>
			<ForgotPassword />
		</Layout>
	)
}

export const Component = ForgotPasswordPage
