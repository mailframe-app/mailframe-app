import { IconDraggable } from '@consta/icons/IconDraggable'
import { Text } from '@consta/uikit/Text'
import { Element, useEditor } from '@craftjs/core'
import React from 'react'

import type { ComponentItemProps } from '../model/types'

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

export const ComponentItem: React.FC<ComponentItemProps> = ({
	icon: Icon,
	title,
	component,
	componentProps = {},
	isCanvas,
	onClick
}) => {
	const { connectors, query } = useEditor()

	const toElement = (): React.ReactElement | null => {
		if (!component) return null
		return React.isValidElement(component)
			? component
			: React.createElement(component as React.ElementType, componentProps)
	}

	const buildFinalElement = (rawEl: React.ReactElement): React.ReactElement => {
		const resolvedType = resolveType(rawEl) as React.ElementType
		const plain = normalizeToPlainElement(rawEl)
		return <Element is={resolvedType} {...(plain.props as {})} canvas={isCanvas} />
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
			onDragEnd={e => {
				const el = toElement()
				if (!el) return

				const draggedType = resolveType(el) as React.ElementType
				const draggedName = typeof draggedType === 'function' ? draggedType.name : draggedType
				const elementUnder = document.elementFromPoint(e.clientX, e.clientY)

				if (elementUnder) {
					const craftElement = elementUnder.closest('[data-craft-component]')
					if (craftElement) {
						const targetType = craftElement.getAttribute('data-craft-component') || 'UNKNOWN'
						let shouldWrap = false
						let wrapInfo = ''

						if (targetType === 'Container' && draggedName !== 'MjmlSection') {
							if (draggedName === 'MjmlBlock') {
								shouldWrap = true
								wrapInfo = 'в Секцию'
							} else {
								shouldWrap = true
								wrapInfo = 'в Секция→Блок'
							}
						}

						if (shouldWrap) {
							console.log(
								`%c🎯 ДРОП: ${draggedName} -> ${targetType} ❌ НУЖНО ОБОРАЧИВАТЬ ${wrapInfo}`,
								'font-weight: bold; color: red;'
							)
						} else {
							console.log(
								`%c🎯 ДРОП: ${draggedName} -> ${targetType} ✅ НЕ ОБОРАЧИВАЕМ`,
								'font-weight: bold; color: green;'
							)
						}
					} else {
						console.log(`%c❌ ДРОП: ${draggedName} -> НЕ НАЙДЕН CRAFT КОМПОНЕНТ`, 'color: red;')
					}
				}
			}}
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
