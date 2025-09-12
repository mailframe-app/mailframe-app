import type { UserComponent } from '@craftjs/core'
import { useNode } from '@craftjs/core'
import * as React from 'react'

import type { MjmlSocialBlockProps } from './MjmlSocialBlock.types'
import { MjmlSocialBlockSettings } from './MjmlSocialBlockSettings'

export const MjmlSocialBlock: UserComponent<MjmlSocialBlockProps> = ({
	items = [],
	size = 32,
	gap = 10,
	align = 'left',
	paddingTop = '0px',
	paddingRight = '0px',
	paddingBottom = '0px',
	paddingLeft = '0px',
	background = 'transparent'
}) => {
	const {
		connectors: { connect, drag },
		actions: { setProp },
		events: { selected: blockSelected },
		selectedIndex = -1
	} = useNode(node => ({
		events: node.events,
		selectedIndex: (node.data.props as MjmlSocialBlockProps).selectedIndex
	}))

	React.useEffect(() => {
		if (!blockSelected) {
			setProp((p: MjmlSocialBlockProps) => {
				p.selectedIndex = -1
			})
		}
	}, [blockSelected, setProp])

	const justifyContent =
		align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start'

	return (
		<div
			ref={ref => {
				if (ref) connect(drag(ref))
			}}
			onClick={e => {
				if (e.target === e.currentTarget) {
					setProp((p: MjmlSocialBlockProps) => {
						p.selectedIndex = -1
					})
				}
			}}
			style={{
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent,
				gap: `${gap}px`,
				paddingTop,
				paddingRight,
				paddingBottom,
				paddingLeft,
				background,
				outline: blockSelected ? '1px dashed #9dc1ff' : 'none',
				outlineOffset: 2,
				borderRadius: 6,
				cursor: 'default',
				alignItems: 'flex-start'
			}}
		>
			{items.map(({ id, href, src, name, alt }, idx) => {
				const isActive = selectedIndex === idx
				return (
					<a
						key={id}
						href={href || '#'}
						onClick={e => {
							e.preventDefault()
							e.stopPropagation()
							setProp((p: MjmlSocialBlockProps) => {
								p.selectedIndex = idx
							})
						}}
						data-preview-link
						role='button'
						title={name || ''}
						style={{
							display: 'inline-flex',
							flex: '0 0 auto',
							width: size,
							height: size,
							borderRadius: 6,
							padding: 0,
							outline: isActive ? '2px solid #3b82f6' : '1px solid transparent',
							outlineOffset: 2,
							cursor: 'pointer',
							boxSizing: 'content-box'
						}}
						aria-selected={isActive}
					>
						<img
							src={src}
							alt={alt || name || 'social'}
							style={{
								width: '100%',
								height: '100%',
								display: 'block',
								objectFit: 'contain'
							}}
							draggable={false}
						/>
					</a>
				)
			})}
		</div>
	)
}

MjmlSocialBlock.craft = {
	props: {
		items: [
			{
				id: 'tw',
				name: 'Twitter',
				href: 'https://x.com/',
				src: 'https://cdn-icons-png.flaticon.com/512/733/733579.png'
			}
		],
		size: 32,
		gap: 10,
		align: 'left',
		background: '#FFFFFF',
		paddingTop: '0px',
		paddingRight: '0px',
		paddingBottom: '0px',
		paddingLeft: '0px',
		selectedIndex: -1
	},
	related: { settings: MjmlSocialBlockSettings },
	name: 'Соцсети'
}
