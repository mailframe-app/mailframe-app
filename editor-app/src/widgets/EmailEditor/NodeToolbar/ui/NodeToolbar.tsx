import { Copy, GripVertical, Save, Trash2 } from 'lucide-react'
import React from 'react'
import ReactDOM from 'react-dom'

import type { NodeToolbarProps } from '../model/types'

import { PanelButton } from './PanelButton'

/** Прокрутить основной канвас */
function scrollCanvasBy(deltaY: number) {
	const canvas = document.querySelector('.editor-canvas') as HTMLElement | null
	if (canvas) canvas.scrollTop += deltaY
}

export const NodeToolbar = ({
	deletable,
	indicatorRef,
	dragRef,
	onMouseEnter,
	onMouseLeave,
	onDragStart,
	onCopy,
	onDelete,
	onSave
}: NodeToolbarProps) => {
	const [open, setOpen] = React.useState(false)

	// локальный ref + пробрасываем наружу (indicatorRef — всегда RefObject)
	const selfRef = React.useRef<HTMLDivElement | null>(null)
	const setBothRefs = React.useCallback(
		(node: HTMLDivElement | null) => {
			selfRef.current = node
			if (indicatorRef) {
				;(indicatorRef as React.RefObject<HTMLDivElement | null>).current = node
			}
		},
		[indicatorRef]
	)

	// авто-кламп по вертикали: чтобы тулбар всегда влезал в окно
	const clampIntoViewport = React.useCallback(() => {
		const el = selfRef.current
		if (!el) return
		el.style.transform = ''
		const pad = 8
		const r = el.getBoundingClientRect()
		let shiftY = 0
		if (r.bottom > window.innerHeight - pad) shiftY = window.innerHeight - pad - r.bottom
		if (r.top + shiftY < pad) shiftY += pad - (r.top + shiftY)
		if (Math.abs(shiftY) > 0.5) el.style.transform = `translateY(${Math.round(shiftY)}px)`
	}, [])

	React.useLayoutEffect(() => {
		if (!open) {
			if (selfRef.current) selfRef.current.style.transform = ''
			return
		}
		clampIntoViewport()
		const onResize = () => clampIntoViewport()
		window.addEventListener('resize', onResize)
		return () => window.removeEventListener('resize', onResize)
	}, [open, clampIntoViewport])

	// колёсико: если тулбар не скроллится сам, скроллим канвас
	const handleWheel: React.WheelEventHandler<HTMLDivElement> = e => {
		const el = e.currentTarget
		const canScrollSelf = el.scrollHeight > el.clientHeight
		if (!canScrollSelf) {
			scrollCanvasBy(e.deltaY)
			e.preventDefault()
			return
		}
		const atTop = el.scrollTop <= 0 && e.deltaY < 0
		const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1 && e.deltaY > 0
		if (atTop || atBottom) {
			scrollCanvasBy(e.deltaY)
			e.preventDefault()
		}
	}

	return ReactDOM.createPortal(
		<div
			ref={setBothRefs}
			onMouseEnter={() => {
				setOpen(true)
				onMouseEnter()
			}}
			onMouseLeave={() => {
				setOpen(false)
				onMouseLeave()
			}}
			onWheel={handleWheel}
			className={`fixed z-5 flex flex-col items-center transition-all duration-200 ${
				open
					? 'z-10 min-h-32 w-9 rounded-[4px] bg-[var(--accent)] p-1 opacity-100'
					: 'h-8 w-8 rounded-[4px] bg-[var(--accent)] opacity-50'
			} max-h-[calc(100vh-12px)] overflow-y-auto`}
		>
			<PanelButton
				title='Переместить'
				ref={dragRef}
				onDragStart={onDragStart}
				data-drag-handle='RenderNode'
			>
				<GripVertical size={16} />
			</PanelButton>

			{open && (
				<>
					<PanelButton title='Сохранить' onClick={onSave}>
						<Save size={16} />
					</PanelButton>
					<PanelButton title='Копировать' onClick={onCopy}>
						<Copy size={16} />
					</PanelButton>
					{deletable ? (
						<PanelButton title='Удалить' onClick={onDelete}>
							<Trash2 size={16} />
						</PanelButton>
					) : null}
				</>
			)}
		</div>,
		document.body
	)
}
