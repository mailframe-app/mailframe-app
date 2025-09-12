import { useMutation } from '@tanstack/react-query'

import { type ErrorResponse } from '@/shared/api'
import { showCustomToast } from '@/shared/lib/toaster'

import { changePassword, sendEmailVerification } from '../api'
import type {
	ChangePasswordRequest,
	ChangePasswordResponse
} from '../api/types'

export const useSendEmailVerificationMutation = () => {
	return useMutation({
		mutationFn: () => sendEmailVerification(),
		onSuccess: () => {
			showCustomToast({
				title: 'Письмо для подтверждения отправлено на вашу почту',
				type: 'success'
			})
		},
		onError: (error: ErrorResponse) => {
			showCustomToast({
				title: error.message || 'Не удалось отправить письмо',
				type: 'error'
			})
		}
	})
}

export const useChangePasswordMutation = () => {
	return useMutation({
		mutationFn: (data: ChangePasswordRequest) => changePassword(data),
		onSuccess: (res: ChangePasswordResponse) => {
			showCustomToast({ title: res.message, type: 'success' })
		},
		onError: (error: ErrorResponse) => {
			showCustomToast({
				title: error.message || 'Ошибка при смене пароля',
				type: 'error'
			})
		}
	})
}
