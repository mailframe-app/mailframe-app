import React from 'react'

import { useSectionToolbar } from '../model/useSectionToolbar'
import '../styles/SectionToolbar.css'

import { SectionToolbar } from './SectionToolbar'

interface RenderSectionWithToolbarProps {
	children: React.ReactNode
}

export const RenderSectionWithToolbar = ({ children }: RenderSectionWithToolbarProps) => {
	const {
		deletable,
		isToolbarVisible,
		isHover,
		isActive,
		overlayRef,
		dragButtonRef,
		actionsRef,
		leftEarRef,
		rightEarRef,
		dragRef,
		handleDragStart,
		handleCopy,
		handleDelete,
		handleSave,
		handleOverlayClick,
		handleMouseEnter,
		handleMouseLeave
	} = useSectionToolbar()

	return (
		<>
			{children}
			<SectionToolbar
				deletable={deletable}
				isToolbarVisible={isToolbarVisible}
				isHover={isHover}
				isActive={isActive}
				overlayRef={overlayRef}
				dragButtonRef={dragButtonRef}
				actionsRef={actionsRef}
				leftEarRef={leftEarRef}
				rightEarRef={rightEarRef}
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
