import { useEffect } from 'react'

import { useEditorTemplateStore } from '@/entities/EditorTemplate'

// Компонент для очистки ресурсов
export function CleanupHandler() {
	const { cleanup } = useEditorTemplateStore()

	useEffect(() => {
		return () => {
			if (cleanup) cleanup()
		}
	}, [cleanup])

	return null
}
