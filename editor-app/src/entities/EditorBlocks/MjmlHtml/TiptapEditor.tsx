// --- Tiptap Core Extensions ---
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { Table } from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import TextAlign from '@tiptap/extension-text-align'
// --- Styles ---
import Underline from '@tiptap/extension-underline'
import { EditorContent, EditorContext, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import * as React from 'react'

// --- Utils ---
import { MAX_FILE_SIZE, handleImageUpload } from '@/shared/lib/tiptap'
import { ListAndTableButtons, TableToolbarButtons } from '@/shared/ui'
// --- Tiptap Nodes ---
import { ImageUploadNode } from '@/shared/ui/tiptap/node/image-upload-node'
// --- UI Primitives ---
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/shared/ui/tiptap/primitive/toolbar'
// --- Tiptap UI ---
import { BlockquoteButton } from '@/shared/ui/tiptap/ui/blockquote-button'
import { CodeBlockButton } from '@/shared/ui/tiptap/ui/code-block-button'
import { ImageUploadButton } from '@/shared/ui/tiptap/ui/image-upload-button'
import { LinkPopover } from '@/shared/ui/tiptap/ui/link-popover'
import { MarkButton } from '@/shared/ui/tiptap/ui/mark-button'
import { TextAlignButton } from '@/shared/ui/tiptap/ui/text-align-button'
import { UndoRedoButton } from '@/shared/ui/tiptap/ui/undo-redo-button'

import './styles/tiptap-editor.scss'

interface TiptapEditorProps {
	value: string
	onChange: (html: string) => void
}

const MainToolbarContent = () => {
	return (
		<>
			<ToolbarGroup>
				<UndoRedoButton action='undo' />
				<UndoRedoButton action='redo' />
			</ToolbarGroup>

			<ToolbarSeparator />

			<ToolbarGroup>
				<MarkButton type='bold' />
				<MarkButton type='italic' />
				<MarkButton type='underline' />
			</ToolbarGroup>
			<ToolbarSeparator />

			<ToolbarGroup>
				<ListAndTableButtons />
				<TableToolbarButtons />
			</ToolbarGroup>

			<ToolbarSeparator />

			<ToolbarGroup>
				<BlockquoteButton />
				<CodeBlockButton />
			</ToolbarGroup>

			<ToolbarSeparator />

			<ToolbarGroup>
				<TextAlignButton align='left' />
				<TextAlignButton align='center' />
				<TextAlignButton align='right' />
				<TextAlignButton align='justify' />
			</ToolbarGroup>

			<ToolbarSeparator />

			<ToolbarGroup>
				<LinkPopover />
				<ImageUploadButton />
			</ToolbarGroup>

			<ToolbarSeparator />
		</>
	)
}

export const TiptapEditor: React.FC<TiptapEditorProps> = ({ value, onChange }) => {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				link: false,
				underline: false
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: 'text-blue-500 underline'
				}
			}),
			Image,
			ImageUploadNode.configure({
				accept: 'image/*',
				maxSize: MAX_FILE_SIZE,
				upload: handleImageUpload,
				onError: error => console.error('Upload failed:', error)
			}),
			TextAlign.configure({
				types: ['heading', 'paragraph']
			}),
			Underline,
			TaskList,
			TaskItem.configure({ nested: true }),
			Table.configure({
				resizable: true
			}),
			TableRow,
			TableCell,
			TableHeader
		],
		content: value,
		onUpdate: ({ editor }) => {
			onChange(editor.getHTML())
		},
		editorProps: {
			attributes: {
				autocomplete: 'off',
				autocorrect: 'off',
				autocapitalize: 'off',
				class: 'tiptap-editor prose prose-sm focus:outline-none'
			}
		}
	})

	React.useEffect(() => {
		if (editor && editor.getHTML() !== value) {
			editor.commands.setContent(value)
		}
	}, [value, editor])

	if (!editor) {
		return null
	}

	return (
		<div className='tiptap-editor-wrapper'>
			<EditorContext.Provider value={{ editor }}>
				<Toolbar>
					<MainToolbarContent />
				</Toolbar>

				<div className='tiptap-content'>
					<EditorContent editor={editor} className='tiptap-custom-editor' />
				</div>
			</EditorContext.Provider>
		</div>
	)
}
