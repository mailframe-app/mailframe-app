import { Button } from '@consta/uikit/Button'
import { useMutation } from '@tanstack/react-query'

import { type ErrorResponse } from '@/shared/api'
import { showCustomToast } from '@/shared/lib'
import { modals } from '@/shared/lib/modals'

import { removeAllSessions } from '../api'
import { useInvalidateSessionsList } from '../model/queries'

export function RemoveAllProvider() {
	const { mutateAsync, isPending } = useMutation({
		mutationKey: ['remove all sessions'],
		mutationFn: () => removeAllSessions(),
		onSuccess() {
			modals.closeAll()
			showCustomToast({
				title: 'Успешно',
				description: 'Вы успешно вышли из всех устройств',
				type: 'success'
			})
		},
		onSettled: useInvalidateSessionsList(),
		onError(error: ErrorResponse) {
			showCustomToast({
				title: 'Ошибка при отключении',
				description: error.message ?? 'Ошибка при отключении',
				type: 'error'
			})
		}
	})

	const handleRemoveAll = () => {
		modals.openConfirm({
			title: 'Выйти из всех устройств?',
			closeButton: false,
			description:
				'Вы будете разлогинены на всех устройствах, кроме текущего. Вы уверены, что хотите продолжить?',
			confirmLabel: 'Выйти',
			onConfirm: async () => {
				await mutateAsync()
			},
			confirmTone: 'alert'
		})
	}

	return (
		<Button
			onClick={handleRemoveAll}
			loading={isPending}
			view='primary'
			className='!bg-[var(--color-bg-alert)]'
			size='s'
			label='Выйти на всех устройствах'
			title='Выйти на всех устройствах'
		/>
	)
}
