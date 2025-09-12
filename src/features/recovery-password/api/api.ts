import { apiInstance } from '@/shared/api/api-instance'
import { handleApiError } from '@/shared/api/handleApiError'

import type {
	PasswordRecoveryRequest,
	PasswordRecoveryResponse,
	SendPasswordRecoveryRequest
} from './types'

// Отправка запроса на восстановление пароля
export const sendPasswordRecovery = async (
	request: SendPasswordRecoveryRequest
) => {
	try {
		const { data } = await apiInstance.post<PasswordRecoveryResponse>(
			'/v1/auth/password-reset/request',
			request
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// Восстановление пароля
export const recoverPassword = async (request: PasswordRecoveryRequest) => {
	try {
		const { data } = await apiInstance.patch<PasswordRecoveryResponse>(
			`/v1/auth/password-reset/${request.token}`,
			{ password: request.password }
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
