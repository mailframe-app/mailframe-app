import { Element, Frame, useEditor } from '@craftjs/core'
import React from 'react'

import { Container } from '@/entities/EditorBlocks'

interface CanvasProps {
	editorState?: Record<string, unknown> | null
}

export const Canvas: React.FC<CanvasProps> = ({ editorState }) => {
	const frameData = editorState ? JSON.stringify(editorState) : undefined
	const { actions } = useEditor()

	// Проверяем, клик по канвасу или его контейнеру
	const handleCanvasClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('mx-auto')) {
			actions.selectNode('ROOT')
		}
	}

	return (
		<div className='editor-canvas' onClick={handleCanvasClick}>
			<div className='mx-auto pt-[20px]' style={{ maxWidth: 900 }}>
				<Frame data={frameData}>
					<Element is={Container} canvas id='ROOT_CANVAS' />
				</Frame>
			</div>
		</div>
	)
}
