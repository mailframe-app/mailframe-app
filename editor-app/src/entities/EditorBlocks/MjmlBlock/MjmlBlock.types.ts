import type { CSSProperties, ReactNode } from 'react'

export interface MjmlBlockProps {
	children?: ReactNode
	style?: CSSProperties
	background?: string
	widthPercent?: number
	height?: string
	align?: 'left' | 'center' | 'right'
	paddingTop?: string
	paddingRight?: string
	paddingBottom?: string
	paddingLeft?: string
	borderRadius?: string

	/** Фоновое изображение */
	hasBgImage?: boolean
	bgImageUrl?: string | null
	bgSize?: string
	bgRepeat?: string
	bgPosition?: string
}
