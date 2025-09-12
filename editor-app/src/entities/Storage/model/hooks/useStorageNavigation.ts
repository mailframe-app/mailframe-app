import { useCallback } from 'react'

import { useStorageStore } from '../storage.store'

/**
 * Хук для навигации по хранилищу и управления параметрами запроса
 */
export const useStorageNavigation = () => {
	const {
		currentFolderId,
		folderTree,
		items,
		queryParams,
		setCurrentFolder,
		navigateUp,
		setSearchQuery,
		setSortParams,
		setPage
	} = useStorageStore()

	// Текущий путь из метаданных
	const currentPath = items.meta.path

	// Проверка, находимся ли мы в корневой папке
	const isRootFolder = currentFolderId === null

	// Обертка для навигации в папку с использованием useCallback
	const navigateToFolder = useCallback(
		(folderId: string | null) => {
			setCurrentFolder(folderId)
		},
		[setCurrentFolder]
	)

	return {
		currentFolderId,
		folderTree,
		currentPath,
		isRootFolder,
		queryParams,
		navigateToFolder,
		navigateUp,
		setSearchQuery,
		setSortParams,
		setPage
	}
}
