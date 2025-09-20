import type React from 'react'

export type TableWrapperProps = {
	children: React.ReactNode
	className?: string
	noVertScroll?: boolean
}

export function TableWrapper({
	children,
	className,
	noVertScroll = true
}: TableWrapperProps) {
	const cls =
		`${noVertScroll ? 'table-no-vert-scroll' : ''} w-full ${className || ''}`.trim()
	return <div className={cls}>{children}</div>
}
