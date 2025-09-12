export interface SmtpSettingsDto {
	smtpHost: string
	smtpPort: number
	smtpSecure: boolean
	smtpUser: string
	smtpPassword?: string
	smtpFromEmail: string
	smtpFromName: string
	isDefault?: boolean
}

export interface SmtpSettingsResponse {
	id: string
	smtpHost: string
	smtpPort: number
	smtpSecure: boolean
	smtpUser: string
	smtpFromEmail: string
	smtpFromName: string
	isDefault: boolean
	createdAt: string
	updatedAt: string
	lastError: string
	isValid: boolean
}

export interface TestSmtpRequestDto {
	settingsId?: string
	testSettings?: SmtpSettingsDto
}

export interface TestSmtpResponseDto {
	success: boolean
	message: string

	details?: string
}

export interface DeleteSmtpResponse {
	success: boolean
}
