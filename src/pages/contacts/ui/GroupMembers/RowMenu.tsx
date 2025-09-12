import { IconCopy } from '@consta/icons/IconCopy'
import { IconEdit } from '@consta/icons/IconEdit'
import { IconTrash } from '@consta/icons/IconTrash'
import { IconUpload } from '@consta/icons/IconUpload'
import React from 'react'

import {
	ContextMenu as WidgetContextMenu,
	buildItems
} from '@/widgets/contextMenu'

export type RowMenuProps<Row> = {
	anchorRef: React.RefObject<HTMLElement>
	row: Row
	onEdit: (row: Row) => void
	onCopy: (row: Row) => void
	onMove: (row: Row) => void
	onTrash: (row: Row) => void
	onClose: () => void
}

export function RowMenu<Row>({
	anchorRef,
	row,
	onEdit,
	onCopy,
	onMove,
	onTrash,
	onClose
}: RowMenuProps<Row>) {
	return (
		<WidgetContextMenu
			isOpen
			anchorRef={anchorRef as any}
			items={buildItems<Row>(row, [
				{
					key: 'edit',
					label: 'Редактировать',
					leftIcon: IconEdit,
					onClick: r => onEdit(r)
				},
				{
					key: 'copy',
					label: 'Копировать в группу',
					leftIcon: IconCopy,
					onClick: r => onCopy(r)
				},
				{
					key: 'move',
					label: 'Переместить в группу',
					leftIcon: IconUpload,
					onClick: r => onMove(r)
				},
				{
					key: 'trash',
					label: 'Исключить из группы',
					leftIcon: IconTrash,
					status: 'alert',
					onClick: r => onTrash(r)
				}
			])}
			onClickOutside={onClose}
			row={row}
		/>
	)
}
