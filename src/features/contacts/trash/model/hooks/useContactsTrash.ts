import { useMutation, useQuery } from '@tanstack/react-query'

import { showCustomToast } from '@/shared/lib/toaster'

import type { GetContactsQueryDto } from '@/entities/contacts'
import {
	trashedContactsQuery,
	useInvalidateContacts
} from '@/entities/contacts'
import {
	permanentDeleteTrashedContact,
	restoreTrashedContact
} from '@/entities/contacts/api/trash.api'

export function useContactsTrash(params: GetContactsQueryDto) {
	const invalidateContacts = useInvalidateContacts()

	const { data, isLoading, isError } = useQuery(trashedContactsQuery(params))

	const restoreMutation = useMutation({
		mutationFn: restoreTrashedContact,
		onSuccess: () => {
			showCustomToast({
				title: 'Успешно',
				description: 'Контакт восстановлен',
				type: 'success'
			})
			invalidateContacts()
		},
		onError: () => {
			showCustomToast({
				title: 'Ошибка',
				description: 'Не удалось восстановить контакт',
				type: 'error'
			})
		}
	})

	const deleteMutation = useMutation({
		mutationFn: permanentDeleteTrashedContact,
		onSuccess: () => {
			showCustomToast({
				title: 'Успешно',
				description: 'Контакт удален окончательно',
				type: 'success'
			})
			invalidateContacts()
		},
		onError: () => {
			showCustomToast({
				title: 'Ошибка',
				description: 'Не удалось удалить контакт',
				type: 'error'
			})
		}
	})

	return {
		data,
		isLoading,
		isError,
		restore: restoreMutation.mutateAsync,
		delete: deleteMutation.mutateAsync,
		isRestoring: restoreMutation.isPending,
		isDeleting: deleteMutation.isPending
	}
}
