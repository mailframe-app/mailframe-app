import type { UserComponent } from '@craftjs/core'
import { Element, useEditor, useNode } from '@craftjs/core'
import { Plus, Upload } from 'lucide-react'

import { MjmlBlock } from '../MjmlBlock'
import { MjmlSection } from '../MjmlSection'

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
		id,
		connectors: { connect, drag }
	} = useNode(node => ({ id: node.id }))

	const { actions, query } = useEditor()

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

	const handleAddSection = () => {
		const tree = query
			.parseReactElement(
				<Element is={MjmlSection} canvas>
					<Element is={MjmlBlock} canvas />
				</Element>
			)
			.toNodeTree()
		actions.addNodeTree(tree, id)
	}

	const AddSectionButton = (
		<button
			type='button'
			onClick={handleAddSection}
			title='Добавить сетку'
			style={{
				width: 40,
				height: 40,
				borderRadius: '9999px',
				border: 'none',
				outline: 'none',
				background: 'var(--accent)',
				color: '#fff',
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				cursor: 'pointer',
				boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
			}}
			aria-label='Добавить сетку'
		>
			<Plus size={20} />
		</button>
	)

	return (
		<div
			ref={ref => {
				if (ref) connect(drag(ref))
			}}
			data-craft-component='Container'
			data-craft-canvas='true'
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
						pointerEvents: 'auto',
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
					<span style={{ pointerEvents: 'none' }}>
						Для начала работы перетащите <br /> сюда элемент Сетки или нажмите
					</span>
					{AddSectionButton}
				</div>
			) : (
				<>
					{children}
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							padding: '16px 0 8px',
							pointerEvents: 'auto',
							userSelect: 'none'
						}}
					>
						{AddSectionButton}
					</div>
				</>
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
		canMoveIn: (incoming: unknown | unknown[]) => {
			type RuleNode = { data?: { type?: unknown; displayName?: string } }
			const isSection = (n: RuleNode) =>
				n?.data?.type === MjmlSection || n?.data?.displayName === 'Сетки'
			const items: RuleNode[] = Array.isArray(incoming)
				? (incoming as RuleNode[])
				: [incoming as RuleNode]
			return items.every(isSection)
		}
	}
}
