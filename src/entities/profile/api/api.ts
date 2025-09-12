import { apiInstance } from '@/shared/api/api-instance'
import { handleApiError } from '@/shared/api/handleApiError'

import type {
	ChangePasswordRequest,
	ChangePasswordResponse,
	EmailVerificationResponse,
	ProfileResponse,
	UpdateOnboardingRequest,
	UpdateProfileRequest,
	UpdateResponse,
	UpdateThemeRequest,
	UploadAvatarResponse,
	VerifyEmailResponse
} from './types'

export const Profile = async (): Promise<ProfileResponse> => {
	try {
		const { data } = await apiInstance.get<ProfileResponse>('/v1/profile')
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

export const updateProfileInfo = async (
	updateProfileRequest: UpdateProfileRequest
): Promise<UpdateResponse> => {
	try {
		const { data } = await apiInstance.patch<UpdateResponse>(
			'/v1/profile',
			updateProfileRequest
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

export const updateProfileTheme = async (
	updateProfileThemeRequest: UpdateThemeRequest
): Promise<UpdateResponse> => {
	try {
		const { data } = await apiInstance.patch<UpdateResponse>(
			'/v1/profile/theme',
			updateProfileThemeRequest
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

export const updateProfileOnboarding = async (
	updateProfileOnboardingRequest: UpdateOnboardingRequest
): Promise<UpdateResponse> => {
	try {
		const { data } = await apiInstance.patch<UpdateResponse>(
			'/v1/profile/onboarding',
			updateProfileOnboardingRequest
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

export const sendEmailVerification =
	async (): Promise<EmailVerificationResponse> => {
		try {
			const { data } = await apiInstance.post<EmailVerificationResponse>(
				'/v1/account/verification/email/request'
			)
			return data
		} catch (e: unknown) {
			throw handleApiError(e)
		}
	}

export const verifyEmail = async (
	code: string
): Promise<VerifyEmailResponse> => {
	try {
		const { data } = await apiInstance.post<VerifyEmailResponse>(
			`/v1/account/verification/email/${code}`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

export const changePassword = async (
	changePasswordRequest: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
	try {
		const { data } = await apiInstance.patch<ChangePasswordResponse>(
			'/v1/account/password/change',
			changePasswordRequest
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

export const uploadAvatar = async (
	file: File
): Promise<UploadAvatarResponse> => {
	try {
		const formData = new FormData()
		formData.append('file', file)

		const { data } = await apiInstance.post<UploadAvatarResponse>(
			'/v1/profile/avatar',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
