import { useStorageStore } from '../storage.store'

/**
 * Хук для операций с папками
 */
export const useFolderOperations = () => {
	const { createFolder, renameFolder, moveFolder, deleteFolder } = useStorageStore()

	return {
		createFolder,
		renameFolder,
		moveFolder,
		deleteFolder
	}
}
