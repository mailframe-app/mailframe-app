import { useMutation } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import type { ErrorResponse } from '@/shared/api/types'
import { PUBLIC_ROUTES, type PathParams } from '@/shared/constants'
import { showCustomToast } from '@/shared/lib/toaster'

import { recoverPassword } from '../api'
import type { RecoveryPasswordFormType } from '../ui/RecoveryPasswordForm'

export function useRecoveryPassword() {
	const navigate = useNavigate()
	const params = useParams<PathParams[typeof PUBLIC_ROUTES.RECOVERY_PASSWORD]>()
	const tokenValue = params.token!

	const { mutate: recoveryPassword, isPending } = useMutation({
		mutationKey: ['recovery password', tokenValue],
		mutationFn: (data: RecoveryPasswordFormType) => {
			return recoverPassword({
				password: data.password,
				token: tokenValue
			})
		},
		onSuccess: response => {
			showCustomToast({
				title: 'Успешно!',
				type: 'success',
				description: response.message
			})
			navigate(PUBLIC_ROUTES.LOGIN)
		},
		onError: (error: ErrorResponse) => {
			showCustomToast({
				title: 'Ошибка',
				type: 'error',
				description: error.message
			})
		}
	})

	return {
		recoveryPassword,
		isPending
	}
}
