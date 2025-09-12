// Ответ о статусе MFA
export interface MfaStatusResponse {
	totpMfa: boolean
	recoveryActive: boolean
}

// Ответ при генерации TOTP секрета
export interface TotpGenerateSecretResponse {
	secret: string
	qrCodeUrl: string
}

// Запрос на включение TOTP
export interface TotpEnableRequest {
	secret: string
	pin: string
}

// Запрос на отключение TOTP
export interface TotpDisableRequest {
	password: string
}
