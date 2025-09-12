import type { UserComponent } from '@craftjs/core'
import { useNode } from '@craftjs/core'

import type { MjmlSocialElementProps } from './MjmlSocialElement.types'
import { MjmlSocialElementSettings } from './MjmlSocialElementSettings'

export const MjmlSocialElement: UserComponent<MjmlSocialElementProps> = ({ href, src, alt }) => {
	const {
		connectors: { connect, drag }
	} = useNode()

	return (
		<div
			ref={ref => {
				if (ref) connect(drag(ref))
			}}
			style={{
				display: 'inline-block'
			}}
			data-href={href}
		>
			<img src={src} alt={alt} style={{ width: '32px' }} />
		</div>
	)
}

MjmlSocialElement.craft = {
	props: {
		href: '#',
		src: 'https://cdn-icons-png.flaticon.com/512/174/174848.png',
		alt: 'Social Icon'
	},
	displayName: 'Иконка соцсети',
	related: {
		settings: MjmlSocialElementSettings
	},
	custom: {
		draggable: true
	}
}
