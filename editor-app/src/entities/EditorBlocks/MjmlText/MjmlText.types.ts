export interface MjmlTextProps {
	href: string
	url: string
	text: string
	tag: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
	fontSize: string
	fontFamily: string
	fontWeight: 'normal' | 'bold'
	fontStyle: 'normal' | 'italic'
	textDecoration: 'none' | 'underline' | 'line-through'
	textTransform: 'none' | 'uppercase'
	textAlign: 'left' | 'center' | 'right' | 'justify'
	lineHeight: string
	color: string
	paddingTop: string
	paddingRight: string
	paddingBottom: string
	paddingLeft: string
	insertType?: 'table' | 'ul' | 'ol'
}
