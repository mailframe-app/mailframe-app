export interface LoginRequest {
	email: string
	password: string
}

export interface LoginSessionResponse {
	id: string
	token: string
	userId: string
}

export interface LoginMfaResponse {
	ticket: string
	allowedMethods: string[]
	userId: string
}

export type SessionControllerLogin = LoginSessionResponse | LoginMfaResponse

export interface SessionResponse {
	id: string
	createdAt: string
	country: string
	city: string
	browser: string
	os: string
}
