import {
	ArrowLeftRight,
	ClipboardCheck,
	ClipboardCopy,
	ClipboardPaste,
	ClipboardPlus,
	Copy,
	GripVertical,
	Save,
	Trash2
} from 'lucide-react'
import React from 'react'
import ReactDOM from 'react-dom'

import { PanelButton } from '../../NodeToolbar/ui/PanelButton'
import '../styles/BlockToolbar.css'

import { BlockOverlay } from './BlockOverlay'

interface BlockToolbarProps {
	deletable: boolean
	isToolbarVisible: boolean
	isHover: boolean
	isActive: boolean
	isDragging: boolean
	overlayRef: React.RefObject<HTMLDivElement | null>
	actionsRef: React.RefObject<HTMLDivElement | null>
	dragRef: (el: HTMLElement | null) => void
	onDragStart: (e: React.DragEvent) => void
	onCopy: (e: React.MouseEvent) => void
	onDelete: (e: React.MouseEvent) => void
	onSave: (e: React.MouseEvent) => void
	onOverlayClick: (e: React.MouseEvent) => void
	onMouseEnter: () => void
	onMouseLeave: (e: React.MouseEvent) => void

	// операции с содержимым блока
	onCopyContent?: (e: React.MouseEvent) => void
	onCutContent?: (e: React.MouseEvent) => void
	onPasteAppend?: (e: React.MouseEvent) => void
	onPasteReplace?: (e: React.MouseEvent) => void
	onPasteMove?: (e: React.MouseEvent) => void
	onSwapWithSource?: (e: React.MouseEvent) => void
	canPaste?: boolean
	canSwap?: boolean
}

export const BlockToolbar = ({
	deletable,
	isToolbarVisible,
	isHover,
	isActive,
	isDragging,
	overlayRef,
	actionsRef,
	dragRef,
	onDragStart,
	onCopy,
	onDelete,
	onSave,
	onOverlayClick,
	onMouseEnter,
	onMouseLeave,
	onCopyContent,
	onPasteAppend,
	onPasteReplace,
	onPasteMove,
	onSwapWithSource,
	canPaste = false,
	canSwap = false
}: BlockToolbarProps) => {
	return (
		<>
			<BlockOverlay
				isHover={isHover}
				isActive={isActive}
				isDragging={isDragging}
				overlayRef={overlayRef}
				onClick={onOverlayClick}
			/>

			{isToolbarVisible &&
				ReactDOM.createPortal(
					<div
						ref={actionsRef}
						className='block-toolbar-actions fixed z-10 flex gap-1'
						onMouseEnter={onMouseEnter}
						onMouseLeave={onMouseLeave}
					>
						{/* Перетаскивание / Сохранить / Копия узла / Удалить */}
						<PanelButton
							title='Переместить'
							ref={dragRef}
							onDragStart={onDragStart}
							draggable
							className='drag-handle inline-flex items-center justify-center px-1 py-0.5'
							data-drag-handle='RenderNode'
						>
							<GripVertical size={16} />
						</PanelButton>

						<PanelButton title='Сохранить' onClick={onSave}>
							<Save size={16} />
						</PanelButton>

						<PanelButton title='Копировать узел' onClick={onCopy}>
							<Copy size={16} />
						</PanelButton>

						{deletable && (
							<PanelButton title='Удалить' onClick={onDelete}>
								<Trash2 size={16} />
							</PanelButton>
						)}

						{/* Контент блока */}
						{onCopyContent && (
							<>
								<span className='mx-1 h-4 w-px self-center bg-gray-200' />

								<PanelButton title='Копировать содержимое' onClick={onCopyContent}>
									<ClipboardCopy size={16} />
								</PanelButton>

								<PanelButton
									title='Вставить (добавить)'
									onClick={onPasteAppend}
									disabled={!canPaste}
								>
									<ClipboardPlus size={16} />
								</PanelButton>

								<PanelButton
									title='Заменить содержимое'
									onClick={onPasteReplace}
									disabled={!canPaste}
								>
									<ClipboardCheck size={16} />
								</PanelButton>

								<PanelButton
									title='Перенести сюда (вырезать из источника)'
									onClick={onPasteMove}
									disabled={!canPaste}
								>
									<ClipboardPaste size={16} />
								</PanelButton>

								<PanelButton
									title='Поменять содержимое местами с источником'
									onClick={onSwapWithSource}
									disabled={!canSwap}
								>
									<ArrowLeftRight size={16} />
								</PanelButton>
							</>
						)}
					</div>,
					document.body
				)}
		</>
	)
}
