import type { DragEvent, MouseEvent } from 'react'

export interface NodeToolbarProps {
	deletable: boolean
	indicatorRef: React.RefObject<HTMLDivElement | null>
	dragRef: (el: HTMLButtonElement | null) => void
	onMouseEnter: () => void
	onMouseLeave: () => void
	onDragStart: (e: DragEvent) => void
	onCopy: (e: MouseEvent) => void
	onDelete: (e: MouseEvent) => void
	onSave: (e: MouseEvent) => void
}

export interface ToolbarPosition {
	top: string
	left: string
}

export interface ToolbarState {
	isVisible: boolean
	position: ToolbarPosition
}

export interface UseNodeToolbarReturn {
	id: string
	deletable: boolean
	isToolbarVisible: boolean
	indicatorRef: React.RefObject<HTMLDivElement | null>
	dragRef: (el: HTMLButtonElement | null) => void
	handleToolbarMouseEnter: () => void
	handleToolbarMouseLeave: () => void
	handleDragStart: (e: DragEvent) => void
	handleCopy: (e: MouseEvent) => void
	handleDelete: (e: MouseEvent) => void
	handleSave: (e: MouseEvent) => void
}

export type PanelButtonProps = {
	title?: string
	children: React.ReactNode
	onClick?: (e: React.MouseEvent) => void
	onDragStart?: (e: React.DragEvent) => void
	className?: string
} & React.HTMLAttributes<HTMLButtonElement>

export type RenderNodeProps = {
	render: React.ReactElement
}
