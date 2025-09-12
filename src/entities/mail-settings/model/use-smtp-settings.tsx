import { useQuery } from '@tanstack/react-query'

import type {
	SmtpSettingsDto,
	SmtpSettingsResponse,
	TestSmtpRequestDto
} from '../api'

import {
	smtpQuery,
	useCreateSmtpSettingsMutation,
	useDeleteSmtpSettingsMutation,
	useTestSmtpSettingsMutation,
	useUpdateSmtpSettingsMutation
} from './queries'

export const useSmtpSettings = () => {
	const { data: smtpSettings = [], isLoading, error } = useQuery(smtpQuery())

	const { mutateAsync: createSmtp, isPending: isCreating } =
		useCreateSmtpSettingsMutation()
	const { mutateAsync: updateSmtp, isPending: isUpdating } =
		useUpdateSmtpSettingsMutation()
	const { mutateAsync: deleteSmtp, isPending: isDeleting } =
		useDeleteSmtpSettingsMutation()
	const { mutateAsync: testSmtp, isPending: isTesting } =
		useTestSmtpSettingsMutation()

	const createSmtpSettings = async (
		settings: SmtpSettingsDto
	): Promise<SmtpSettingsResponse> => {
		return await createSmtp(settings)
	}

	const updateSmtpSettings = async (
		id: string,
		settings: SmtpSettingsDto
	): Promise<SmtpSettingsResponse> => {
		return await updateSmtp({ id, settings })
	}

	const deleteSmtpSettings = async (id: string): Promise<boolean> => {
		const result = await deleteSmtp(id)
		return result.success
	}

	const testSmtpSettings = async (testRequest: TestSmtpRequestDto) => {
		return await testSmtp(testRequest)
	}

	return {
		smtpSettings,
		isLoading,
		error,
		isCreating,
		isUpdating,
		isDeleting,
		isTesting,
		createSmtpSettings,
		updateSmtpSettings,
		deleteSmtpSettings,
		testSmtpSettings
	}
}
