import { useEditor, useNode } from '@craftjs/core'
import type { DragEvent, MouseEvent } from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { copyNode, useSaveNodeFeature } from '@/features/NodeActions'

export const useNodeToolbar = () => {
	const {
		id,
		dom,
		isHover,
		connectors: { drag }
	} = useNode(node => ({
		id: node.id,
		dom: node.dom,
		isHover: node.events.hovered
	}))

	const { actions, query } = useEditor()
	const { nodes } = useEditor(state => ({ nodes: state.nodes }))
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

	const indicatorRef = useRef<HTMLDivElement>(null)
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
	const [isToolbarVisible, setToolbarVisible] = useState(false)

	useEffect(() => {
		if (dom) {
			if ((isActive || isHover || isToolbarVisible) && id !== 'ROOT') {
				dom.classList.add('component-selected')
			} else {
				dom.classList.remove('component-selected')
			}
		}
	}, [dom, isActive, isHover, id, isToolbarVisible])

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

	const updateIndicatorPosition = useCallback(() => {
		if (!dom || !indicatorRef.current) return
		const { top, left, width } = dom.getBoundingClientRect()
		indicatorRef.current.style.position = 'fixed'
		indicatorRef.current.style.top = `${top}px`
		indicatorRef.current.style.left = `${left + width + 8}px`
	}, [dom])

	useLayoutEffect(() => {
		if (!isToolbarVisible) return
		updateIndicatorPosition()
	}, [isToolbarVisible, isActive, isHover, nodes, updateIndicatorPosition])

	useEffect(() => {
		if (!isToolbarVisible) return
		const handler = () => updateIndicatorPosition()
		window.addEventListener('scroll', handler, true)
		window.addEventListener('resize', handler)
		return () => {
			window.removeEventListener('scroll', handler, true)
			window.removeEventListener('resize', handler)
		}
	}, [isToolbarVisible, updateIndicatorPosition])

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
