import { handleApiError } from '@/shared/api'
import { apiInstance } from '@/shared/api/api-instance'
import { setSessionToken } from '@/shared/lib/cookie'

import type {
	AuthSuccessResponse,
	LoginApiResponse,
	MfaRecoveryRequest,
	MfaTotpRequest
} from './types'

// Логин
export const getLogin = async (credentials: {
	email: string
	password: string
}): Promise<LoginApiResponse> => {
	try {
		const { data } = await apiInstance.post<LoginApiResponse>(
			'/v1/session/login',
			credentials
		)
		if ('token' in data && data.token) {
			setSessionToken(data.token)
		}
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// Верификация MFA с помощью TOTP кода
export const verifyMfaWithTotp = async (
	request: MfaTotpRequest
): Promise<AuthSuccessResponse> => {
	try {
		const { data } = await apiInstance.post<AuthSuccessResponse>(
			'/v1/auth/mfa/verify',
			request
		)
		if (data.token) {
			setSessionToken(data.token)
		}
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// Верификация MFA с помощью кода восстановления
export const verifyMfaWithRecovery = async (
	request: MfaRecoveryRequest
): Promise<AuthSuccessResponse> => {
	try {
		const { data } = await apiInstance.post<AuthSuccessResponse>(
			'/v1/auth/mfa/verify',
			request
		)
		if (data.token) {
			setSessionToken(data.token)
		}
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
