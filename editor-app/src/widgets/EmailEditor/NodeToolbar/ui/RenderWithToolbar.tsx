import { ROOT_NODE, useNode } from '@craftjs/core'

import { RenderSectionWithToolbar } from '../../SectionToolbar'
import { type RenderNodeProps } from '../model/types'

import { RenderNodeWithToolbar } from './RenderNodeWithToolbar'
import { MjmlSection } from '@/entities/EditorBlocks'

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

	// Для всех остальных компонентов используем NodeToolbar
	return <RenderNodeWithToolbar render={render} />
}
