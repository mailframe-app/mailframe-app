import { IconAdd } from '@consta/icons/IconAdd'
import { IconTable } from '@consta/icons/IconTable'
import { IconTrash } from '@consta/icons/IconTrash'
import { Button } from '@consta/uikit/Button'
import { EditorContext } from '@tiptap/react'
import React, { useEffect, useState } from 'react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/shared/ui/tiptap/primitive/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tiptap/primitive/tooltip'

const TooltipButton = ({ tooltip, children }: { tooltip: string; children: React.ReactNode }) => (
	<Tooltip delay={200}>
		<TooltipTrigger asChild>{children}</TooltipTrigger>
		<TooltipContent>{tooltip}</TooltipContent>
	</Tooltip>
)

export const TableInsertButton = () => {
	const { editor } = React.useContext(EditorContext)
	const [, forceUpdate] = useState(0)

	useEffect(() => {
		if (!editor) return

		const update = () => forceUpdate(x => x + 1)
		editor.on('selectionUpdate', update)
		editor.on('transaction', update)

		return () => {
			editor.off('selectionUpdate', update)
			editor.off('transaction', update)
		}
	}, [editor])

	if (!editor) return null

	return (
		<TooltipButton tooltip='Insert Table'>
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
		<TooltipButton tooltip='Delete Table'>
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

export const TableActionsButton = () => {
	const { editor } = React.useContext(EditorContext)
	if (!editor) return null

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					onlyIcon
					size='s'
					view='ghost'
					iconLeft={IconAdd}
					className='tiptap-toolbar-btn'
					title='Table Actions'
				/>
			</DropdownMenuTrigger>

			<DropdownMenuContent className='tiptap-dropdown-menu-content' align='end' side='bottom'>
				<DropdownMenuItem
					className='tiptap-dropdown-menu-item'
					onClick={() => editor.chain().focus().addColumnAfter().run()}
				>
					Добавить столбец справа
				</DropdownMenuItem>
				<DropdownMenuItem
					className='tiptap-dropdown-menu-item'
					onClick={() => editor.chain().focus().addColumnBefore().run()}
				>
					Добавить столбец слева
				</DropdownMenuItem>
				<DropdownMenuItem
					className='tiptap-dropdown-menu-item'
					onClick={() => editor.chain().focus().addRowAfter().run()}
				>
					Добавить строку ниже
				</DropdownMenuItem>
				<DropdownMenuItem
					className='tiptap-dropdown-menu-item'
					onClick={() => editor.chain().focus().addRowBefore().run()}
				>
					Добавить строку выше
				</DropdownMenuItem>
				<DropdownMenuItem
					className='tiptap-dropdown-menu-item'
					onClick={() => editor.chain().focus().deleteColumn().run()}
				>
					Удалить столбец
				</DropdownMenuItem>
				<DropdownMenuItem
					className='tiptap-dropdown-menu-item'
					onClick={() => editor.chain().focus().deleteRow().run()}
				>
					Удалить строку
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

/** Компонент для панели TipTap, используем в ToolbarGroup */
export const TableToolbarButtons: React.FC = () => {
	const { editor } = React.useContext(EditorContext)
	const [, forceUpdate] = useState(0)

	useEffect(() => {
		if (!editor) return

		const update = () => forceUpdate(x => x + 1)
		editor.on('selectionUpdate', update)
		editor.on('transaction', update)

		return () => {
			editor.off('selectionUpdate', update)
			editor.off('transaction', update)
		}
	}, [editor])

	if (!editor) return null

	return (
		<>
			<TableInsertButton />
			{editor.isActive('table') && (
				<>
					<TableDeleteButton />
					<TableActionsButton />
				</>
			)}
		</>
	)
}
