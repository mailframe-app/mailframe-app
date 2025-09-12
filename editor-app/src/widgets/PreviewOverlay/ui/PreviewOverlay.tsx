import React from 'react'

import type { PreviewOverlayProps } from '../model/types'
import { usePreviewMode } from '../model/usePreviewMode'

import { PreviewContent } from './PreviewContent'
import { PreviewControls } from './PreviewControls'
import './preview-overlay.css'

export const PreviewOverlay: React.FC<PreviewOverlayProps> = ({ htmlContent, onClose }) => {
	const { isMobileView, containerRef, handleViewToggle } = usePreviewMode()

	const desktopWidth = React.useMemo(() => {
		const match = htmlContent.match(/width:\s*(\d+)px/)
		const w = match ? parseInt(match[1], 10) : 600
		return Number.isFinite(w) && w > 0 ? w : 600
	}, [htmlContent])

	return (
		<div
			className='fixed top-20 right-0 bottom-0 left-0 flex items-center justify-center'
			style={{ backgroundColor: 'var(--color-bg-secondary)' }}
		>
			<div ref={containerRef} className='transition-all duration-300 ease-in-out'>
				<PreviewControls
					isMobileView={isMobileView}
					onViewToggle={handleViewToggle}
					onClose={onClose}
				/>
				<PreviewContent
					htmlContent={htmlContent}
					isMobileView={isMobileView}
					desktopWidth={desktopWidth}
				/>
			</div>
		</div>
	)
}
