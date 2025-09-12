import { apiInstance } from '@/shared/api/api-instance'
import { handleApiError } from '@/shared/api/handleApiError'

import type { ExternalConnectResponse, ExternalStatusResponse } from './types'

// Получение URL для внешней авторизации
export const getAuthUrl = async (provider: 'google' | 'yandex') => {
	try {
		const { data } = await apiInstance.post<ExternalConnectResponse>(
			`/v1/auth/external/login/${provider}`
		)
		return data
	} catch (e: unknown) {
		return handleApiError(e)
	}
}

// Получение статуса внешней авторизации
export const fetchExternalStatus = async () => {
	try {
		const { data } =
			await apiInstance.get<ExternalStatusResponse>('/v1/auth/external')
		return data
	} catch (e: unknown) {
		return handleApiError(e)
	}
}

// Получение URL для подключения внешнего аккаунта
export const getConnectUrl = async (provider: 'google' | 'yandex') => {
	try {
		const { data } = await apiInstance.post<ExternalConnectResponse>(
			`/v1/auth/external/connect/${provider}`
		)
		return data
	} catch (e: unknown) {
		return handleApiError(e)
	}
}

// Отключение внешнего аккаунта
export const unlinkAccount = async (provider: 'google' | 'yandex') => {
	try {
		const { data } = await apiInstance.delete(`/v1/auth/external/${provider}`)
		return data
	} catch (e: unknown) {
		return handleApiError(e)
	}
}
