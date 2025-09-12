import type { UseQueryOptions } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { showCustomToast } from '@/shared/lib/toaster'

import type {
	DeleteSmtpResponse,
	SmtpSettingsDto,
	TestSmtpRequestDto,
	TestSmtpResponseDto
} from '../api'
import {
	createSmtpSettings,
	deleteSmtpSettings,
	getSmtpSettings,
	testSmtpSettings,
	updateSmtpSettings
} from '../api'

const smtpQueryKey = 'smtp'

export const smtpQuery = () =>
	({
		queryKey: [smtpQueryKey, 'list'],
		queryFn: () => getSmtpSettings()
	}) satisfies UseQueryOptions

export const useInvalidateSmtpSettings = () => {
	const queryClient = useQueryClient()

	return () => {
		queryClient.invalidateQueries({
			queryKey: [smtpQueryKey, 'list']
		})
	}
}

export const useCreateSmtpSettingsMutation = () => {
	return useMutation({
		mutationFn: (settings: SmtpSettingsDto) => createSmtpSettings(settings),
		onSuccess: useInvalidateSmtpSettings()
	})
}

export const useUpdateSmtpSettingsMutation = () => {
	return useMutation({
		mutationFn: ({ id, settings }: { id: string; settings: SmtpSettingsDto }) =>
			updateSmtpSettings(id, settings),
		onSuccess: useInvalidateSmtpSettings()
	})
}

export const useDeleteSmtpSettingsMutation = () => {
	const invalidateSettings = useInvalidateSmtpSettings()

	return useMutation({
		mutationFn: (id: string) => deleteSmtpSettings(id),
		onSuccess: (response: DeleteSmtpResponse) => {
			if (response.success) {
				showCustomToast({
					title: 'Почтовый клиент успешно удален',
					type: 'success'
				})
			} else {
				showCustomToast({
					title: 'Ошибка при удалении почтового клиента',
					type: 'error'
				})
			}
			invalidateSettings()
		}
	})
}

export const useTestSmtpSettingsMutation = () => {
	const invalidateSettings = useInvalidateSmtpSettings()

	return useMutation({
		mutationFn: (testRequest: TestSmtpRequestDto) =>
			testSmtpSettings(testRequest),
		onSuccess: (response: TestSmtpResponseDto) => {
			if (response.success) {
				showCustomToast({
					title: 'Тест SMTP-сервера прошел успешно',
					type: 'success'
				})
			} else {
				showCustomToast({ title: response.message, type: 'error' })
			}
			invalidateSettings()
		},
		onError: (error: any) => {
			showCustomToast({
				title: error?.message || 'Ошибка при тестировании SMTP-сервера',
				type: 'error'
			})
		}
	})
}
