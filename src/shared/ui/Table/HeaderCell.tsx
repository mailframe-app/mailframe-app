import { HeaderDataCell } from '@consta/table/HeaderDataCell'
import { Text } from '@consta/uikit/Text'
import type React from 'react'

import { useTheme } from '@/features/theme'

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

	const { theme } = useTheme()

	return (
		<HeaderDataCell
			size='s'
			control={control}
			controlRight={right}
			className={className}
			style={{
				backgroundColor:
					theme === 'presetGpnDefault' ? '#F8FAFC' : 'var(--color-bg-stripe)'
			}}
		>
			{label != null ? (
				<Text
					weight='bold'
					style={{
						color:
							'var(--color-typo-secondary)!important' as React.CSSProperties['color']
					}}
				>
					{label}
				</Text>
			) : null}
		</HeaderDataCell>
	)
}
