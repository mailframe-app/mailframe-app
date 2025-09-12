import React from 'react'

import { SaveModuleModal } from '../ui/SaveModuleModal'

import { useSaveNodeStore } from './save-node.store'

const SaveNodeModalProvider = () => {
	const { isModalOpen, nodeIdToSave, closeModal } = useSaveNodeStore()
	return React.createElement(SaveModuleModal, {
		isOpen: isModalOpen,
		nodeId: nodeIdToSave,
		onClose: closeModal
	})
}

export const useSaveNodeFeature = () => {
	const { openModal } = useSaveNodeStore()

	const saveNode = (nodeId: string) => {
		openModal(nodeId)
	}

	return {
		saveNode,
		SaveNodeModalProvider
	}
}
