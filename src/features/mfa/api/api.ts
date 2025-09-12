import { handleApiError } from '@/shared/api'
import { apiInstance } from '@/shared/api/api-instance'

import type {
	MfaStatusResponse,
	TotpDisableRequest,
	TotpEnableRequest,
	TotpGenerateSecretResponse
} from './types'

// Получение статуса MFA
export const getMfaStatus = async (): Promise<MfaStatusResponse> => {
	try {
		const { data } = await apiInstance.get<MfaStatusResponse>('/v1/auth/mfa')
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// Получение кодов восстановления
export const getRecoveryCodes = async (): Promise<string[]> => {
	try {
		const { data } = await apiInstance.get<string[]>('/v1/auth/mfa/recovery')
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// Перегенерация кодов восстановления
export const regenerateRecoveryCodes = async (): Promise<string[]> => {
	try {
		const { data } = await apiInstance.patch<string[]>('/v1/auth/mfa/recovery')
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// Генерация секрета TOTP
export const generateTotpSecret =
	async (): Promise<TotpGenerateSecretResponse> => {
		try {
			const { data } =
				await apiInstance.post<TotpGenerateSecretResponse>('/v1/auth/mfa/totp')
			return data
		} catch (e: unknown) {
			throw handleApiError(e)
		}
	}

// Включение TOTP аутентификации
export const enableTotp = async (
	request: TotpEnableRequest
): Promise<boolean> => {
	try {
		const { data } = await apiInstance.put<boolean>(
			'/v1/auth/mfa/totp',
			request
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// Отключение TOTP аутентификации
export const disableTotp = async (
	request: TotpDisableRequest
): Promise<boolean> => {
	try {
		const { data } = await apiInstance.delete<boolean>('/v1/auth/mfa/totp', {
			data: request
		})
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
