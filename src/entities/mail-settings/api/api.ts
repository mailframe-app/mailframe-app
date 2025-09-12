import { apiInstance, handleApiError } from '@/shared/api'

import type {
	DeleteSmtpResponse,
	SmtpSettingsDto,
	SmtpSettingsResponse,
	TestSmtpRequestDto,
	TestSmtpResponseDto
} from './types'

// GET /v1/settings/smtp
export const getSmtpSettings = async (): Promise<SmtpSettingsResponse[]> => {
	try {
		const { data } =
			await apiInstance.get<SmtpSettingsResponse[]>('/v1/settings/smtp')
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /v1/settings/smtp
export const createSmtpSettings = async (
	settings: SmtpSettingsDto
): Promise<SmtpSettingsResponse> => {
	try {
		const { data } = await apiInstance.post<SmtpSettingsResponse>(
			'/v1/settings/smtp',
			settings
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// PATCH /v1/settings/smtp/:id
export const updateSmtpSettings = async (
	id: string,
	settings: SmtpSettingsDto
): Promise<SmtpSettingsResponse> => {
	try {
		const { data } = await apiInstance.patch<SmtpSettingsResponse>(
			`/v1/settings/smtp/${id}`,
			settings
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// DELETE /v1/settings/smtp/:id
export const deleteSmtpSettings = async (
	id: string
): Promise<DeleteSmtpResponse> => {
	try {
		const { data } = await apiInstance.delete<DeleteSmtpResponse>(
			`/v1/settings/smtp/${id}`
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}

// POST /v1/settings/smtp/test
export const testSmtpSettings = async (
	testRequest: TestSmtpRequestDto
): Promise<TestSmtpResponseDto> => {
	try {
		const { data } = await apiInstance.post<TestSmtpResponseDto>(
			'/v1/settings/smtp/test',
			testRequest
		)
		return data
	} catch (e: unknown) {
		throw handleApiError(e)
	}
}
