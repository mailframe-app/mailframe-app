import React from 'react'
import ReactDOM from 'react-dom'

import '../styles/BlockToolbar.css'

interface BlockOverlayProps {
	isHover: boolean
	isActive: boolean
	isDragging: boolean
	overlayRef: React.RefObject<HTMLDivElement | null>
	onClick: (e: React.MouseEvent) => void
}

export const BlockOverlay = ({ isHover, isActive, overlayRef }: BlockOverlayProps) => {
	const overlayClass = `
		fixed z-[5] transition-all duration-200
		${isHover && !isActive ? 'block-hover-overlay' : ''}
		${isActive ? 'block-selected-overlay' : ''}
	`.trim()

	return ReactDOM.createPortal(
		<div
			ref={overlayRef}
			className={overlayClass}
			style={{
				pointerEvents: 'none',
				border: isActive
					? '2px solid var(--accent)'
					: isHover
						? '1.5px solid var(--accent)'
						: 'none',
				borderRadius: '4px'
			}}
		/>,
		document.body
	)
}
