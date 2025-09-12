export type ProfileResponse = {
	id: string
	displayName: string
	email: string
	avatar: string | null
	role: 'REGULAR' | 'ADMIN'
	city: string
	organization: string
	birthDate: string
	timezone: string
	theme: string
	isOnboardingCompleted: boolean
	isEmailVerified: boolean
}

export interface UpdateProfileRequest {
	displayName?: string
	avatar?: string
	email?: string
	city?: string
	organization?: string
	birthDate?: string
	timezone?: string
}

export interface UpdateThemeRequest {
	theme: 'presetGpnDefault' | 'presetGpnDark' | 'presetGpnDisplay'
}

export interface UpdateOnboardingRequest {
	isCompleted: boolean
}

export interface UpdateResponse {
	status: 'success'
	message: string
}

export interface EmailVerificationResponse {
	status: 'success'
	message: string
}

export interface VerifyEmailResponse {
	status: 'success'
	message: string
}

export interface ChangePasswordRequest {
	currentPassword: string
	newPassword: string
}

export interface ChangePasswordResponse {
	status: 'success'
	message: string
}

export interface UploadAvatarResponse {
	status: 'success'
	message: string
	avatar?: string
}
