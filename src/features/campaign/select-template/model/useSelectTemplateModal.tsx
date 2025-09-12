import { modals } from '@/shared/lib'

import { SelectTemplateModal } from '../ui/SelectTemplateModal'

import { type TemplateListItem } from '@/entities/templates'

interface UseSelectTemplateModalOptions {
	campaignId: string
	onSuccess: (template: TemplateListItem) => void
}

export const useSelectTemplateModal = (
	options: UseSelectTemplateModalOptions
) => {
	return () => {
		modals.openContent({
			title: 'Выбор шаблона',
			containerClassName: 'w-[60vw] h-[75vh]',
			content: <SelectTemplateModal {...options} />
		})
	}
}
