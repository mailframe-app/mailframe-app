import React from 'react'

import { VIEWPORT_SIZES } from '../model/constants'
import type { PreviewContentProps } from '../model/types'
import { usePreviewContent } from '../model/usePreviewContent'

import './scrollbar.css'

/**
 * Компонент для отображения контента письма в предпросмотре
 */
export const PreviewContent: React.FC<PreviewContentProps> = ({
	htmlContent,
	isMobileView,
	desktopWidth
}) => {
	const { iframeRef, scrollContainerRef } = usePreviewContent({
		htmlContent,
		isMobileView,
		desktopWidth
	})

	return (
		<div className='flex justify-center'>
			<div
				className='relative h-[80vh] transition-all duration-300 ease-in-out'
				style={{ width: isMobileView ? VIEWPORT_SIZES.MOBILE.width : desktopWidth }}
			>
				{/* Контейнер с прокруткой */}
				<div
					ref={scrollContainerRef}
					className='custom-scrollbar absolute top-0 left-0 h-full w-[calc(100%+16px)] overflow-x-hidden overflow-y-auto pr-2'
				>
					{/* Белое письмо */}
					<div className='rounded-lg bg-white p-2 shadow-md'>
						<iframe
							ref={iframeRef}
							id='preview-iframe'
							title='Email Preview'
							className='w-full overflow-x-hidden border-0'
							style={{ height: '78vh', minHeight: '78vh' }}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
