import { NamedTemplateCardWithMenu } from './NamedTemplateCardWithMenu'
import { type TemplateListItem } from '@/entities/templates'

interface NamedTemplateGridProps {
	templates: TemplateListItem[]
	tabId: 'library' | 'my-templates'
}

export function NamedTemplateGrid({
	templates,
	tabId
}: NamedTemplateGridProps) {
	return (
		<div className='flex flex-wrap gap-4'>
			{templates.map(template => (
				<div key={template.id} className='flex justify-center'>
					<NamedTemplateCardWithMenu template={template} tabId={tabId} />
				</div>
			))}
		</div>
	)
}
