import { IconTrash } from '@consta/icons/IconTrash'
import { Button } from '@consta/uikit/Button'
import { useMutation } from '@tanstack/react-query'

import { type ErrorResponse } from '@/shared/api'
import { showCustomToast } from '@/shared/lib'
import { modals } from '@/shared/lib/modals'

import { deleteSession } from '../api'
import { useInvalidateSessionsList } from '../model/queries'

interface RevokeSessionProps {
	id: string
}

export function RemoveProvider({ id }: RevokeSessionProps) {
	const { mutateAsync, isPending } = useMutation({
		mutationKey: ['revoke session', id],
		mutationFn: () => deleteSession(id),
		onSuccess() {
			modals.closeAll()
			showCustomToast({
				title: 'Сессия успешно завершена',
				type: 'success'
			})
		},
		onSettled: useInvalidateSessionsList(),
		onError(error: ErrorResponse) {
			showCustomToast({
				title: error.message ?? 'Ошибка при удалении сессии',
				type: 'error'
			})
		}
	})

	const handleRemove = () => {
		modals.openConfirm({
			title: 'Завершить сеанс на другом устройстве?',
			closeButton: false,
			description:
				'Вы собираетесь выйти с одного из ваших устройств. Вы уверены, что хотите продолжить?',
			confirmLabel: 'Выйти',
			onConfirm: async () => {
				await mutateAsync()
			},
			confirmTone: 'alert'
		})
	}

	return (
		<Button
			view='ghost'
			onClick={handleRemove}
			loading={isPending}
			onlyIcon
			size='s'
			iconLeft={IconTrash}
			title='Завершить сеанс'
		/>
	)
}
