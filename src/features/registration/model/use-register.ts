import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import type { ErrorResponse } from '@/shared/api/types'
import { PRIVATE_ROUTES } from '@/shared/constants'
import { showCustomToast } from '@/shared/lib/toaster'

import { Register } from '../api'
import type { RegisterFormType } from '../ui/RegisterForm'

export function useRegister() {
	const navigate = useNavigate()

	const { mutateAsync, isPending } = useMutation({
		mutationKey: ['registration'],
		mutationFn: (data: RegisterFormType) => Register(data),
		onSuccess() {
			navigate(PRIVATE_ROUTES.DASHBOARD)
			showCustomToast({
				description: 'Добро пожаловать в Mailframe.',
				title: 'Регистрация прошла успешно!',
				type: 'success'
			})
		},
		onError(error: ErrorResponse) {
			showCustomToast({
				description: error.message ?? 'Ошибка при регистрации',
				title: 'Ошибка',
				type: 'error'
			})
		}
	})

	return {
		register: mutateAsync,
		isRegisterPending: isPending
	}
}
