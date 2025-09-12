import type { Align } from '@/shared/types/align'

export type LineStyleOption = {
	label: string
	value: 'solid' | 'dashed' | 'dotted'
}

export type SpacerMode = 'space' | 'line'

export interface MjmlSpacerProps {
	mode?: SpacerMode
	thickness: string
	width?: string
	lineStyle: LineStyleOption
	color: string
	align?: Align
	background?: string
	paddingTop?: string
	paddingRight?: string
	paddingBottom?: string
	paddingLeft?: string
}
