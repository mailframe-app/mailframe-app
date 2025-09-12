import { Copy, GripVertical, Save, Trash2 } from 'lucide-react'
import React from 'react'
import ReactDOM from 'react-dom'

import { PanelButton } from '../../NodeToolbar/ui/PanelButton'
import '../styles/SectionToolbar.css'

import { SectionOverlay } from './SectionOverlay'

interface SectionToolbarProps {
	deletable: boolean
	isToolbarVisible: boolean
	isHover: boolean
	isActive: boolean
	overlayRef: React.RefObject<HTMLDivElement | null>
	dragButtonRef: React.RefObject<HTMLDivElement | null>
	actionsRef: React.RefObject<HTMLDivElement | null>
	leftEarRef: React.RefObject<HTMLDivElement | null>
	rightEarRef: React.RefObject<HTMLDivElement | null>
	dragRef: (el: HTMLButtonElement | null) => void
	onDragStart: (e: React.DragEvent) => void
	onCopy: (e: React.MouseEvent) => void
	onDelete: (e: React.MouseEvent) => void
	onSave: (e: React.MouseEvent) => void
	onOverlayClick: (e: React.MouseEvent) => void
	onMouseEnter: () => void
	onMouseLeave: (e: React.MouseEvent) => void
}

export const SectionToolbar = ({
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
	onDragStart,
	onCopy,
	onDelete,
	onSave,
	onOverlayClick,
	onMouseEnter,
	onMouseLeave
}: SectionToolbarProps) => {
	return (
		<>
			{/* Визуальный оверлей - только для отображения границ */}
			<SectionOverlay isHover={isHover} isActive={isActive} overlayRef={overlayRef} />

			{/* Левое "ухо" для выделения секции */}
			{ReactDOM.createPortal(
				<div
					ref={leftEarRef}
					className='hover-ear fixed z-[4]'
					onClick={onOverlayClick}
					onMouseEnter={onMouseEnter}
					onMouseLeave={onMouseLeave}
				/>,
				document.body
			)}

			{/* Правое "ухо" для выделения секции */}
			{ReactDOM.createPortal(
				<div
					ref={rightEarRef}
					className='hover-ear fixed z-[4]'
					onClick={onOverlayClick}
					onMouseEnter={onMouseEnter}
					onMouseLeave={onMouseLeave}
				/>,
				document.body
			)}

			{/* Кнопка перетаскивания (слева по центру) */}
			{isToolbarVisible &&
				ReactDOM.createPortal(
					<div
						ref={dragButtonRef}
						className='section-toolbar-drag fixed z-10'
						onMouseEnter={onMouseEnter}
						onMouseLeave={onMouseLeave}
					>
						<PanelButton
							title='Переместить секцию'
							ref={dragRef}
							onDragStart={onDragStart}
							data-drag-handle='RenderNode'
						>
							<GripVertical size={20} />
						</PanelButton>
					</div>,
					document.body
				)}

			{/* Группа кнопок действий (справа вверху) */}
			{isToolbarVisible &&
				ReactDOM.createPortal(
					<div
						ref={actionsRef}
						className='section-toolbar-actions fixed z-10 flex'
						onMouseEnter={onMouseEnter}
						onMouseLeave={onMouseLeave}
					>
						<PanelButton title='Сохранить' onClick={onSave}>
							<Save size={16} />
						</PanelButton>
						<PanelButton title='Копировать' onClick={onCopy}>
							<Copy size={16} />
						</PanelButton>
						{deletable && (
							<PanelButton title='Удалить' onClick={onDelete}>
								<Trash2 size={16} />
							</PanelButton>
						)}
					</div>,
					document.body
				)}
		</>
	)
}
