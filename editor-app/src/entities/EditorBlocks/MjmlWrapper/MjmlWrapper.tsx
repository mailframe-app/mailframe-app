import type { Node, UserComponent } from '@craftjs/core'
import { useNode } from '@craftjs/core'

import type { MjmlWrapperProps } from './MjmlWrapper.types'
import { MjmlWrapperSettings } from './MjmlWrapperSettings'

export const MjmlWrapper: UserComponent<MjmlWrapperProps> = ({ children, ...props }) => {
	const {
		connectors: { connect }
	} = useNode()
	return (
		<div
			{...props}
			ref={ref => {
				if (ref) {
					connect(ref)
				}
			}}
			style={{
				border: '1px solid #e0e0e0',
				padding: '20px',
				background: '#fff',
				minHeight: '500px'
			}}
		>
			{children}
		</div>
	)
}

MjmlWrapper.craft = {
	props: {},
	name: 'Wrapper',
	related: {
		settings: MjmlWrapperSettings
	},
	rules: {
		canMoveIn: (incoming: Node[]) => incoming.every(node => node.data.name === 'Section')
	}
}
