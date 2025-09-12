import { useEffect, useState } from 'react'

import { useEditorTemplateStore } from '@/entities/EditorTemplate'

export const useEditableTitle = () => {
	const { template, updateName } = useEditorTemplateStore()
	const templateName = template?.name || ''

	const [isEditing, setIsEditing] = useState(false)
	const [localName, setLocalName] = useState(templateName)

	useEffect(() => {
		setLocalName(templateName)
	}, [templateName])

	const handleNameSubmit = () => {
		if (localName.trim() && localName.trim() !== templateName) {
			updateName(localName.trim())
		}
		setIsEditing(false)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleNameSubmit()
		}
		if (e.key === 'Escape') {
			setLocalName(templateName)
			setIsEditing(false)
		}
	}

	const startEditing = () => {
		setIsEditing(true)
	}

	return {
		isEditing,
		localName,
		templateName,
		setLocalName,
		handleNameSubmit,
		handleKeyDown,
		startEditing
	}
}
