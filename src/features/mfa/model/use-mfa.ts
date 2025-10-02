import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import type {
	MfaStatusResponse,
	TotpGenerateSecretResponse
} from '@/features/mfa/api'
import {
	disableTotp,
	enableTotp,
	generateTotpSecret,
	getMfaStatus,
	getRecoveryCodes,
	regenerateRecoveryCodes
} from '@/features/mfa/api'

import type { ErrorResponse } from '@/shared/api'
import { showCustomToast } from '@/shared/lib/toaster'

export const useMfa = () => {
	const queryClient = useQueryClient()
	const [secret, setSecret] = useState<string | null>(null)
	const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)

	// Получение текущего статуса MFA
	const {
		data: mfaStatus,
		isLoading: isLoadingStatus,
		refetch: refetchStatus
	} = useQuery<MfaStatusResponse>({
		queryKey: ['mfa', 'status'],
		queryFn: getMfaStatus
	})

	// Генерация TOTP секрета
	const { mutateAsync: generateSecretAsync, isPending: isGenerating } =
		useMutation({
			mutationFn: generateTotpSecret,
			onSuccess: (data: TotpGenerateSecretResponse) => {
				setSecret(data.secret)
				setQrCodeUrl(data.qrCodeUrl)
			},
			onError: () => {
				showCustomToast({
					title: 'Не удалось сгенерировать секрет TOTP',
					type: 'error'
				})
			}
		})

	// Включение TOTP
	const { mutateAsync: activateTotp, isPending: isActivating } = useMutation({
		mutationFn: ({ pin, secret }: { pin: string; secret: string }) => {
			if (!secret) {
				throw new Error('Сначала необходимо сгенерировать секрет TOTP')
			}
			return enableTotp({ secret, pin })
		},
		onSuccess: () => {
			setSecret(null)
			setQrCodeUrl(null)
			queryClient.invalidateQueries({ queryKey: ['mfa'] })
		},
		onError: (error: ErrorResponse) => {
			showCustomToast({
				title: error.message || 'Не удалось включить TOTP аутентификацию',
				type: 'error'
			})
		}
	})

	// Отключение TOTP
	const { mutateAsync: deactivateTotp, isPending: isDeactivating } =
		useMutation({
			mutationFn: (password: string) => disableTotp({ password }),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ['mfa'] })
				showCustomToast({
					description: 'Двухфакторная аутентификация успешно отключена',
					title: 'Успешно!',
					type: 'success'
				})
			},
			onError: (error: ErrorResponse) => {
				showCustomToast({
					description:
						error.message || 'Не удалось отключить TOTP аутентификацию',
					title: 'Ошибка!',
					type: 'error'
				})
			}
		})

	// Регенерация кодов восстановления
	const { mutate: regenerateCodes, isPending: isRegenerating } = useMutation({
		mutationFn: regenerateRecoveryCodes,
		onSuccess: () => {
			showCustomToast({
				description: 'Коды восстановления успешно обновлены',
				title: 'Успешно!',
				type: 'success'
			})
			queryClient.invalidateQueries({
				queryKey: ['mfa', 'recovery-codes']
			})
		},
		onError: (error: ErrorResponse) => {
			showCustomToast({
				description: error.message || 'Не удалось обновить коды восстановления',
				title: 'Ошибка!',
				type: 'error'
			})
		}
	})

	// Запросить генерацию нового секрета TOTP
	const handleGenerateSecret = async () => {
		try {
			const result = await generateSecretAsync()
			return result
		} catch (error) {
			showCustomToast({
				description: 'Ошибка при генерации секрета',
				title: 'Ошибка!',
				type: 'error'
			})
			throw error
		}
	}

	// Включить TOTP с проверочным кодом
	const handleActivateTotp = async (pin: string, secret: string) => {
		if (!secret) {
			showCustomToast({
				description: 'Сначала необходимо сгенерировать секрет TOTP',
				title: 'Ошибка!',
				type: 'error'
			})
			return
		}
		return activateTotp({ pin, secret })
	}

	// Отключить TOTP с паролем для подтверждения
	const handleDeactivateTotp = async (password: string) => {
		await deactivateTotp(password)
	}

	// Регенерировать коды восстановления
	const handleRegenerateCodes = () => {
		regenerateCodes()
	}

	// Обновить статус MFA
	const handleFetchMfaStatus = () => {
		return refetchStatus()
	}

	// Обновить коды восстановления
	const handleFetchRecoveryCodes = () => {
		return queryClient.fetchQuery<string[]>({
			queryKey: ['mfa', 'recovery-codes'],
			queryFn: getRecoveryCodes
		})
	}

	return {
		mfaStatus,
		secret,
		qrCodeUrl,
		isLoading: {
			status: isLoadingStatus,
			generating: isGenerating,
			activating: isActivating,
			deactivating: isDeactivating,
			regenerating: isRegenerating
		},
		actions: {
			generateSecret: handleGenerateSecret,
			activateTotp: handleActivateTotp,
			deactivateTotp: handleDeactivateTotp,
			regenerateCodes: handleRegenerateCodes,
			fetchMfaStatus: handleFetchMfaStatus,
			fetchRecoveryCodes: handleFetchRecoveryCodes
		}
	}
}
