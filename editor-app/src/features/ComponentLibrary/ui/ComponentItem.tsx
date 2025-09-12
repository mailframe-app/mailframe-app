import { IconDraggable } from '@consta/icons/IconDraggable'
import { Text } from '@consta/uikit/Text'
import { Element, type NodeId, useEditor } from '@craftjs/core'
import React from 'react'

import type { ComponentItemProps } from '../model/types'

import { Container, MjmlBlock, MjmlColumn, MjmlSection, MjmlWrapper } from '@/entities/EditorBlocks'

const LAYOUT_WHITELIST: ReadonlySet<React.ElementType> = new Set([
	MjmlWrapper,
	MjmlSection,
	MjmlColumn,
	Container,
	MjmlBlock
])

const resolveType = (el: React.ReactElement): React.ElementType | string => {
	const props = el.props as Record<string, unknown> | undefined
	if (props && 'is' in props && props.is) return props.is as React.ElementType
	return el.type
}

const normalizeToPlainElement = (el: React.ReactElement): React.ReactElement => {
	const props = el.props as Record<string, unknown> | undefined
	if (props && 'is' in props && props.is) {
		const Comp = props.is as React.ElementType
		const {
			is: _i,
			canvas: _c,
			...rest
		} = props as { is?: unknown; canvas?: unknown } & Record<string, unknown>
		void _i
		void _c
		return React.createElement(Comp, rest)
	}
	return el
}

const firstValidNodeId = (sel: unknown): NodeId | null => {
	if (!sel) return null
	if (typeof sel === 'string') return sel
	if (sel instanceof Set) {
		const first = sel.values().next().value
		return first || null
	}
	if (Array.isArray(sel)) return sel.length > 0 ? sel[0] : null
	return null
}

export const ComponentItem: React.FC<ComponentItemProps> = ({
	icon: Icon,
	title,
	component,
	componentProps = {},
	isCanvas,
	onClick
}) => {
	const { connectors } = useEditor()

	const { dropTargetType } = useEditor((state, query) => {
		const hoveredNodeId = firstValidNodeId(state.events.hovered)
		let targetType: 'ROOT' | 'SECTION' | 'BLOCK' | null = null

		if (hoveredNodeId) {
			try {
				if (hoveredNodeId === 'ROOT') {
					targetType = 'ROOT'
				} else {
					const hoveredNode = query.node(hoveredNodeId).get()
					const type = hoveredNode?.data.type
					if (type === Container) targetType = 'ROOT'
					if (type === MjmlSection) targetType = 'SECTION'
					if (type === MjmlBlock) targetType = 'BLOCK'
				}
			} catch (e) {
				/* ignore */
			}
		}
		return { dropTargetType: targetType }
	})

	const toElement = (): React.ReactElement | null => {
		if (!component) return null
		return React.isValidElement(component)
			? component
			: React.createElement(component as React.ElementType, componentProps)
	}

	const buildFinalElement = (rawEl: React.ReactElement): React.ReactElement => {
		const resolvedType = resolveType(rawEl) as React.ElementType
		const plain = normalizeToPlainElement(rawEl)
		const isLayout = LAYOUT_WHITELIST.has(resolvedType)

		// Case 1: Dragging content (Text, Image...)
		if (!isLayout) {
			if (dropTargetType === 'BLOCK') {
				return plain
			} else {
				const block = (
					<Element is={MjmlBlock} canvas>
						{' '}
						{plain}{' '}
					</Element>
				)
				if (dropTargetType === 'ROOT') {
					return (
						<Element is={MjmlSection} canvas>
							{' '}
							{block}{' '}
						</Element>
					)
				}
				return block
			}
		}
		// Case 2: Dragging layout (Block, Section)
		else {
			const layoutElement = <Element is={resolvedType} {...(plain.props as {})} canvas={isCanvas} />
			if (resolvedType === MjmlBlock && dropTargetType === 'ROOT') {
				return (
					<Element is={MjmlSection} canvas>
						{' '}
						{layoutElement}{' '}
					</Element>
				)
			}
			return layoutElement
		}
	}

	const DRAG_ICON_PX = 16

	return (
		<div
			ref={(ref: HTMLDivElement | null) => {
				if (!ref) return
				const el = toElement()
				if (!el) return
				connectors.create(ref, buildFinalElement(el))
			}}
			className='group relative flex h-27 w-27 cursor-pointer flex-col items-center justify-between rounded-xl border border-gray-200 bg-white p-2 text-[14px] transition hover:shadow'
			onClick={onClick}
			title={title}
		>
			<div className='flex flex-1 flex-col items-center justify-center'>
				<div className='flex h-6 w-6 items-center justify-center'>
					<Icon size='m' className='text-[var(--primary)]' />
				</div>
				<Text size='s' weight='regular' align='center'>
					{title}
				</Text>
			</div>
			<div className='flex justify-center pb-2'>
				<span
					className='inline-flex shrink-0 items-center justify-center'
					style={{ width: DRAG_ICON_PX, height: DRAG_ICON_PX, lineHeight: 0 }}
				>
					<IconDraggable
						size='s'
						className='rotate-90 transform text-gray-300'
						style={{ width: DRAG_ICON_PX, height: DRAG_ICON_PX, fontSize: DRAG_ICON_PX }}
						aria-hidden
					/>
				</span>
			</div>
		</div>
	)
}
