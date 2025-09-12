import { useMutation, useQueryClient } from '@tanstack/react-query'

import type { ErrorResponse } from '@/shared/api'
import { showCustomToast } from '@/shared/lib/toaster'

import { unlinkAccount } from '../api'

interface UseUnlinkExternalProps {
	provider: 'google' | 'yandex'
}

export function useUnlinkExternal({ provider }: UseUnlinkExternalProps) {
	const queryClient = useQueryClient()

	const { mutate, isPending } = useMutation({
		mutationKey: ['unlink account', provider],
		mutationFn: () => unlinkAccount(provider),
		onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['fetch external status']
			})
			showCustomToast({
				description: `Аккаунт ${provider.charAt(0).toUpperCase() + provider.slice(1)} успешно отключен`,
				title: 'Внешний аккаунт отключен',
				type: 'success'
			})
		},
		onError(error: ErrorResponse) {
			showCustomToast({
				title: error.message ?? 'Ошибка при отключении внешнего аккаунта',
				type: 'error'
			})
		}
	})

	return {
		mutate,
		isPending
	}
}
