import type { SelectedFileData } from '@/shared/types'

export function startFileSelectionHelper(
	startFileSelection: ((callback: (file: SelectedFileData) => void) => void) | undefined,
	onFileSelected: (file: SelectedFileData) => void
) {
	if (!startFileSelection) {
		console.warn('startFileSelection не передан: галерея не откроется')
		return
	}

	startFileSelection((file: SelectedFileData) => {
		onFileSelected(file)
	})
}
