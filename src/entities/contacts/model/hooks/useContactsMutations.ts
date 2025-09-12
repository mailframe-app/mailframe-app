import { useMutation } from '@tanstack/react-query'

import { createContact, deleteContact, updateContact } from '../../api/base.api'
import type { CreateContactDto, UpdateContactDto } from '../../api/types'
import { useInvalidateContacts } from '../queries'

export function useCreateContactMutation() {
	const invalidateContacts = useInvalidateContacts()
	return useMutation({
		mutationFn: (payload: CreateContactDto) => createContact(payload),
		onSuccess: () => invalidateContacts()
	})
}

export function useUpdateContactMutation() {
	const invalidateContacts = useInvalidateContacts()
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateContactDto }) =>
			updateContact(id, payload),
		onSuccess: () => invalidateContacts()
	})
}

export function useDeleteContactMutation() {
	const invalidateContacts = useInvalidateContacts()
	return useMutation({
		mutationFn: (id: string) => deleteContact(id),
		onSuccess: () => invalidateContacts()
	})
}
