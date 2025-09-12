import { Switch } from '@consta/uikit/Switch'
import { Text } from '@consta/uikit/Text'
import React from 'react'

import { useFileUpload } from '@/shared/lib'
import { startFileSelectionHelper } from '@/shared/lib/startFileSelectionHelper'
import type { SelectedFileData } from '@/shared/types'
import { ImagePreviewWithActions, ImageUpload } from '@/shared/ui'

type Props = {
	hasBgImage: boolean
	bgImageUrl: string | null
	bgImageFile?: File | null
	onToggle: (checked: boolean) => void
	onChangeUrl: (url: string) => void
	onReset: () => void

	startFileSelection?: (callback: (file: SelectedFileData) => void) => void
}

export const BgImageControl: React.FC<Props> = ({
	hasBgImage,
	bgImageUrl,
	bgImageFile,
	onToggle,
	onChangeUrl,
	onReset,
	startFileSelection
}) => {
	const { upload, isLoading } = useFileUpload()
	const [showImageUpload, setShowImageUpload] = React.useState(false)

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return bytes + ' B'
		if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
		return (bytes / 1048576).toFixed(1) + ' MB'
	}

	const handleSwitch = (checked: boolean) => {
		onToggle(checked)
		if (checked) {
			if (!bgImageUrl && !bgImageFile) setShowImageUpload(true)
		} else {
			setShowImageUpload(false)
		}
	}

	const handleUpload = async (file: File) => {
		const uploaded = await upload(file)
		if (uploaded) {
			onChangeUrl(uploaded.url)
			setShowImageUpload(false)
		}
	}

	const handleSelectFromLibrary = () => {
		startFileSelectionHelper(startFileSelection, file => {
			onChangeUrl(file.url)
			setShowImageUpload(false)
		})
	}

	const handleReset = () => {
		onReset()
		setShowImageUpload(false)
	}

	const previewSrc =
		bgImageUrl || (bgImageFile instanceof File ? URL.createObjectURL(bgImageFile) : '')

	return (
		<div>
			<div className='flex items-center justify-between'>
				<Text size='s' view='primary' weight='light'>
					Фоновое изображение
				</Text>
				<Switch
					checked={hasBgImage}
					onChange={e => handleSwitch(e.target.checked)}
					size='m'
					view='primary'
				/>
			</div>

			{hasBgImage && (bgImageUrl || bgImageFile) && !showImageUpload ? (
				<div className='mt-3'>
					<ImagePreviewWithActions
						src={previewSrc}
						alt='Фоновое изображение'
						onReplace={() => setShowImageUpload(true)}
						onDelete={handleReset}
						fileDetails={
							bgImageFile ? { name: bgImageFile.name, size: bgImageFile.size } : undefined
						}
						formatFileSize={formatFileSize}
					/>
				</div>
			) : hasBgImage && showImageUpload ? (
				<div className='mt-3'>
					<ImageUpload
						onFileSelect={handleUpload}
						onLibrarySelect={handleSelectFromLibrary}
						isLoading={isLoading}
					/>
				</div>
			) : null}
		</div>
	)
}
