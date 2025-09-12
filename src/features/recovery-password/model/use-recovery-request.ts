import { useMutation } from '@tanstack/react-query'

import type { ErrorResponse } from '@/shared/api/types'
import { showCustomToast } from '@/shared/lib/toaster'

import { sendPasswordRecovery } from '../api'

export function useRecoveryRequest() {
	const {
		mutate: recoveryRequest,
		isPending,
		isSuccess: success
	} = useMutation({
		mutationKey: ['recovery password request'],
		mutationFn: sendPasswordRecovery,
		onError: (error: ErrorResponse) => {
			showCustomToast({ title: error.message, type: 'error' })
		}
	})

	return {
		recoveryRequest,
		isPending,
		success
	}
}
