import { useMutation } from '@tanstack/react-query'

import type { ErrorResponse } from '@/shared/api'
import { showCustomToast } from '@/shared/lib/toaster'

import { type ExternalConnectResponse, getConnectUrl } from '../api'

export function useConnectExternalAccount() {
	return useMutation({
		mutationKey: ['connect external account'],
		mutationFn: (provider: 'google' | 'yandex') => getConnectUrl(provider),
		onSuccess(data) {
			window.location.href = (data as ExternalConnectResponse).url
		},
		onError(error: ErrorResponse) {
			showCustomToast({
				title: error.message ?? 'Ошибка при подключении',
				type: 'error'
			})
		}
	})
}
