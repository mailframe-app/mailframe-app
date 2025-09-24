import type { SerializedNodes } from '@craftjs/core'
import { Editor } from '@craftjs/core'
import { useMemo } from 'react'

import { AutoWrapper } from '@/features/AutoWrapper'
import { AddModuleToCanvas } from '@/features/ModulesLibrary'
import { useSaveNodeFeature } from '@/features/NodeActions'

import { generateHtmlFromNodes } from '@/shared/lib'

import { Canvas } from './Canvas'
import { EditorTools } from './EditorTools'
import { RenderWithToolbar } from './NodeToolbar'
import { PropertiesPanel } from './PropertiesPanel'
import { Sidebar } from './Sidebar'
import {
	Container,
	MjmlBlock,
	MjmlButton,
	MjmlColumn,
	MjmlHtml,
	MjmlImage,
	MjmlSection,
	MjmlSingleSection,
	MjmlSocialBlock,
	MjmlSocialElement,
	MjmlSpacer,
	MjmlText,
	MjmlWrapper
} from '@/entities/EditorBlocks'
import { useEditorTemplateStore } from '@/entities/EditorTemplate'

const EmailEditor = () => {
	const { template, updateEditorState, updateBodyHtml, openPreview } = useEditorTemplateStore()

	const { SaveNodeModalProvider } = useSaveNodeFeature()

	const resolver = useMemo(
		() => ({
			Container,
			MjmlText,
			MjmlButton,
			MjmlWrapper,
			MjmlSection,
			MjmlSingleSection,
			MjmlColumn,
			MjmlImage,
			MjmlSpacer,
			MjmlHtml,
			MjmlSocialBlock,
			MjmlSocialElement,
			MjmlBlock
		}),
		[]
	)

	const handleNodesChange = (q: { getSerializedNodes: () => SerializedNodes }) => {
		const serializedNodes = q.getSerializedNodes()
		updateEditorState(serializedNodes)

		const bodyHtml = generateHtmlFromNodes(serializedNodes)
		updateBodyHtml(bodyHtml)
	}

	return (
		<Editor
			onRender={RenderWithToolbar}
			onNodesChange={handleNodesChange}
			resolver={resolver}
			indicator={{
				thickness: 4,
				success: 'var(--accent)',
				error: 'var(--red)',
				className: 'editor-drop-indicator'
			}}
		>
			<div className='editor-content w-full'>
				<div className='w-[20vw]'>
					<Sidebar />
				</div>
				<div className='relative flex flex-1 flex-col'>
					<Canvas editorState={template?.editorState} />
					<EditorTools onPreviewClick={openPreview} />
				</div>
				<PropertiesPanel />
			</div>
			<AddModuleToCanvas />
			<SaveNodeModalProvider />
			<AutoWrapper />
		</Editor>
	)
}
export default EmailEditor
