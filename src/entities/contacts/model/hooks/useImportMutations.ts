import { useMutation } from '@tanstack/react-query'

import {
	cancelImport,
	startImport,
	uploadImportFile
} from '../../api/import.api'

export function useUploadImportFileMutation() {
	return useMutation({
		mutationFn: (formData: FormData) => uploadImportFile(formData)
	})
}

export function useStartImportMutation() {
	return useMutation({
		mutationFn: ({ id, payload }: { id: string; payload: any }) =>
			startImport(id, payload)
	})
}

export function useCancelImportMutation() {
	return useMutation({
		mutationFn: (id: string) => cancelImport(id)
	})
}
