import { useEffect, useRef } from 'react'

import { wrapContentInTemplate } from '../lib/templateWrapper'

import { VIEWPORT_SIZES } from './constants'

interface UsePreviewContentResult {
	iframeRef: React.RefObject<HTMLIFrameElement | null>
	scrollContainerRef: React.RefObject<HTMLDivElement | null>
}

interface UsePreviewContentProps {
	htmlContent: string
	isMobileView: boolean
	desktopWidth: number
}

export const usePreviewContent = ({
	htmlContent,
	isMobileView,
	desktopWidth
}: UsePreviewContentProps): UsePreviewContentResult => {
	const iframeRef = useRef<HTMLIFrameElement>(null)
	const scrollContainerRef = useRef<HTMLDivElement>(null)

	// Функция для обновления высоты iframe
	const updateIframeHeight = () => {
		const iframe = iframeRef.current
		if (iframe && iframe.contentDocument) {
			try {
				iframe.style.height = 'auto'

				// Получаем актуальную высоту после сброса
				const contentHeight = iframe.contentDocument.documentElement.scrollHeight
				const viewportHeight = window.innerHeight * 0.78
				const height = Math.max(contentHeight, viewportHeight)
				iframe.style.height = `${height}px`
			} catch (e) {
				console.error('Failed to resize iframe', e)
			}
		}
	}

	// useEffect для инициализации iframe и установки контента
	useEffect(() => {
		const iframe = iframeRef.current
		if (iframe) {
			const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
			if (iframeDoc) {
				// Инициализация контента
				iframeDoc.documentElement.innerHTML = wrapContentInTemplate(htmlContent)

				// Применяем размеры в зависимости от режима просмотра
				const container = iframeDoc.querySelector('.email-container') as HTMLElement
				if (container) {
					const width = isMobileView ? VIEWPORT_SIZES.MOBILE.width : desktopWidth
					container.style.width = `${width}px`
				}

				updateIframeHeight()
			}
		}
	}, [htmlContent, isMobileView, desktopWidth])

	// useEffect для обновления высоты iframe при изменении режима просмотра
	useEffect(() => {
		const timer = setTimeout(() => {
			updateIframeHeight()
		}, 300)
		return () => clearTimeout(timer)
	}, [isMobileView])

	return {
		iframeRef,
		scrollContainerRef
	}
}
