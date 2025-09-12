import { create } from 'zustand'

import type { SelectedFileData } from '@/shared/types'

interface StorageModalState {
	isOpen: boolean
	onFileSelectCallback: ((file: SelectedFileData) => void) | null
	openModal: () => void
	closeModal: () => void
	startFileSelection: (callback: (file: SelectedFileData) => void) => void
}

export const useStorageModalStore = create<StorageModalState>(set => ({
	isOpen: false,
	onFileSelectCallback: null,
	openModal: () => set({ isOpen: true }),
	closeModal: () => set({ isOpen: false, onFileSelectCallback: null }),
	startFileSelection: callback => set({ isOpen: true, onFileSelectCallback: callback })
}))
