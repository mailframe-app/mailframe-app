export interface SendPasswordRecoveryRequest {
	email: string
}

export interface PasswordRecoveryRequest {
	token: string
	password: string
}

export interface PasswordRecoveryResponse {
	message: string
	success: boolean
}
