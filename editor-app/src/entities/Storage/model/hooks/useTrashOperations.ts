import { useStorageStore } from '../storage.store'

/**
 * Хук для операций с корзиной
 */
export const useTrashOperations = () => {
	const { trashedFiles, restoreFile, permanentDeleteFile, emptyTrash } = useStorageStore()

	return {
		trashedFiles,
		restoreFile,
		permanentDeleteFile,
		emptyTrash
	}
}
