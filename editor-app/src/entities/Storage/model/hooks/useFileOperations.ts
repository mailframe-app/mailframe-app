import { useStorageStore } from '../storage.store'

/**
 * Хук для операций с файлами
 */
export const useFileOperations = () => {
	const {
		uploadFile,
		renameFile,
		moveFile,
		deleteFile,
		toggleFavorite,
		deleteSelectedItems,
		moveSelectedItems,
		toggleFavoriteForSelectedFiles
	} = useStorageStore()

	return {
		uploadFile,
		renameFile,
		moveFile,
		deleteFile,
		toggleFavorite,
		deleteSelectedItems,
		moveSelectedItems,
		toggleFavoriteForSelectedFiles
	}
}
