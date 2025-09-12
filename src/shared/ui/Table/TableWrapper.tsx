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
		`${noVertScroll ? 'table-no-vert-scroll' : ''} w-full rounded-md border border-[var(--color-bg-border)] ${className || ''}`.trim()
	return <div className={cls}>{children}</div>
}
