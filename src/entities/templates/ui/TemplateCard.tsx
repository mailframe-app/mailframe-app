import { IconFavoriteFilled } from '@consta/icons/IconFavoriteFilled'
import { Card } from '@consta/uikit/Card'
import { Text } from '@consta/uikit/Text'

import type { TemplateListItem } from '@/entities/templates'

interface TemplateCardProps {
	template: TemplateListItem
}

function formatDateTime(dateString: string) {
	const date = new Date(dateString)
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const year = date.getFullYear()
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')

	return {
		date: `${day}.${month}.${year}`,
		time: `${hours}:${minutes}`
	}
}

export function TemplateCard({ template }: TemplateCardProps) {
	const { date, time } = formatDateTime(template.updatedAt)

	return (
		<Card
			shadow={false}
			border
			className='w-[256px] !rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg'
			style={{ backgroundColor: 'var(--color-bg-secondary)' }}
		>
			<div className='px-4 pt-4'>
				{template.previewUrl ? (
					<div
						className='h-64 w-full overflow-hidden rounded-t-md'
						style={{ backgroundColor: '#ffffff' }} // TODO: ПОДУМАТЬ НАД ЦВЕТОМ
					>
						<img
							src={`${template.previewUrl}?v=${Date.now()}`}
							alt={template.name}
							className='h-auto w-full'
						/>
					</div>
				) : (
					<div
						className='flex h-64 w-full items-center justify-center rounded-md'
						style={{ backgroundColor: 'var(--color-bg-secondary)' }}
					>
						<Text view='secondary' size='s'>
							Нет превью
						</Text>
					</div>
				)}
			</div>
			<div
				className='rounded-b-lg p-4'
				style={{ background: 'var(--color-bg-default)' }}
			>
				<div className='mb-2 flex items-center gap-2'>
					<Text view='primary' className='flex-1 truncate' size='s'>
						{template.name}
					</Text>
					{template.isFavorite && (
						<IconFavoriteFilled
							size='s'
							style={{ color: '#FF6B35', flexShrink: 0 }}
						/>
					)}
				</div>
				<div className='flex justify-between'>
					<Text view='secondary' size='s'>
						{date}
					</Text>
					<Text view='secondary' size='s'>
						{time}
					</Text>
				</div>
			</div>
		</Card>
	)
}
