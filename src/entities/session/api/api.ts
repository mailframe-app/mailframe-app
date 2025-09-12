import { apiInstance, handleApiError } from '@/shared/api'

import type {
	LoginRequest,
	SessionControllerLogin,
	SessionResponse
} from './types'

export const Login = async (
	loginRequest: LoginRequest
): Promise<SessionControllerLogin> => {
	try {
		const { data } = await apiInstance.post<SessionControllerLogin>(
			'/v1/session/login',
			loginRequest
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

export const logout = async (): Promise<boolean> => {
	try {
		const { data } = await apiInstance.post<boolean>('/v1/session/logout')
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

export const getSessions = async (): Promise<SessionResponse[]> => {
	try {
		const { data } = await apiInstance.get<SessionResponse[]>(
			'/v1/session/active-sessions'
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

export const deleteSession = async (sessionId: string): Promise<boolean> => {
	try {
		const { data } = await apiInstance.delete<boolean>(
			`/v1/session/${sessionId}`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

export const removeAllSessions = async (): Promise<boolean> => {
	try {
		const { data } = await apiInstance.delete<boolean>(
			'/v1/session/active-sessions'
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
