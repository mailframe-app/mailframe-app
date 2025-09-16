import { Button } from '@consta/uikit/Button'
import { useNavigate } from 'react-router-dom'

import { PUBLIC_ROUTES } from '@/shared/constants'
import { AuthFormWrapper } from '@/shared/ui'

import { useRecoveryRequest } from '../model/use-recovery-request'

import { ForgotPasswordForm } from './ForgotPasswordForm'

export function ForgotPassword() {
	const navigate = useNavigate()
	const { recoveryRequest, isPending, success } = useRecoveryRequest()

	if (success) {
		return (
			<AuthFormWrapper
				title='Инструкции по восстановлению пароля отправлены на указанный email.'
				description='Пожалуйста, проверьте вашу почту.'
			>
				<Button
					view='primary'
					width='full'
					size='l'
					label='Вернуться на страницу входа'
					onClick={() => {
						navigate(PUBLIC_ROUTES.LOGIN)
					}}
				/>
			</AuthFormWrapper>
		)
	}

	return (
		<AuthFormWrapper
			title='Не можете войти?'
			description='Восстановите пароль к своей учетной записи. Мы отправим код на вашу
          почту.'
			form={
				<ForgotPasswordForm onSubmit={recoveryRequest} isPending={isPending} />
			}
		/>
	)
}
