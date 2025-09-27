import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { PRIVATE_ROUTES } from '@/shared/constants'
import { setSessionToken } from '@/shared/lib/cookie'
import { showCustomToast } from '@/shared/lib/toaster'

import type {
	AuthSuccessResponse,
	LoginApiResponse,
	MfaRecoveryRequest,
	MfaResponse,
	MfaTotpRequest
} from '../api'
import { getLogin, verifyMfaWithRecovery, verifyMfaWithTotp } from '../api'
import type { LoginFormType } from '../ui/LoginForm'

export function useLoginMutations({
	setTicket,
	setMethods,
	setUserId,
	navigate
}: {
	setTicket: (t: string | null) => void
	setMethods: (m: string[]) => void
	setUserId: (u: string | null) => void
	navigate: ReturnType<typeof useNavigate>
}) {
	const { mutateAsync: loginMutate, isPending: isLoginPending } = useMutation({
		mutationFn: (credentials: LoginFormType) => getLogin(credentials),
		onSuccess: (data: LoginApiResponse) => {
			if ('ticket' in data && data.allowedMethods) {
				const mfaData = data as MfaResponse
				setTicket(mfaData.ticket)
				setMethods(mfaData.allowedMethods.map(m => m.toLowerCase()))
				setUserId(mfaData.userId)
				return
			}

			if ('token' in data && data.token) {
				const authData = data as AuthSuccessResponse
				setSessionToken(authData.token)

				showCustomToast({
					title: 'Успешно!',
					description: 'Вы вошли в систему.',
					type: 'success'
				})
				navigate(PRIVATE_ROUTES.DASHBOARD, { replace: true })
			}
		},
		onError: (error: any) => {
			const errorMessage = error.message || 'Ошибка при входе'
			showCustomToast({
				description: errorMessage,
				title: 'Ошибка при входе',
				type: 'error'
			})
		}
	})

	const { mutateAsync: verifyTotpMutate, isPending: isVerifyingTotp } =
		useMutation({
			mutationFn: (request: MfaTotpRequest) => verifyMfaWithTotp(request),
			onSuccess: (data: AuthSuccessResponse) => {
				setSessionToken(data.token)

				showCustomToast({
					title: 'Успешно!',
					description: 'Вы вошли в систему.',
					type: 'success'
				})
				navigate(PRIVATE_ROUTES.DASHBOARD, { replace: true })
			},
			onError: (error: any) => {
				const errorMessage = error.message || 'Неверный TOTP код'
				showCustomToast({
					description: errorMessage,
					title: 'Ошибка при входе',
					type: 'error'
				})
			}
		})

	const { mutateAsync: verifyRecoveryMutate, isPending: isVerifyingRecovery } =
		useMutation({
			mutationFn: (request: MfaRecoveryRequest) =>
				verifyMfaWithRecovery(request),
			onSuccess: (data: AuthSuccessResponse) => {
				setSessionToken(data.token)

				showCustomToast({
					title: 'Успешно!',
					description: 'Вы вошли в систему.',
					type: 'success'
				})
				navigate(PRIVATE_ROUTES.DASHBOARD, { replace: true })
			},
			onError: (error: any) => {
				const errorMessage = error.message || 'Неверный код восстановления'
				showCustomToast({
					description: errorMessage,
					title: 'Ошибка при входе',
					type: 'error'
				})
			}
		})

	return {
		loginMutate,
		isLoginPending,
		verifyTotpMutate,
		isVerifyingTotp,
		verifyRecoveryMutate,
		isVerifyingRecovery
	}
}
