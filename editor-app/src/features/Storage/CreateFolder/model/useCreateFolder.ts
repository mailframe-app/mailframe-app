import { useState } from 'react'
import { toast } from 'sonner'

import { useStorageStore } from '@/entities/Storage'

export const useCreateFolder = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [loading, setLoading] = useState(false)
	const { createFolder, currentFolderId } = useStorageStore()

	const openModal = () => {
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
	}

	const handleCreateFolder = async (name: string) => {
		setLoading(true)
		try {
			const result = await createFolder(name, currentFolderId)

			if (result.success) {
				toast.success(`Папка "${name}" успешно создана`)
				closeModal()
				return true
			} else if (result.error) {
				toast.error(`${result.error}`)
				return false
			}

			return true
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Произошла ошибка при создании папки'
			toast.error(errorMessage)
			console.error('Ошибка при создании папки:', error)
			return false
		} finally {
			setLoading(false)
		}
	}

	return {
		isModalOpen,
		loading,
		openModal,
		closeModal,
		handleCreateFolder
	}
}
