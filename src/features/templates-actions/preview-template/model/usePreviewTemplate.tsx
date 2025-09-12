import { useCallback } from 'react'

import { modals } from '@/shared/lib/modals'

import { TemplatePreview } from '../ui/TemplatePreview'

import type { TemplateListItem } from '@/entities/templates'

export function usePreviewTemplate() {
	const openPreview = useCallback((template: TemplateListItem) => {
		const modalId = modals.openContent({
			title: 'Предпросмотр шаблона',
			content: (
				<TemplatePreview
					template={template}
					onClose={() => modals.close(modalId)}
				/>
			),
			containerClassName: 'w-[60vw]',
			hasOverlay: true,
			closeButton: false
		})
	}, [])

	return { openPreview }
}
