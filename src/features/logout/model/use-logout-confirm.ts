import { useCallback } from 'react'

import { modals } from '@/shared/lib/modals'

import { useLogout } from './use-logout'

export function useLogoutConfirm(): { openLogoutConfirm: () => string } {
	const logout = useLogout()

	const openLogoutConfirm = useCallback((): string => {
		return modals.openConfirm({
			title: 'Вы собираетесь выйти из аккаунта',
			description: 'Вы уверены, что хотите выйти из аккаунта?',
			confirmLabel: 'Выйти',
			confirmTone: 'alert',
			closeButton: false,
			onConfirm: logout
		})
	}, [logout])

	return { openLogoutConfirm }
}
