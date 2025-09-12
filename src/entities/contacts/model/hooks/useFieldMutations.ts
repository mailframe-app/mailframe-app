import { useMutation } from '@tanstack/react-query'

import { reorderFields, updateField } from '../../api/fields.api'
import type { ReorderFieldsDto, UpdateFieldDto } from '../../api/types'

export function useUpdateFieldMutation() {
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: UpdateFieldDto }) =>
			updateField(id, payload)
	})
}

export function useReorderFieldsMutation() {
	return useMutation({
		mutationFn: (payload: ReorderFieldsDto) => reorderFields(payload)
	})
}
