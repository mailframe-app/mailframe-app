import type { TableRenderHeaderCell } from '@consta/table/Table'
import type React from 'react'

import { TableHeaderCell } from './HeaderCell'

export type BuildHeaderOptions = {
	label?: React.ReactNode
	control?: React.ReactNode
	rightControls?: React.ReactNode | React.ReactNode[]
	className?: string
}

export function buildHeader(opts: BuildHeaderOptions): TableRenderHeaderCell {
	return props => (
		<TableHeaderCell
			label={opts.label ?? props.title}
			control={opts.control}
			rightControls={opts.rightControls}
			className={opts.className}
		/>
	)
}
