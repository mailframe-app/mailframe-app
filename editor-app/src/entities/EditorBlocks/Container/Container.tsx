import type { UserComponent } from '@craftjs/core'
import { useNode } from '@craftjs/core'
import { Upload } from 'lucide-react'

import type { ContainerProps, PaddingObject } from './Container.types'

function getPaddingString(p: PaddingObject) {
	return `${p.top}px ${p.right}px ${p.bottom}px ${p.left}px`
}

export const Container: UserComponent<ContainerProps> = ({
	children,
	background = '',
	borderRadius = 8,
	padding = { top: 0, right: 0, bottom: 0, left: 0 },
	emailWidth = 600,
	emailHeight = 400,
	style = {},
	bgImageUrl,
	hasBgImage
}) => {
	const {
		connectors: { connect, drag }
	} = useNode()

	const resolvedBackground = background && background !== 'transparent' ? background : '#ffffff'

	let resolvedPaddingObj: PaddingObject
	if (typeof padding === 'object' && padding !== null) {
		resolvedPaddingObj = padding
	} else if (typeof padding === 'number') {
		resolvedPaddingObj = { top: padding, right: padding, bottom: padding, left: padding }
	} else {
		resolvedPaddingObj = { top: 0, right: 0, bottom: 0, left: 0 }
	}

	const resolvedPadding = getPaddingString(resolvedPaddingObj)

	const isEmpty = !children || (Array.isArray(children) && children.length === 0)

	return (
		<div
			ref={ref => {
				if (ref) connect(drag(ref))
			}}
			style={{
				background: resolvedBackground,
				borderRadius,
				padding: resolvedPadding,
				width: emailWidth,
				margin: '0 auto',
				minHeight: emailHeight,
				position: 'relative',
				border: isEmpty ? '1px dashed var(--secondary)' : 'none',
				boxSizing: 'border-box',
				...(hasBgImage && bgImageUrl
					? {
							backgroundImage: `url(${bgImageUrl})`,
							backgroundRepeat: 'no-repeat',
							backgroundSize: 'cover',
							backgroundPosition: 'center'
						}
					: {}),
				...style
			}}
		>
			{isEmpty ? (
				<div
					style={{
						color: 'var(--secondary)',
						opacity: 0.6,
						textAlign: 'center',
						fontSize: 14,
						fontWeight: 400,
						position: 'absolute',
						left: 0,
						right: 0,
						top: '50%',
						transform: 'translateY(-50%)',
						pointerEvents: 'none',
						userSelect: 'none',
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 10,
						padding: 10
					}}
				>
					<Upload size={16} />
					Перетащите сюда элемент <br /> или готовый блок из левого меню
				</div>
			) : (
				children
			)}
		</div>
	)
}

Container.craft = {
	props: {
		background: '',
		borderRadius: 8,
		padding: { top: 0, right: 0, bottom: 0, left: 0 },
		emailWidth: 600,
		emailHeight: 400,
		style: {}
	},
	name: 'Container',
	rules: {
		canMoveIn: () => true
	}
}
