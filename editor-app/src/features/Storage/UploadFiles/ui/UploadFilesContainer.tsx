import { useUploadFiles } from '../model/useUploadFiles'

import { UploadFilesModal } from './UploadFilesModal'

interface UploadFilesContainerProps {
	isOpen: boolean
	onClose: () => void
}

export const UploadFilesContainer = ({ isOpen, onClose }: UploadFilesContainerProps) => {
	const {
		loading,
		files,
		error,
		handleDropFiles,
		handleRemoveFile,
		handleUploadFiles,
		closeModal
	} = useUploadFiles()

	const handleClose = () => {
		closeModal()
		onClose()
	}

	const handleUpload = async () => {
		const success = await handleUploadFiles()
		if (success) {
			handleClose()
		}
		return success
	}

	return (
		<UploadFilesModal
			isOpen={isOpen}
			onClose={handleClose}
			loading={loading}
			files={files}
			error={error}
			onDropFiles={handleDropFiles}
			onRemoveFile={handleRemoveFile}
			onUpload={handleUpload}
		/>
	)
}
