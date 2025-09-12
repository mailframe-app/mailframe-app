import { useState } from 'react'

import { showCustomToast } from '@/shared/lib'

import { useStorageStore } from '@/entities/Storage'

export const useUploadFiles = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const [files, setFiles] = useState<File[]>([])
	const [error, setError] = useState<string | null>(null)
	const { uploadFile, currentFolderId, fetchStorageStats, fetchStorageItems } = useStorageStore()

	// Максимальный размер файла в байтах (20 МБ)
	const MAX_FILE_SIZE = 20 * 1024 * 1024

	const openModal = () => {
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
		setFiles([])
		setError(null)
	}

	// Проверка размера файлов
	const checkFileSizes = (filesToCheck: File[]) => {
		const oversizedFiles = filesToCheck.filter(file => file.size > MAX_FILE_SIZE)

		if (oversizedFiles.length > 0) {
			setError(
				`Следующие файлы превышают максимальный размер 20 МБ: ${oversizedFiles.map(f => f.name).join(', ')}`
			)
			return oversizedFiles
		}

		return []
	}

	const handleDropFiles = (droppedFiles: File[]) => {
		const oversizedFiles = checkFileSizes(droppedFiles)

		if (oversizedFiles.length > 0) {
			// Добавляем только файлы с допустимым размером
			const validFiles = droppedFiles.filter(file => file.size <= MAX_FILE_SIZE)
			setFiles(prevFiles => [...prevFiles, ...validFiles])
			return
		}

		setFiles(prevFiles => [...prevFiles, ...droppedFiles])
		setError(null)
	}

	const handleRemoveFile = (index: number) => {
		setFiles(prevFiles => prevFiles.filter((_, i) => i !== index))
	}

	const handleUploadFiles = async () => {
		if (files.length === 0) {
			setError('Добавьте файлы для загрузки')
			return false
		}

		const oversizedFiles = checkFileSizes(files)
		if (oversizedFiles.length > 0) {
			return false
		}

		setError(null)
		setLoading(true)

		try {
			const successfulUploads: string[] = []
			const failedUploads: string[] = []

			for (const file of files) {
				const result = await uploadFile(file, currentFolderId)
				if (!result.success && result.error) {
					failedUploads.push(`${file.name}: ${result.error}`)
				} else {
					successfulUploads.push(file.name)
				}
			}

			// Показываем результаты загрузки
			if (successfulUploads.length > 0) {
				if (successfulUploads.length === 1) {
					showCustomToast({
						title: `Файл ${successfulUploads[0]} успешно загружен`,
						type: 'success'
					})
				} else {
					showCustomToast({
						title: `Загружено ${successfulUploads.length} файлов`,
						type: 'success'
					})
				}
			}

			if (failedUploads.length > 0) {
				failedUploads.forEach(error => {
					showCustomToast({ description: `${error}`, type: 'error', title: 'Ошибка' })
				})
				setFiles([])
				return false
			}
			fetchStorageStats()
			fetchStorageItems()

			return true
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Произошла ошибка при загрузке файлов'
			showCustomToast({ description: errorMessage, type: 'error', title: 'Ошибка' })
			setFiles([])
			return false
		} finally {
			setLoading(false)
		}
	}

	return {
		isModalOpen,
		loading,
		files,
		error,
		openModal,
		closeModal,
		handleDropFiles,
		handleRemoveFile,
		handleUploadFiles,
		MAX_FILE_SIZE
	}
}
