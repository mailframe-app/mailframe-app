import type { ErrorResponse } from '@/shared/api'

// Ответ на успешный вход в систему
export type AuthSuccessResponse = {
	id: string
	token: string
	userId: string
}

// Ответ на MFA запрос
export interface MfaResponse {
	ticket: string
	allowedMethods: string[]
	userId: string
}

// Запрос на верификацию с TOTP
export interface MfaTotpRequest {
	ticket: string
	totpCode: string
}

// Запрос на верификацию с кодом восстановления
export interface MfaRecoveryRequest {
	ticket: string
	recoveryCode: string
}

// Ответ на попытку входа в систему
export type LoginApiResponse = AuthSuccessResponse | MfaResponse | ErrorResponse

// Ответ на получение URL для внешней авторизации
export interface ExternalConnectResponse {
	url: string
}
