import { TemplateCardWithMenu } from './TemplateCardWithMenu'
import type { TemplateListItem } from '@/entities/templates'

interface TemplateGridProps {
	templates: TemplateListItem[]
	tabId: 'library' | 'my-templates'
}

export function TemplateGrid({ templates, tabId }: TemplateGridProps) {
	return (
		<div className='flex flex-wrap gap-4'>
			{templates.map(template => (
				<div key={template.id} className='flex justify-center'>
					<TemplateCardWithMenu template={template} tabId={tabId} />
				</div>
			))}
		</div>
	)
}
