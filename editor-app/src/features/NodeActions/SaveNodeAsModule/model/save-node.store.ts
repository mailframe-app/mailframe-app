import { create } from 'zustand'

interface SaveNodeState {
	isModalOpen: boolean
	nodeIdToSave: string | null
	openModal: (nodeId: string) => void
	closeModal: () => void
}

export const useSaveNodeStore = create<SaveNodeState>(set => ({
	isModalOpen: false,
	nodeIdToSave: null,
	openModal: nodeId => set({ isModalOpen: true, nodeIdToSave: nodeId }),
	closeModal: () => set({ isModalOpen: false, nodeIdToSave: null })
}))
