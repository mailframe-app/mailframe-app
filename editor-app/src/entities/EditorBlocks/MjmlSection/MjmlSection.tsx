import { type Node, useNode } from '@craftjs/core'

import { MjmlBlock } from '../MjmlBlock'

import type { MjmlSectionProps } from './MjmlSection.types'
import { MjmlSectionSettings } from './MjmlSectionSettings'

const PROTRUSION = 32

export const MjmlSection = ({
	children,
	gap = 20,
	paddingTop = '20px',
	paddingRight = '0px',
	paddingBottom = '20px',
	paddingLeft = '0px',
	containersBackground = 'transparent',
	borderRadius = '0px',
	hasBgImage = false,
	bgImageUrl = null,
	bgSize = 'cover',
	bgRepeat = 'no-repeat',
	bgPosition = 'center'
}: MjmlSectionProps) => {
	const {
		connectors: { connect }
	} = useNode()

	// никакой компенсации: используем gap "как есть"
	const effectiveGap = Number(gap)

	return (
		// ВНЕШНЯЯ ОБЁРТКА — расширяет секцию за края канваса за счёт content-box padding
		<div
			ref={ref => {
				if (ref) connect(ref)
			}}
			style={{
				margin: '10px 0',
				minHeight: 0,
				paddingTop: '0px',
				paddingRight: `${PROTRUSION}px`,
				paddingBottom: '0px',
				paddingLeft: `${PROTRUSION}px`,
				marginLeft: `-${PROTRUSION}px`,
				boxSizing: 'content-box',
				background: 'transparent',
				width: '100%'
			}}
		>
			{/* ВНУТРЕННЯЯ «ЦВЕТНАЯ» ОБЁРТКА — собственно секция */}
			<div
				style={{
					display: 'flex',
					alignItems: 'flex-start',
					gap: `${effectiveGap}px`,
					minHeight: 0,
					paddingTop,
					paddingRight,
					paddingBottom,
					paddingLeft,
					boxSizing: 'border-box',
					borderRadius,
					background: containersBackground,
					backgroundImage: hasBgImage && bgImageUrl ? `url(${bgImageUrl})` : undefined,
					backgroundSize: bgSize,
					backgroundRepeat: bgRepeat,
					backgroundPosition: bgPosition
				}}
			>
				{children}
			</div>
		</div>
	)
}

MjmlSection.craft = {
	props: {
		gap: 20,
		paddingTop: '20px',
		paddingRight: '0px',
		paddingBottom: '20px',
		paddingLeft: '0px',
		containersBackground: 'transparent',
		borderRadius: '0px',
		hasBgImage: false,
		bgImageUrl: null,
		bgSize: 'cover',
		bgRepeat: 'no-repeat',
		bgPosition: 'center'
	},
	name: 'Сетки',
	related: {
		settings: MjmlSectionSettings
	},
	rules: {
		canMoveIn: (nodes: Node[]) => nodes.every(node => node.data.type === MjmlBlock)
	}
}
