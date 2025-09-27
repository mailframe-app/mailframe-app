import { Element, useEditor, useNode } from '@craftjs/core'
import React, { useEffect } from 'react'

import { MjmlBlock } from '../MjmlBlock'

import type { MjmlSectionProps } from './MjmlSection.types'
import { MjmlSectionSettings } from './MjmlSectionSettings'

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
		id,
		childNodes,
		connectors: { connect }
	} = useNode(node => ({
		id: node.id,
		childNodes: node.data.nodes || []
	}))

	const { actions, query } = useEditor()

	useEffect(() => {
		if (childNodes.length === 0) {
			const BlockComp = MjmlBlock as React.ElementType
			const blockEl = <Element is={BlockComp} canvas />
			const blockNode = query.createNode(blockEl)
			actions.add(blockNode, id)
		}
	}, [childNodes.length, actions, query, id])

	const effectiveGap = Number(gap)

	return (
		<div
			ref={ref => {
				if (ref) connect(ref)
			}}
			data-craft-component='MjmlSection'
			data-craft-canvas='true'
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
	)
}

MjmlSection.displayName = 'MjmlSection'

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
	related: { settings: MjmlSectionSettings },
	rules: {
		canMoveIn: (incoming: unknown | unknown[]) => {
			type RuleNode = { data?: { type?: unknown; displayName?: string } }
			const isBlock = (n: RuleNode) =>
				n?.data?.type === MjmlBlock || n?.data?.displayName === 'Блок'
			const items: RuleNode[] = Array.isArray(incoming)
				? (incoming as RuleNode[])
				: [incoming as RuleNode]
			return items.every(isBlock)
		}
	}
}
