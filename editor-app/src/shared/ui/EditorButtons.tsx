import { IconList } from '@consta/icons/IconList'
import { IconListNumbered } from '@consta/icons/IconListNumbered'
import { IconTable } from '@consta/icons/IconTable'
import { IconTrash } from '@consta/icons/IconTrash'
import { Button } from '@consta/uikit/Button'
import { EditorContext } from '@tiptap/react'
import React from 'react'

import { ToolbarGroup } from '@/shared/ui/tiptap/primitive/toolbar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tiptap/primitive/tooltip'

const TooltipButton = ({ tooltip, children }: { tooltip: string; children: React.ReactNode }) => (
	<Tooltip delay={200}>
		<TooltipTrigger asChild>{children}</TooltipTrigger>
		<TooltipContent>{tooltip}</TooltipContent>
	</Tooltip>
)

export const BulletListButton = () => {
	const { editor } = React.useContext(EditorContext)
	if (!editor) return null
	return (
		<TooltipButton tooltip='Bulleted list'>
			<Button
				onlyIcon
				size='s'
				view={editor.isActive('bulletList') ? 'primary' : 'ghost'}
				iconLeft={IconList}
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				className='tiptap-toolbar-btn'
			/>
		</TooltipButton>
	)
}

export const OrderedListButton = () => {
	const { editor } = React.useContext(EditorContext)
	if (!editor) return null
	return (
		<TooltipButton tooltip='Numbered list'>
			<Button
				onlyIcon
				size='s'
				view={editor.isActive('orderedList') ? 'primary' : 'ghost'}
				iconLeft={IconListNumbered}
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				className='tiptap-toolbar-btn'
			/>
		</TooltipButton>
	)
}

export const TableInsertButton = () => {
	const { editor } = React.useContext(EditorContext)
	if (!editor) return null
	return (
		<TooltipButton tooltip='Insert table'>
			<Button
				onlyIcon
				size='s'
				view='ghost'
				iconLeft={IconTable}
				onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}
				className='tiptap-toolbar-btn'
			/>
		</TooltipButton>
	)
}

export const TableDeleteButton = () => {
	const { editor } = React.useContext(EditorContext)
	if (!editor) return null
	return (
		<TooltipButton tooltip='Delete table'>
			<Button
				onlyIcon
				size='s'
				view='ghost'
				iconLeft={IconTrash}
				onClick={() => editor.chain().focus().deleteTable().run()}
				className='tiptap-toolbar-btn'
			/>
		</TooltipButton>
	)
}

// Группируем в один компонент для Toolbar
export const ListAndTableButtons: React.FC = () => (
	<ToolbarGroup>
		<BulletListButton />
		<OrderedListButton />
	</ToolbarGroup>
)
