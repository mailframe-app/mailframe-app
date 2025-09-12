import { useStorageStore } from '../storage.store'

/**
 * Хук для управления выбранными элементами
 */
export const useStorageSelection = () => {
	const { selectedItems, selectFile, selectFolder, clearSelection } = useStorageStore()

	const hasSelection = selectedItems.files.length > 0 || selectedItems.folders.length > 0

	return {
		selectedItems,
		selectFile,
		selectFolder,
		clearSelection,
		hasSelection
	}
}
