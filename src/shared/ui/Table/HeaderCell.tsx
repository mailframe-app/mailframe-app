import { HeaderDataCell } from '@consta/table/HeaderDataCell'
import { Text } from '@consta/uikit/Text'
import type React from 'react'

export type TableHeaderCellProps = {
	label?: React.ReactNode
	control?: React.ReactNode
	rightControls?: React.ReactNode | React.ReactNode[]
	className?: string
}

export function TableHeaderCell({
	label,
	control,
	rightControls,
	className
}: TableHeaderCellProps) {
	const right = Array.isArray(rightControls)
		? rightControls
		: rightControls
			? [rightControls]
			: undefined

	return (
		<HeaderDataCell
			size='s'
			control={control}
			controlRight={right}
			className={className}
		>
			{label != null ? (
				<Text
					view='brand'
					weight='semibold'
					style={{
						color:
							'var(--color-typo-brand)!important' as React.CSSProperties['color']
					}}
				>
					{label}
				</Text>
			) : null}
		</HeaderDataCell>
	)
}
