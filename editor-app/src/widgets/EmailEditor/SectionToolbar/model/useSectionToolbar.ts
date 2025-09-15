import { useEditor, useNode } from '@craftjs/core'
import type { DragEvent, MouseEvent as ReactMouseEvent } from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { copyNode, useSaveNodeFeature } from '@/features/NodeActions'

export const useSectionToolbar = () => {
	const {
		id,
		dom,
		connectors: { drag }
	} = useNode(node => ({
		id: node.id,
		dom: node.dom
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

	const overlayRef = useRef<HTMLDivElement>(null)
	const dragButtonRef = useRef<HTMLDivElement>(null)
	const actionsRef = useRef<HTMLDivElement>(null)
	const leftEarRef = useRef<HTMLDivElement>(null)
	const rightEarRef = useRef<HTMLDivElement>(null)

	const [isHover, setIsHover] = useState(false)
	const [isToolbarVisible, setToolbarVisible] = useState(false)

	useEffect(() => {
		setToolbarVisible(isHover || isActive)
	}, [isHover, isActive])

	const handleMouseEnter = useCallback(() => {
		if (!isActive) {
			setIsHover(true)
		}
	}, [isActive])

	// Обработчик нативного mouseleave
	const handleNativeMouseLeave = useCallback(
		(e: globalThis.MouseEvent) => {
			const rt = e.relatedTarget
			if (!(rt instanceof Node)) {
				setIsHover(false)
				return
			}
			const isMovingToOurComponent =
				dom?.contains(rt) ||
				dragButtonRef.current?.contains(rt) ||
				actionsRef.current?.contains(rt) ||
				leftEarRef.current?.contains(rt) ||
				rightEarRef.current?.contains(rt)

			if (!isMovingToOurComponent) {
				setIsHover(false)
			}
		},
		[dom]
	)

	const handleMouseLeave = useCallback(
		(e: ReactMouseEvent) => handleNativeMouseLeave(e.nativeEvent),
		[handleNativeMouseLeave]
	)

	useEffect(() => {
		if (dom) {
			const handleMouseOverListener = (e: globalThis.MouseEvent) => {
				if (!isActive && e.target === dom) {
					setIsHover(true)
				} else if (e.target !== dom) {
					setIsHover(false)
				}
			}

			const handleMouseLeaveListener = (e: globalThis.MouseEvent) => handleNativeMouseLeave(e)

			const handleClickCapture = (e: Event) => {
				if (e.target !== dom) {
					e.stopPropagation()
				}
			}

			dom.addEventListener('mouseover', handleMouseOverListener as EventListener)
			dom.addEventListener('mouseleave', handleMouseLeaveListener as EventListener)
			dom.addEventListener('click', handleClickCapture, true)

			return () => {
				dom.removeEventListener('mouseover', handleMouseOverListener as EventListener)
				dom.removeEventListener('mouseleave', handleMouseLeaveListener as EventListener)
				dom.removeEventListener('click', handleClickCapture, true)
			}
		}
	}, [dom, isActive, handleNativeMouseLeave])

	const updateOverlayPosition = useCallback(() => {
		if (!dom) return
		const domRect = dom.getBoundingClientRect()
		const canvasElement = document.querySelector('.editor-canvas')
		const canvasRect = canvasElement?.getBoundingClientRect()
		if (!canvasRect) return

		const HORIZONTAL_PADDING = 16
		const overlayTop = domRect.top
		const overlayLeft = canvasRect.left + HORIZONTAL_PADDING
		const overlayWidth = canvasRect.width - 2 * HORIZONTAL_PADDING
		const overlayHeight = domRect.height

		if (overlayRef.current) {
			overlayRef.current.style.position = 'fixed'
			overlayRef.current.style.top = `${overlayTop}px`
			overlayRef.current.style.left = `${overlayLeft}px`
			overlayRef.current.style.width = `${overlayWidth}px`
			overlayRef.current.style.height = `${overlayHeight}px`
		}
		if (leftEarRef.current) {
			leftEarRef.current.style.position = 'fixed'
			leftEarRef.current.style.top = `${overlayTop}px`
			leftEarRef.current.style.left = `${canvasRect.left + HORIZONTAL_PADDING}px`
			leftEarRef.current.style.width = `${Math.max(0, domRect.left - (canvasRect.left + HORIZONTAL_PADDING))}px`
			leftEarRef.current.style.height = `${overlayHeight}px`
		}
		if (rightEarRef.current) {
			rightEarRef.current.style.position = 'fixed'
			rightEarRef.current.style.top = `${overlayTop}px`
			rightEarRef.current.style.left = `${domRect.right}px`
			rightEarRef.current.style.width = `${Math.max(0, canvasRect.left + canvasRect.width - HORIZONTAL_PADDING - domRect.right)}px`
			rightEarRef.current.style.height = `${overlayHeight}px`
		}
		if (isToolbarVisible) {
			const dragButtonTop = overlayTop + overlayHeight / 2
			const dragButtonLeft = overlayLeft + 8
			if (dragButtonRef.current) {
				dragButtonRef.current.style.position = 'fixed'
				dragButtonRef.current.style.top = `${dragButtonTop}px`
				dragButtonRef.current.style.left = `${dragButtonLeft}px`
			}
			const actionsTop = overlayTop + 8
			const actionsWidth = actionsRef.current?.getBoundingClientRect().width || 104
			const actionsRightPadding = 8
			const actionsLeft = overlayLeft + overlayWidth - actionsWidth - actionsRightPadding
			if (actionsRef.current) {
				actionsRef.current.style.position = 'fixed'
				actionsRef.current.style.top = `${actionsTop}px`
				actionsRef.current.style.left = `${actionsLeft}px`
			}
		}
	}, [dom, isToolbarVisible])

	useLayoutEffect(() => {
		if (!isToolbarVisible && !isHover && !isActive) return
		updateOverlayPosition()
	}, [isToolbarVisible, isHover, isActive, nodes, updateOverlayPosition])

	useEffect(() => {
		if (!isToolbarVisible && !isHover && !isActive) return
		const handler = () => updateOverlayPosition()
		window.addEventListener('scroll', handler, true)
		window.addEventListener('resize', handler)
		return () => {
			window.removeEventListener('scroll', handler, true)
			window.removeEventListener('resize', handler)
		}
	}, [isToolbarVisible, isHover, isActive, updateOverlayPosition])

	const handleDragStart = (e: DragEvent) => {
		e.stopPropagation()
		if (dom) {
			e.dataTransfer.setDragImage(dom, 0, 0)
		}
	}

	const handleCopy = (e: ReactMouseEvent) => {
		e.stopPropagation()
		copyNode(actions, query, id)
	}

	const handleSave = (e: ReactMouseEvent) => {
		e.stopPropagation()
		saveNode(id)
	}

	const handleDelete = (e: ReactMouseEvent) => {
		e.stopPropagation()
		if (deletable) actions.delete(id)
	}

	const handleOverlayClick = (e: ReactMouseEvent) => {
		e.stopPropagation()
		actions.selectNode(id)
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
		isHover,
		isActive,
		overlayRef,
		dragButtonRef,
		actionsRef,
		leftEarRef,
		rightEarRef,
		dragRef,
		handleDragStart,
		handleCopy,
		handleDelete,
		handleSave,
		handleOverlayClick,
		handleMouseEnter,
		handleMouseLeave
	}
}
