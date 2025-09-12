import { apiInstance, handleApiError } from '@/shared/api'

import type { FileUploadResponse } from '../model/types'

interface UploadFilePayload {
	file: File
	folderId?: string | null
}

export const uploadFileApi = async (payload: UploadFilePayload): Promise<FileUploadResponse> => {
	try {
		const formData = new FormData()
		formData.append('file', payload.file)
		if (payload.folderId) {
			formData.append('folderId', String(payload.folderId))
		}

		const { data } = await apiInstance.post<FileUploadResponse>(
			'v1/storage/files/upload',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
		)
		return data
	} catch (error) {
		throw handleApiError(error)
	}
}
