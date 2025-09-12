import type { SelectedFileData } from '@/shared/types'

import { useStorageModalStore } from './storage-modal.store'

export const useStorageModalProvider = () => {
	const { openModal, closeModal, startFileSelection, isOpen, onFileSelectCallback } =
		useStorageModalStore()

	const openStorageModal = () => {
		openModal()
	}

	const selectFile = (callback: (file: SelectedFileData) => void) => {
		startFileSelection(callback)
	}

	return {
		openStorageModal,
		selectFile,
		isModalOpen: isOpen,
		closeModal,
		onFileSelectCallback
	}
}
