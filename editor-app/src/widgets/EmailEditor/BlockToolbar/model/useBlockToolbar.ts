import { useEditor, useNode } from '@craftjs/core'
import type { DragEvent, MouseEvent } from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

import { useBlockTransfer } from '@/features/BlockTransfer'
import { copyNode, useSaveNodeFeature } from '@/features/NodeActions'

export const useBlockToolbar = () => {
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
	const { isActive, deletable, isDragging } = useEditor((state, query) => {
		let deletable = false
		if (id && state.nodes[id]) {
			deletable = query.node(id).isDeletable()
		}
		return {
			isActive: id ? state.events.selected.has(id) : false,
			deletable,
			isDragging: state.events.dragged.size > 0
		}
	})

	const { saveNode } = useSaveNodeFeature()

	const overlayRef = useRef<HTMLDivElement>(null)
	const actionsRef = useRef<HTMLDivElement>(null)

	const [isHover, setIsHover] = useState(false)
	const [isToolbarVisible, setToolbarVisible] = useState(false)

	useEffect(() => {
		setToolbarVisible(isHover || isActive)
	}, [isHover, isActive])

	const handleMouseEnter = useCallback(() => {
		setIsHover(true)
	}, [])

	const handleMouseLeave = useCallback(() => {
		setIsHover(false)
	}, [])

	useEffect(() => {
		if (dom) {
			dom.addEventListener('mouseenter', handleMouseEnter)
			dom.addEventListener('mouseleave', handleMouseLeave)

			return () => {
				dom.removeEventListener('mouseenter', handleMouseEnter)
				dom.removeEventListener('mouseleave', handleMouseLeave)
			}
		}
	}, [dom, handleMouseEnter, handleMouseLeave])

	const updateOverlayPosition = useCallback(() => {
		if (!dom) return
		const rect = dom.getBoundingClientRect()

		if (overlayRef.current) {
			overlayRef.current.style.position = 'fixed'
			overlayRef.current.style.top = `${rect.top}px`
			overlayRef.current.style.left = `${rect.left}px`
			overlayRef.current.style.width = `${rect.width}px`
			overlayRef.current.style.height = `${rect.height}px`
		}
		if (actionsRef.current) {
			actionsRef.current.style.position = 'fixed'
			const actionsWidth = actionsRef.current.getBoundingClientRect().width || 0
			const actionsTop = rect.top - 28 // 28px — высота кнопок + отступ
			const actionsLeft = rect.right - actionsWidth
			actionsRef.current.style.top = `${actionsTop}px`
			actionsRef.current.style.left = `${actionsLeft}px`
		}
	}, [dom])

	useLayoutEffect(() => {
		if (!isToolbarVisible) return
		updateOverlayPosition()
	}, [isToolbarVisible, isActive, isHover, nodes, updateOverlayPosition])

	useEffect(() => {
		if (!isToolbarVisible) return
		const handler = () => updateOverlayPosition()
		window.addEventListener('scroll', handler, true)
		window.addEventListener('resize', handler)
		return () => {
			window.removeEventListener('scroll', handler, true)
			window.removeEventListener('resize', handler)
		}
	}, [isToolbarVisible, updateOverlayPosition])

	const handleDragStart = (e: DragEvent) => {
		e.stopPropagation()
		if (dom) {
			const rect = dom.getBoundingClientRect()
			e.dataTransfer.setDragImage(dom, 0, 0)
			console.log(
				'%cUI DRAG START (BlockToolbar)',
				'background:#7c3aed;color:#fff;padding:2px 6px;border-radius:4px',
				{
					id,
					rect: { top: rect.top, left: rect.left, w: rect.width, h: rect.height }
				}
			)
		} else {
			console.log(
				'%cUI DRAG START (BlockToolbar)',
				'background:#7c3aed;color:#fff;padding:2px 6px;border-radius:4px',
				{ id, noDom: true }
			)
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

	const handleOverlayClick = (e: MouseEvent) => {
		e.stopPropagation()
		actions.selectNode(id)
	}

	const dragRef = useCallback(
		(el: HTMLElement | null) => {
			if (el) drag(el)
		},
		[drag]
	)

	// интеграция переноса содержимого блока
	const { copyFromBlock, pasteIntoBlock, hasClipboard, getClipboardInfo } = useBlockTransfer()

	const handleCopyContent = useCallback(
		(e: MouseEvent) => {
			e.stopPropagation()
			copyFromBlock(id)
		},
		[copyFromBlock, id]
	)

	const handlePasteAppend = useCallback(
		(e: MouseEvent) => {
			e.stopPropagation()
			pasteIntoBlock(id, 'append')
		},
		[pasteIntoBlock, id]
	)

	const handlePasteReplace = useCallback(
		(e: MouseEvent) => {
			e.stopPropagation()
			pasteIntoBlock(id, 'replace')
		},
		[pasteIntoBlock, id]
	)

	const handlePasteMove = useCallback(
		(e: MouseEvent) => {
			e.stopPropagation()
			pasteIntoBlock(id, 'move')
		},
		[pasteIntoBlock, id]
	)

	const handleSwapWithClipboardSource = useCallback(
		(e: MouseEvent) => {
			e.stopPropagation()
			pasteIntoBlock(id, 'swap')
		},
		[pasteIntoBlock, id]
	)

	const clip = getClipboardInfo()
	const canPaste = hasClipboard()
	const canSwap = !!clip.sourceBlockId && canPaste && clip.sourceBlockId !== id

	return {
		id,
		deletable,
		isToolbarVisible,
		isHover,
		isActive,
		isDragging,
		overlayRef,
		actionsRef,
		dragRef,
		handleDragStart,
		handleCopy,
		handleDelete,
		handleSave,
		handleOverlayClick,
		handleMouseEnter,
		handleMouseLeave,

		canPaste,
		canSwap,
		handleCopyContent,
		handlePasteAppend,
		handlePasteReplace,
		handlePasteMove,
		handleSwapWithClipboardSource
	}
}
