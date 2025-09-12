import { ROOT_NODE } from '@craftjs/core'

import { type RenderNodeProps } from '../model/types'
import { useNodeToolbar } from '../model/useNodeToolbar'

import { NodeToolbar } from './NodeToolbar'

export const RenderNodeWithToolbar = ({ render }: RenderNodeProps) => {
	const {
		id,
		deletable,
		isToolbarVisible,
		isMjmlBlock,
		indicatorRef,
		dragRef,
		handleToolbarMouseEnter,
		handleToolbarMouseLeave,
		handleDragStart,
		handleSave,
		handleCopy,
		handleDelete
	} = useNodeToolbar()

	return (
		<>
			{isToolbarVisible && id !== ROOT_NODE && (
				<NodeToolbar
					deletable={deletable}
					isMjmlBlock={isMjmlBlock}
					indicatorRef={indicatorRef}
					dragRef={dragRef}
					onMouseEnter={handleToolbarMouseEnter}
					onMouseLeave={handleToolbarMouseLeave}
					onDragStart={handleDragStart}
					onSave={handleSave}
					onCopy={handleCopy}
					onDelete={handleDelete}
				/>
			)}
			{render}
		</>
	)
}
