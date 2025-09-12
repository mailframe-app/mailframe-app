import { useNode } from '@craftjs/core'
import { useRef } from 'react'

import type { MjmlHtmlProps } from './MjmlHtml.types'
import { MjmlHtmlSettings } from './MjmlHtmlSettings'
import './styles/display-styles.scss'

export const MjmlHtml = ({
	html,
	paddingTop,
	paddingRight,
	paddingBottom,
	paddingLeft,
	...props
}: MjmlHtmlProps) => {
	const {
		connectors: { connect, drag }
	} = useNode()
	const ref = useRef<HTMLDivElement>(null)

	return (
		<div
			style={{
				paddingTop,
				paddingRight,
				paddingBottom,
				paddingLeft
			}}
			{...props}
		>
			<div
				ref={(node: HTMLDivElement | null) => {
					if (node) {
						connect(drag(node))
						ref.current = node
					}
				}}
			>
				<div
					className='tiptap-display tiptap-custom-editor'
					style={{
						padding: '10px',
						boxSizing: 'border-box',
						overflow: 'visible',
						wordBreak: 'break-word',
						overflowWrap: 'anywhere',
						whiteSpace: 'normal'
					}}
					dangerouslySetInnerHTML={{ __html: html || '<div>Текстовый редактор</div>' }}
				/>
			</div>
		</div>
	)
}

MjmlHtml.craft = {
	props: {
		html: '<div>Текстовый редактор</div>',
		paddingTop: '0px',
		paddingRight: '0px',
		paddingBottom: '0px',
		paddingLeft: '0px'
	},
	name: 'Текстовый редактор',
	related: {
		settings: MjmlHtmlSettings
	}
}
