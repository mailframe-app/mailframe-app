import type { CSSProperties, ReactNode } from 'react'

export interface PaddingObject {
	top: number
	right: number
	bottom: number
	left: number
}

export interface ContainerProps {
	children?: ReactNode
	background?: string
	borderRadius?: number
	padding?: PaddingObject | number
	emailWidth?: number
	emailHeight?: number
	style?: CSSProperties
	[key: string]: unknown
}
