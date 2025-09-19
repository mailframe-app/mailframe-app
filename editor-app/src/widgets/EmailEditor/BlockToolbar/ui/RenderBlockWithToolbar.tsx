import { useNode } from '@craftjs/core'
import React, { useEffect } from 'react'

import { useBlockTransfer } from '@/features/BlockTransfer'

import { useBlockToolbar } from '../model/useBlockToolbar'
import '../styles/BlockToolbar.css'

import { BlockToolbar } from './BlockToolbar'

interface RenderBlockWithToolbarProps {
	children: React.ReactNode
}

export const RenderBlockWithToolbar = ({ children }: RenderBlockWithToolbarProps) => {
	const { id } = useNode(node => ({ id: node.id }))

	const {
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
		handleMouseLeave
	} = useBlockToolbar()

	// буфер содержимого блока
	const { copyFromBlock, pasteIntoBlock, hasClipboard, getClipboardInfo } = useBlockTransfer()
	const canPaste = hasClipboard()
	const info = getClipboardInfo()
	const canSwap = canPaste && !!info.sourceBlockId && info.sourceBlockId !== id

	// кнопки «контент» (делаем stopPropagation, чтобы не ловить выделения Craft)
	const onCopyContent = (e: React.MouseEvent) => {
		e.stopPropagation()
		copyFromBlock(id)
	}
	const onPasteAppend = (e: React.MouseEvent) => {
		e.stopPropagation()
		pasteIntoBlock(id, 'append')
	}
	const onPasteReplace = (e: React.MouseEvent) => {
		e.stopPropagation()
		pasteIntoBlock(id, 'replace')
	}
	const onPasteMove = (e: React.MouseEvent) => {
		e.stopPropagation()
		pasteIntoBlock(id, 'move')
	}
	const onSwapWithSource = (e: React.MouseEvent) => {
		e.stopPropagation()
		pasteIntoBlock(id, 'swap')
	}

	// хоткеи
	useEffect(() => {
		if (!isActive) return
		const onKeyDown = (ev: KeyboardEvent) => {
			const meta = ev.metaKey || ev.ctrlKey
			const shift = ev.shiftKey
			const alt = ev.altKey
			const key = ev.key.toLowerCase()

			if (meta && key === 'c' && !shift && !alt) {
				ev.preventDefault()
				copyFromBlock(id)
				return
			}
			if (meta && key === 'v' && !shift && !alt && canPaste) {
				ev.preventDefault()
				pasteIntoBlock(id, 'append')
				return
			}
			if (meta && key === 'v' && shift && !alt && canPaste) {
				ev.preventDefault()
				pasteIntoBlock(id, 'replace')
				return
			}
			if (!meta && key === 'v' && !shift && alt && canPaste) {
				ev.preventDefault()
				pasteIntoBlock(id, 'move')
				return
			}
			if (meta && key === 'v' && !shift && alt && canSwap) {
				ev.preventDefault()
				pasteIntoBlock(id, 'swap')
				return
			}
		}
		window.addEventListener('keydown', onKeyDown, true)
		return () => window.removeEventListener('keydown', onKeyDown, true)
	}, [id, isActive, canPaste, canSwap, copyFromBlock, pasteIntoBlock])

	return (
		<>
			{children}
			<BlockToolbar
				deletable={deletable}
				isToolbarVisible={isToolbarVisible}
				isHover={isHover}
				isActive={isActive}
				isDragging={isDragging}
				overlayRef={overlayRef}
				actionsRef={actionsRef}
				dragRef={dragRef as unknown as (el: HTMLElement | null) => void}
				onDragStart={handleDragStart}
				onCopy={e => {
					e.stopPropagation()
					handleCopy(e)
				}}
				onDelete={e => {
					e.stopPropagation()
					handleDelete(e)
				}}
				onSave={e => {
					e.stopPropagation()
					handleSave(e)
				}}
				onOverlayClick={handleOverlayClick}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				// контентные операции
				onCopyContent={onCopyContent}
				onPasteAppend={onPasteAppend}
				onPasteReplace={onPasteReplace}
				onPasteMove={onPasteMove}
				onSwapWithSource={onSwapWithSource}
				canPaste={canPaste}
				canSwap={canSwap}
			/>
		</>
	)
}
