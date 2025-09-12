import { useRef, useState } from 'react'

interface UsePreviewModeResult {
	isMobileView: boolean
	containerRef: React.RefObject<HTMLDivElement | null>
	handleViewToggle: (isMobile: boolean) => void
}

export const usePreviewMode = (): UsePreviewModeResult => {
	const [isMobileView, setIsMobileView] = useState(false)
	const containerRef = useRef<HTMLDivElement>(null)

	// Обработчик переключения режимов с плавной анимацией
	const handleViewToggle = (isMobile: boolean) => {
		if (containerRef.current) {
			containerRef.current.classList.add('animating')
			setIsMobileView(isMobile)

			setTimeout(() => {
				if (containerRef.current) {
					containerRef.current.classList.remove('animating')
				}
			}, 300)
		}
	}

	return {
		isMobileView,
		containerRef,
		handleViewToggle
	}
}
