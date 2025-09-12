import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'

import type { TemplateListItem } from '@/entities/templates'

interface NamedTemplateCardProps {
	template: TemplateListItem
	onClick?: (template: TemplateListItem) => void
}

export function NamedTemplateCard({
	template,
	onClick
}: NamedTemplateCardProps) {
	const handleClick = () => {
		if (onClick) {
			onClick(template)
		}
	}

	return (
		<Card
			shadow={false}
			border
			className='w-[256px] cursor-pointer !rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg'
			style={{ backgroundColor: 'var(--color-bg-secondary)' }}
			onClick={handleClick}
		>
			<div className='px-4 pt-4'>
				{template.previewUrl ? (
					<div
						className='h-64 w-[full] overflow-hidden rounded-t-md'
						style={{ backgroundColor: '#ffffff' }}
					>
						<img
							src={`${template.previewUrl}`}
							alt={template.name}
							className='h-auto w-full'
						/>
					</div>
				) : (
					<div
						className='flex h-64 w-full items-center justify-center rounded-md'
						style={{ backgroundColor: 'var(--color-bg-secondary)' }}
					>
						<Text view='secondary' size='m'>
							Нет превью
						</Text>
					</div>
				)}
			</div>
			<div
				className='rounded-b-lg p-4 text-center'
				style={{ background: 'var(--color-bg-default)' }}
			>
				<Text view='primary' className='block truncate' size='m'>
					{template.name}
				</Text>
			</div>
		</Card>
	)
}
