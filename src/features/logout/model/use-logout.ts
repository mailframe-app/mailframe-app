import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import { queryClient } from '@/shared/api'
import { PUBLIC_ROUTES } from '@/shared/constants'
import { removeSessionToken } from '@/shared/lib/cookie'

import { logout as logoutApi } from '@/entities/session'

export const useLogout = () => {
	const navigate = useNavigate()

	const logoutMutation = useMutation({
		mutationFn: logoutApi,
		onSuccess: () => {
			removeSessionToken()
			queryClient.clear()
			navigate(PUBLIC_ROUTES.LOGIN, { replace: true })
		}
	})

	return () => {
		return logoutMutation.mutate()
	}
}
