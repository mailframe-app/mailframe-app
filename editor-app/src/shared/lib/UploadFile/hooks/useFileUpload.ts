import { useState } from 'react'

import { type ErrorResponse, handleApiError } from '@/shared/api'
import { showCustomToast } from '@/shared/lib'

import { uploadFileApi } from '../api/upload.api'
import type { FileUploadResponse } from '../model/types'

interface UseFileUploadResult {
	upload: (file: File) => Promise<FileUploadResponse | null>
	isLoading: boolean
	error: ErrorResponse | null
}

export const useFileUpload = (): UseFileUploadResult => {
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<ErrorResponse | null>(null)

	const upload = async (file: File): Promise<FileUploadResponse | null> => {
		setIsLoading(true)
		setError(null)

		try {
			const response = await uploadFileApi({ file })
			showCustomToast({ title: `Файл "${file.name}" успешно загружен.`, type: 'success' })
			return response
		} catch (e) {
			const errorResponse = handleApiError(e)
			setError(errorResponse)
			showCustomToast({ title: errorResponse.message, type: 'error' })
			return null
		} finally {
			setIsLoading(false)
		}
	}

	return { upload, isLoading, error }
}
