import type { ReactNode } from 'react'

export interface MjmlSectionProps {
	children?: ReactNode
	gap?: number
	paddingTop?: string
	paddingRight?: string
	paddingBottom?: string
	paddingLeft?: string
	containersBackground?: string
	borderRadius?: string
	hasBgImage?: boolean
	bgImageUrl?: string | null
	bgSize?: 'cover' | 'contain' | 'auto' | string
	bgRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y' | string
	bgPosition?: string
}
