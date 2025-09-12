import {
	File,
	FileArchive,
	FileAudio,
	FileCode,
	FileImage,
	FileSpreadsheet,
	FileText,
	FileVideo,
	PresentationIcon
} from 'lucide-react'
import React from 'react'

import { getMimeTypeIcon } from '../model/utils'

interface FileIconProps {
	mimeType: string
	size?: number
	className?: string
	color?: string
}

/**
 * Компонент для отображения иконки файла в зависимости от его MIME-типа
 */
export const FileTypeIcon: React.FC<FileIconProps> = ({
	mimeType,
	size = 24,
	className,
	color
}) => {
	const iconType = getMimeTypeIcon(mimeType)
	const props = { size, className, color }

	switch (iconType) {
		case 'image-icon':
			return <FileImage {...props} />
		case 'document-icon':
			return <FileText {...props} />
		case 'spreadsheet-icon':
			return <FileSpreadsheet {...props} />
		case 'presentation-icon':
			return <PresentationIcon {...props} />
		case 'archive-icon':
			return <FileArchive {...props} />
		case 'video-icon':
			return <FileVideo {...props} />
		case 'audio-icon':
			return <FileAudio {...props} />
		case 'text-icon':
			return <FileText {...props} />
		case 'code-icon':
			return <FileCode {...props} />
		default:
			return <File {...props} />
	}
}
