import React from 'react'

import { useBlockToolbar } from '../model/useBlockToolbar'
import '../styles/BlockToolbar.css'

import { BlockToolbar } from './BlockToolbar'

interface RenderBlockWithToolbarProps {
	children: React.ReactNode
}

export const RenderBlockWithToolbar = ({ children }: RenderBlockWithToolbarProps) => {
	const {
		deletable,
		isToolbarVisible,
		isHover,
		isActive,
		isDragging,
		overlayRef,
		actionsRef,
		dragRef,
		handleDragStart,
		handleCopy,
		handleDelete,
		handleSave,
		handleOverlayClick,
		handleMouseEnter,
		handleMouseLeave
	} = useBlockToolbar()

	return (
		<>
			{children}
			<BlockToolbar
				deletable={deletable}
				isToolbarVisible={isToolbarVisible}
				isHover={isHover}
				isActive={isActive}
				isDragging={isDragging}
				overlayRef={overlayRef}
				actionsRef={actionsRef}
				dragRef={dragRef}
				onDragStart={handleDragStart}
				onCopy={handleCopy}
				onDelete={handleDelete}
				onSave={handleSave}
				onOverlayClick={handleOverlayClick}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
			/>
		</>
	)
}
