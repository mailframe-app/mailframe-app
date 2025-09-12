import { ROOT_NODE, useNode } from '@craftjs/core'

import { RenderBlockWithToolbar } from '../../BlockToolbar'
import { RenderSectionWithToolbar } from '../../SectionToolbar'
import { type RenderNodeProps } from '../model/types'

import { RenderNodeWithToolbar } from './RenderNodeWithToolbar'
import { MjmlBlock, MjmlSection } from '@/entities/EditorBlocks'

export const RenderWithToolbar = ({ render }: RenderNodeProps) => {
	const { id, type } = useNode(node => ({
		id: node.id,
		type: node.data.type
	}))

	// Если это корневой элемент, просто рендерим без тулбара
	if (id === ROOT_NODE) {
		return render
	}

	// Если это секция, используем SectionToolbar
	if (type === MjmlSection) {
		return <RenderSectionWithToolbar>{render}</RenderSectionWithToolbar>
	}

	// Если это блок, используем BlockToolbar
	if (type === MjmlBlock) {
		return <RenderBlockWithToolbar>{render}</RenderBlockWithToolbar>
	}

	// Для всех остальных компонентов используем NodeToolbar
	return <RenderNodeWithToolbar render={render} />
}
