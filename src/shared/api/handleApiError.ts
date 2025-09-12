import { AxiosError } from 'axios'

import type { ErrorResponse } from './types'

export function handleApiError(e: unknown): ErrorResponse {
	const error = e as AxiosError<ErrorResponse>

	if (
		error.isAxiosError &&
		error.response &&
		error.response.data &&
		typeof error.response.data === 'object' &&
		'message' in error.response.data
	) {
		return {
			...error.response.data
		}
	}

	const message =
		(error.isAxiosError
			? error.message
			: e instanceof Error
				? e.message
				: undefined) ||
		'Произошла неизвестная ошибка на клиенте или при соединении с сервером.'

	return {
		statusCode: (error.isAxiosError && error.response?.status) || 500,
		error:
			(error.isAxiosError && error.response?.statusText) ||
			'Internal Server Error',
		message: message
	}
}
