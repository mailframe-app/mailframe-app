import { IconDraggable } from '@consta/icons/IconDraggable'
import { Text } from '@consta/uikit/Text'
import { Element, type NodeId, useEditor } from '@craftjs/core'
import React from 'react'

import type { ComponentItemProps } from '../model/types'

import { Container, MjmlBlock, MjmlColumn, MjmlSection, MjmlWrapper } from '@/entities/EditorBlocks'

/** Layout-компоненты, которые не оборачиваем в MjmlBlock */
const LAYOUT_WHITELIST: ReadonlySet<React.ElementType> = new Set([
	MjmlWrapper,
	MjmlSection,
	MjmlColumn,
	Container,
	MjmlBlock
])

type MaybeCraftMeta = {
	craft?: { meta?: { isLayout?: boolean } }
}

const isLayoutType = (t: React.ElementType | string): boolean => {
	if (typeof t === 'string') return false
	const metaIsLayout = (t as MaybeCraftMeta).craft?.meta?.isLayout === true
	return metaIsLayout || LAYOUT_WHITELIST.has(t)
}

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

const firstSelectedId = (sel: unknown): NodeId | null => {
	if (!sel) return null
	if (typeof sel === 'string') return sel as NodeId
	if (Array.isArray(sel)) return (sel[0] ?? null) as NodeId | null
	if (sel instanceof Set) {
		const arr = Array.from(sel as Set<NodeId>)
		return arr[0] ?? null
	}
	return null
}

export const ComponentItem: React.FC<ComponentItemProps> = ({
	icon: Icon,
	title,
	component,
	componentProps = {},
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	isCanvas: _isCanvas,
	onClick
}) => {
	const { connectors } = useEditor()

	const { selectedInsideBlock } = useEditor((state, query) => {
		const selectedId = firstSelectedId(state.events.selected as unknown)
		if (!selectedId) return { selectedInsideBlock: false }

		const selectedNode = query.node(selectedId).get()
		const selectedType = selectedNode?.data.type
		if (selectedType === MjmlBlock) return { selectedInsideBlock: true }

		try {
			const ancestors = query.node(selectedId).ancestors()
			const hasBlockAncestor = ancestors.some(a => query.node(a).get()?.data.type === MjmlBlock)
			return { selectedInsideBlock: hasBlockAncestor }
		} catch {
			return { selectedInsideBlock: false }
		}
	})

	const toElement = (): React.ReactElement | null => {
		if (!component) return null
		return React.isValidElement(component)
			? component
			: React.createElement(component as React.ElementType, componentProps)
	}

	const buildFinalElement = (rawEl: React.ReactElement): React.ReactElement => {
		const resolvedType = resolveType(rawEl)
		const isLayout = isLayoutType(resolvedType)
		const plain = normalizeToPlainElement(rawEl)

		if (isLayout) {
			return typeof resolvedType !== 'string' ? (
				<Element is={resolvedType} {...(plain.props as Record<string, unknown>)} canvas />
			) : (
				plain
			)
		}

		if (selectedInsideBlock) {
			return plain
		}

		return (
			<Element
				is={MjmlBlock}
				canvas
				align='left'
				widthPercent={100}
				paddingTop='0px'
				paddingRight='0px'
				paddingBottom='0px'
				paddingLeft='0px'
			>
				{plain}
			</Element>
		)
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
