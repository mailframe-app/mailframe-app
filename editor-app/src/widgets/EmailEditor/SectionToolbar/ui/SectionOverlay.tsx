import React from 'react'
import ReactDOM from 'react-dom'

import '../styles/SectionToolbar.css'

interface SectionOverlayProps {
	isHover: boolean
	isActive: boolean
	overlayRef: React.RefObject<HTMLDivElement | null>
}

export const SectionOverlay = ({ isHover, isActive, overlayRef }: SectionOverlayProps) => {
	const overlayClass = `
		fixed pointer-events-none z-[5] transition-all duration-200
		${isHover && !isActive ? 'section-hover-overlay' : ''}
		${isActive ? 'section-selected-overlay' : ''}
	`.trim()

	return ReactDOM.createPortal(
		<div
			ref={overlayRef}
			className={overlayClass}
			style={{
				border: isActive
					? '2px solid var(--accent)'
					: isHover
						? '1.5px solid var(--accent)'
						: 'none',
				backgroundColor: isHover && !isActive ? 'rgba(0, 120, 210, 0.1)' : 'transparent',
				borderRadius: '4px'
			}}
		/>,
		document.body
	)
}
