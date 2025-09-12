export type ContextMenuStatus = 'alert' | 'warning' | 'success'

export interface ContextMenuGroup {
	id: string | number
	label: string
}

export interface ContextMenuItem<Row = unknown> {
	key: string
	label: string
	leftIcon?: React.ComponentType<any>
	rightIcon?: React.ComponentType<any>
	status?: ContextMenuStatus
	groupId?: string | number
	disabled?: boolean
	onClick?: (row: Row) => void
	meta?: Record<string, unknown>
}
