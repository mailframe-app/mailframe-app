// Основные пропсы для PreviewOverlay
export interface PreviewOverlayProps {
	htmlContent: string
	onClose: () => void
}

// Пропсы для компонента с контентом
export interface PreviewContentProps {
	htmlContent: string
	isMobileView: boolean
	desktopWidth: number
}

// Пропсы для компонента с контролами
export interface PreviewControlsProps {
	isMobileView: boolean
	onViewToggle: (isMobile: boolean) => void
	onClose: () => void
}

// Размеры для разных режимов просмотра
export interface ViewportSize {
	width: number
	label: string
}
