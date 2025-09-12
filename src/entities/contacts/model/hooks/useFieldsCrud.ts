import { useMutation, useQuery } from '@tanstack/react-query'

import {
	createField,
	getDeletedFields,
	permanentDeleteField,
	restoreField,
	softDeleteField,
	updateField
} from '../../api/fields.api'
import type { CreateFieldDto, UpdateFieldDto } from '../../api/types'
import { useInvalidateFields } from '../queries'

export function useCreateField() {
	const invalidate = useInvalidateFields()
	return useMutation({
		mutationFn: (dto: CreateFieldDto) => createField(dto),
		onSuccess: () => invalidate()
	})
}

export function useUpdateField() {
	const invalidate = useInvalidateFields()
	return useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateFieldDto }) =>
			updateField(id, dto),
		onSuccess: () => invalidate()
	})
}

export function useSoftDeleteField() {
	const invalidate = useInvalidateFields()
	return useMutation({
		mutationFn: (id: string) => softDeleteField(id),
		onSuccess: () => invalidate()
	})
}

export function useRestoreField() {
	const invalidate = useInvalidateFields()
	return useMutation({
		mutationFn: (id: string) => restoreField(id),
		onSuccess: () => invalidate()
	})
}

export function usePermanentDeleteField() {
	const invalidate = useInvalidateFields()
	return useMutation({
		mutationFn: (id: string) => permanentDeleteField(id),
		onSuccess: () => invalidate()
	})
}

export function useDeletedFields() {
	return useQuery({
		queryKey: ['fields', 'deleted'],
		queryFn: getDeletedFields,
		staleTime: 60_000
	})
}
