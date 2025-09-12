import { useMutation } from '@tanstack/react-query'

import type { ErrorResponse } from '@/shared/api'
import { showCustomToast } from '@/shared/lib/toaster'

import { getAuthUrl } from '../api/api'
import type { ExternalConnectResponse } from '../api/types'

export function useOAuthLogin() {
	const { mutate, isPending } = useMutation({
		mutationKey: ['oauth login'],
		mutationFn: (provider: 'google' | 'yandex') => getAuthUrl(provider),
		onSuccess(data) {
			if ('url' in data) {
				window.location.href = (data as ExternalConnectResponse).url
			} else {
				showCustomToast({
					title:
						(data as ErrorResponse).message ??
						'Не удалось получить URL для авторизации от сервера или произошла неизвестная ошибка.',
					type: 'error'
				})
			}
		},
		onError(error: ErrorResponse) {
			showCustomToast({
				title:
					error.message ??
					'Ошибка при получении URL для авторизации от сервера.',
				type: 'error'
			})
		}
	})

	return {
		oauthLogin: mutate,
		isPending
	}
}
