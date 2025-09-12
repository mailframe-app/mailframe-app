import { useEditor, useNode } from '@craftjs/core'

import type { MjmlImageProps } from './MjmlImage.types'
import { MjmlImageSettings } from './MjmlImageSettings'

export const MjmlImage = ({
	src,
	alt,
	width,
	height,
	borderRadius,
	align,
	paddingTop,
	paddingBottom,
	paddingLeft,
	paddingRight,
	href
}: MjmlImageProps) => {
	const {
		connectors: { connect, drag }
	} = useNode()

	const { enabled } = useEditor(state => ({ enabled: state.options.enabled }))
	const justifyContent = align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center'

	const imgEl = (
		<img
			src={src}
			alt={alt}
			style={{
				width,
				height,
				borderRadius,
				maxWidth: '100%',
				cursor: enabled && href ? 'default' : undefined
			}}
			draggable={false}
			onClick={enabled ? e => e.preventDefault() : undefined}
			onMouseDown={e => e.stopPropagation()}
		/>
	)

	return (
		<div
			ref={(ref: HTMLDivElement | null) => {
				if (ref) connect(drag(ref))
			}}
			style={{
				paddingTop,
				paddingBottom,
				paddingLeft,
				paddingRight,
				width: '100%',
				display: 'flex',
				justifyContent
			}}
		>
			{!enabled ? (
				href ? (
					<a href={href} target='_blank' rel='noopener noreferrer'>
						{imgEl}
					</a>
				) : (
					imgEl
				)
			) : (
				imgEl
			)}
		</div>
	)
}

MjmlImage.craft = {
	props: {
		src: 'https://steamuserimages-a.akamaihd.net/ugc/2079019457927111911/45068F1A462AF6EB757ADABDD621AB5FDE49E38E/?imw=512&imh=512&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true',
		alt: 'placeholder image',
		width: '',
		height: '',
		borderRadius: '',
		align: 'center',
		paddingTop: '0px',
		paddingBottom: '0px',
		paddingLeft: '0px',
		paddingRight: '0px',
		href: '',
		fileDetails: null
	},
	related: {
		settings: MjmlImageSettings
	},
	name: 'Картинка'
}
