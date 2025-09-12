import type { CSSProperties, ReactNode } from 'react'

export interface ModalApi {
	close: () => void
}

export type ModalRender = (api: ModalApi) => ReactNode

export interface ModalInstance {
	id: string
	render: ModalRender
}

export interface ContentModalOptions {
	title?: ReactNode
	description?: ReactNode
	content?: ReactNode
	footer?: ReactNode
	containerClassName?: string
	closeButton?: boolean
	hasOverlay?: boolean
	onClickOutside?: () => void
	headerAlign?: 'left' | 'center' | 'right'
}

export type ConfirmTone = 'default' | 'alert'

export interface ConfirmModalOptions {
	title?: ReactNode
	description?: ReactNode
	confirmLabel?: string
	cancelLabel?: string
	onConfirm: () => void | Promise<void>
	containerClassName?: string
	closeButton?: boolean
	hasOverlay?: boolean
	confirmTone?: ConfirmTone
	confirmButtonStyle?: CSSProperties
	headerAlign?: 'left' | 'center' | 'right'
}

export type DeleteModalOptions = Omit<
	ConfirmModalOptions,
	'title' | 'description' | 'confirmLabel'
> & {
	title?: ReactNode
	description?: ReactNode
	confirmLabel?: string
}
