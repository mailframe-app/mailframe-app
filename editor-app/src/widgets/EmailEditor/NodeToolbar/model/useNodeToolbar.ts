import { useEditor, useNode } from '@craftjs/core'
import type { DragEvent, MouseEvent } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { copyNode, useSaveNodeFeature } from '@/features/NodeActions'

import { MjmlBlock } from '@/entities/EditorBlocks'

export const useNodeToolbar = () => {
	const {
		id,
		dom,
		isHover,
		type,
		connectors: { drag }
	} = useNode(node => ({
		id: node.id,
		dom: node.dom,
		isHover: node.events.hovered,
		type: node.data.type
	}))

	const { actions, query } = useEditor()
	const { isActive, deletable } = useEditor((state, query) => {
		let deletable = false
		if (id && state.nodes[id]) {
			deletable = query.node(id).isDeletable()
		}
		return {
			isActive: id ? state.events.selected.has(id) : false,
			deletable
		}
	})

	const { saveNode } = useSaveNodeFeature()

	const isMjmlBlock = type === MjmlBlock

	const indicatorRef = useRef<HTMLDivElement>(null)
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const [isToolbarVisible, setToolbarVisible] = useState(false)

	useEffect(() => {
		if (dom) {
			if ((isActive || isHover || isToolbarVisible) && id !== 'ROOT') {
				dom.classList.add('component-selected')
				if (type === MjmlBlock) {
					dom.classList.add('mjml-block-selected')
				}
			} else {
				dom.classList.remove('component-selected')
				dom.classList.remove('mjml-block-selected')
			}
		}
	}, [dom, isActive, isHover, id, isToolbarVisible, type])

	useEffect(() => {
		if (timerRef.current) clearTimeout(timerRef.current)
		if (isHover) {
			setToolbarVisible(true)
		} else {
			timerRef.current = setTimeout(() => setToolbarVisible(false), 200)
		}
	}, [isHover])

	const handleToolbarMouseEnter = () => {
		if (timerRef.current) clearTimeout(timerRef.current)
	}

	const handleToolbarMouseLeave = () => {
		timerRef.current = setTimeout(() => setToolbarVisible(false), 200)
	}

	const getPos = useCallback(
		(domNode: HTMLElement) => {
			const { top, left, width, height } = domNode.getBoundingClientRect()

			return {
				top: isMjmlBlock ? `${top + height / 2}px` : `${top}px`,
				left: `${left + width + 8}px`
			}
		},
		[isMjmlBlock]
	)

	useEffect(() => {
		if (dom && indicatorRef.current && isToolbarVisible) {
			const { top, left } = getPos(dom)
			indicatorRef.current.style.top = top
			indicatorRef.current.style.left = left
		}
	}, [dom, getPos, isToolbarVisible])

	const handleDragStart = (e: DragEvent) => {
		e.stopPropagation()
		if (dom) {
			const { width } = dom.getBoundingClientRect()
			e.dataTransfer.setDragImage(dom, width, 0)
		}
	}

	const handleCopy = (e: MouseEvent) => {
		e.stopPropagation()
		copyNode(actions, query, id)
	}

	const handleSave = (e: MouseEvent) => {
		e.stopPropagation()
		saveNode(id)
	}

	const handleDelete = (e: MouseEvent) => {
		e.stopPropagation()
		if (deletable) actions.delete(id)
	}

	const dragRef = useCallback(
		(el: HTMLButtonElement | null) => {
			if (el) drag(el)
		},
		[drag]
	)

	return {
		id,
		deletable,
		isToolbarVisible,
		isMjmlBlock,
		indicatorRef,
		dragRef,
		handleToolbarMouseEnter,
		handleToolbarMouseLeave,
		handleDragStart,
		handleCopy,
		handleDelete,
		handleSave
	}
}
