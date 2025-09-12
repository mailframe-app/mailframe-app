import { useEffect } from 'react'

import { useEditorTemplateStore } from '@/entities/EditorTemplate'

// Компонент для обработки beforeunload
export function BeforeUnloadHandler() {
	const { hasUnsavedChanges } = useEditorTemplateStore()

	useEffect(() => {
		const handleBeforeUnload = (e: BeforeUnloadEvent) => {
			if (hasUnsavedChanges) {
				e.preventDefault()
			}
		}
		window.addEventListener('beforeunload', handleBeforeUnload)
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload)
		}
	}, [hasUnsavedChanges])

	return null
}
