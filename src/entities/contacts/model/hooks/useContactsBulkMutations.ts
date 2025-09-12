import { useMutation } from '@tanstack/react-query'

import {
	bulkAddToGroups,
	bulkCreateContacts,
	bulkRemoveFromGroups,
	bulkRestore,
	bulkSoftDelete,
	bulkUpdateField
} from '../../api/bulk.api'
import type {
	BulkDeleteDto,
	BulkRestoreDto,
	BulkUpdateFieldDto,
	BulkUpdateGroupsDto
} from '../../api/types'
import type { BulkCreateContactsDto } from '../../api/types/bulk.types'
import {
	useInvalidateContacts,
	useInvalidateFields,
	useInvalidateGroups
} from '../queries'

export function useBulkAddToGroupsMutation() {
	const invalidateContacts = useInvalidateContacts()
	const invalidateGroups = useInvalidateGroups()
	return useMutation({
		mutationFn: (payload: BulkUpdateGroupsDto) => bulkAddToGroups(payload),
		onSuccess: () => {
			invalidateContacts()
			invalidateGroups()
		}
	})
}

export function useBulkRemoveFromGroupsMutation() {
	const invalidateContacts = useInvalidateContacts()
	const invalidateGroups = useInvalidateGroups()
	return useMutation({
		mutationFn: (payload: BulkUpdateGroupsDto) => bulkRemoveFromGroups(payload),
		onSuccess: () => {
			invalidateContacts()
			invalidateGroups()
		}
	})
}

export function useBulkUpdateFieldMutation() {
	const invalidateContacts = useInvalidateContacts()
	const invalidateFields = useInvalidateFields()
	return useMutation({
		mutationFn: (payload: BulkUpdateFieldDto) => bulkUpdateField(payload),
		onSuccess: () => {
			invalidateContacts()
			invalidateFields()
		}
	})
}

export function useBulkSoftDeleteContactsMutation() {
	const invalidateContacts = useInvalidateContacts()
	return useMutation({
		mutationFn: (payload: BulkDeleteDto) => bulkSoftDelete(payload),
		onSuccess: () => {
			invalidateContacts()
		}
	})
}

export function useBulkRestoreContactsMutation() {
	const invalidateContacts = useInvalidateContacts()
	return useMutation({
		mutationFn: (payload: BulkRestoreDto) => bulkRestore(payload),
		onSuccess: () => {
			invalidateContacts()
		}
	})
}

export function useBulkCreateContactsMutation() {
	const invalidateContacts = useInvalidateContacts()
	const invalidateFields = useInvalidateFields()
	return useMutation({
		mutationFn: (payload: BulkCreateContactsDto) => bulkCreateContacts(payload),
		onSuccess: () => {
			invalidateContacts()
			invalidateFields()
		}
	})
}
