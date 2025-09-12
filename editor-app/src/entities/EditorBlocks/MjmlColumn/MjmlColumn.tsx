import { useNode } from '@craftjs/core'

import type { MjmlColumnProps } from './MjmlColumn.types'
import { MjmlColumnSettings } from './MjmlColumnSettings'

export const MjmlColumn = ({ children, width, ...props }: MjmlColumnProps) => {
	const {
		connectors: { connect, drag }
	} = useNode()
	return (
		<div
			{...props}
			ref={ref => {
				if (ref) {
					connect(drag(ref))
				}
			}}
			style={{
				padding: '10px',
				minHeight: '50px',
				// border: '1px dashed #ccc',
				background: 'rgba(0,0,0,0.01)',
				width: width || '100%',
				flexBasis: width || '100%'
			}}
		>
			{children}
		</div>
	)
}

MjmlColumn.craft = {
	props: {
		width: '100%'
	},
	name: 'Сетки',
	related: {
		settings: MjmlColumnSettings
	},
	rules: {
		canMoveIn: () => true
	}
}
