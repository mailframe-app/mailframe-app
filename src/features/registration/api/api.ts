import { apiInstance } from '@/shared/api/api-instance'
import { handleApiError } from '@/shared/api/handleApiError'
import { setSessionToken } from '@/shared/lib/cookie'

import type { RegisterUserRequest, RegisterUserResponse } from './types'

// Регистрация пользователя
export const Register = async (request: RegisterUserRequest) => {
	try {
		const { data } = await apiInstance.post<RegisterUserResponse>(
			'/v1/auth/register',
			request
		)
		if ('token' in data && data.token) {
			setSessionToken(data.token)
		}
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
