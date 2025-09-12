import { useNode } from '@craftjs/core'

import type { MjmlSpacerProps } from './MjmlSpacer.types'
import { MjmlSpacerSettings } from './MjmlSpacerSettings'

export const MjmlSpacer = ({
	// mode = 'space',
	thickness = '2px',
	width = 'auto',
	lineStyle = { label: 'Сплошная', value: 'solid' },
	color = '#dddddd',
	align = 'left',
	background = 'transparent',
	paddingTop = '10px',
	paddingRight = '0px',
	paddingBottom = '10px',
	paddingLeft = '0px'
}: MjmlSpacerProps) => {
	const {
		connectors: { connect, drag }
	} = useNode()

	const wrapperStyle: React.CSSProperties = {
		background,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft
	}

	// if (mode === 'space') {
	// 	return (
	// 		<div
	// 			ref={ref => {
	// 				if (ref) connect(drag(ref))
	// 			}}
	// 			style={{
	// 				...wrapperStyle,
	// 				height: thickness
	// 			}}
	// 		/>
	// 	)
	// }

	// mode === 'line'
	return (
		<div
			ref={ref => {
				if (ref) connect(drag(ref))
			}}
			style={{
				...wrapperStyle,
				textAlign: align as React.CSSProperties['textAlign'],
				lineHeight: 0,
				fontSize: 0
			}}
		>
			<div
				aria-hidden
				style={{
					display: 'inline-block',
					width: width === 'auto' ? '100%' : width,
					height: 0,
					borderTop: `${thickness} ${lineStyle?.value ?? 'solid'} ${color}`,
					verticalAlign: 'top'
				}}
			/>
		</div>
	)
}

MjmlSpacer.craft = {
	props: {
		mode: 'space',
		width: 'auto',
		thickness: '2px',
		lineStyle: { label: 'Сплошная', value: 'solid' },
		color: '#FFFFFF',
		align: 'left',
		background: 'transparent',
		paddingTop: '10px',
		paddingRight: '0px',
		paddingBottom: '10px',
		paddingLeft: '0px'
	},
	related: {
		settings: MjmlSpacerSettings
	},
	name: 'Отступ'
}
