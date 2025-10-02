// Путь к типам
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import type { AuthSuccessResponse } from '@/features/auth/api/types'

import type { ErrorResponse } from '@/shared/api'
import { showCustomToast } from '@/shared/lib'

type ApiFunction<TData, TResponse> = (data: TData) => Promise<TResponse>

interface UseAuthRequestOptions<TSuccess extends AuthSuccessResponse> {
	successMessage: string
	onSuccessNavigateTo?: string
	onSuccessCallback?: (response: TSuccess) => void
}

export function useAuthRequest<
	TData,
	TResponse extends AuthSuccessResponse | ErrorResponse
>() {
	const [isPending, setIsPending] = useState(false)
	const navigate = useNavigate()

	const execute = async (
		apiFunc: ApiFunction<TData, TResponse>,
		data: TData,
		options: UseAuthRequestOptions<AuthSuccessResponse>
	) => {
		setIsPending(true)
		try {
			const response = await apiFunc(data)

			if ('token' in response && response.token) {
				const successResponse = response as AuthSuccessResponse
				showCustomToast({
					title: options.successMessage,
					type: 'success'
				})

				if (options.onSuccessCallback) {
					options.onSuccessCallback(successResponse)
				}

				if (options.onSuccessNavigateTo) {
					navigate(options.onSuccessNavigateTo, { replace: true })
				}
			} else if ('message' in response) {
				const errorResponse = response as ErrorResponse
				showCustomToast({
					title: errorResponse.message,
					type: 'error'
				})
			} else {
				showCustomToast({
					description: 'Произошла неизвестная ошибка при обработке ответа.',
					title: 'Ошибка при обработке ответа.',
					type: 'error'
				})
			}
		} catch (error: unknown) {
			console.error('Request execution failed:', error)
			showCustomToast({
				description:
					'Не удалось связаться с сервером или произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.',
				title: 'Ошибка при обработке ответа.',
				type: 'error'
			})
		} finally {
			setIsPending(false)
		}
	}

	return {
		execute,
		isPending
	}
}
