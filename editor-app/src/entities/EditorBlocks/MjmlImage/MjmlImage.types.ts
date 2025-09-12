export interface MjmlImageProps {
	src: string
	alt: string
	width: string
	height?: string
	borderRadius?: string
	align: 'left' | 'center' | 'right'
	paddingTop?: string
	paddingBottom?: string
	paddingLeft?: string
	paddingRight?: string
	href?: string
	fileDetails?: {
		name: string
		size: number
		width: number
		height: number
	}
}
