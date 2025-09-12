import { IconDraggable } from '@consta/icons/IconDraggable'
import { IconTrash } from '@consta/icons/IconTrash'
import { Button } from '@consta/uikit/Button'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import * as React from 'react'

import type { SocialItem } from './MjmlSocialBlock.types'

type Props = {
	item: SocialItem
	active: boolean
	onSelect: () => void
	onRemove: () => void
}

export const SortableSocialItem: React.FC<Props> = ({ item, active, onSelect, onRemove }) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: item.id
	})

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.6 : 1
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`flex items-center gap-2 px-2 py-1 ${
				active ? 'border-[var(--accent)]' : 'border-gray-200'
			}`}
		>
			<button
				className='cursor-grab p-1'
				{...attributes}
				{...listeners}
				aria-label='Переместить'
				title='Переместить'
			>
				<IconDraggable size='s' />
			</button>

			<img
				src={item.src}
				alt={item.name}
				style={{ width: 20, height: 20, borderRadius: 3 }}
				draggable={false}
			/>

			<button
				className='flex-1 text-left text-sm'
				onClick={onSelect}
				title='Выбрать для редактирования'
			>
				{item.name || 'Без названия'}
			</button>

			<Button view='clear' size='s' iconLeft={IconTrash} onClick={onRemove} />
		</div>
	)
}
