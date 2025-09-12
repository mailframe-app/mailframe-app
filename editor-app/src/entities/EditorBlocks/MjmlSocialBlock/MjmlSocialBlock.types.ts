import type { Align } from '@/shared/types/align'

export type SocialItem = {
	id: string
	name: string
	href: string
	src: string
	alt?: string
}

export interface MjmlSocialBlockProps {
	items: SocialItem[]
	selectedIndex?: number
	size?: number
	gap?: number
	align?: Align
	paddingTop?: string
	paddingRight?: string
	paddingBottom?: string
	paddingLeft?: string
	background?: string
}
