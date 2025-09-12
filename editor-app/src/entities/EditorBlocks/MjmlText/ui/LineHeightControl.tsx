// LineHeightControl.tsx
import { Text as CUIText } from '@consta/uikit/Text'
import React from 'react'

import { StepperField } from '@/shared/ui'

import {
	computeFontPx,
	parseToOneDecimal,
	toMultiplier,
	toPropLineHeight
} from '@/entities/EditorBlocks/MjmlText/utils/lineHeight.utils'
import {
	DEFAULT_LINE_HEIGHT,
	LINE_HEIGHT_MIN,
	LINE_HEIGHT_STEP
} from '@/entities/EditorBlocks/constants.editor'

type TProps = {
	value: string | number | undefined
	fontSize: string | number | undefined
	onChange: (next: string) => void
	label?: string
	step?: number
	min?: number
}

export const LineHeightControl: React.FC<TProps> = ({
	value,
	fontSize,
	onChange,
	label = 'Интервал (межстрочный)',
	step = LINE_HEIGHT_STEP,
	min = LINE_HEIGHT_MIN
}) => {
	const fontPx = computeFontPx(fontSize)
	const current = toMultiplier(value, fontPx, DEFAULT_LINE_HEIGHT)

	return (
		<div className='flex items-center justify-between'>
			<CUIText size='s' weight='light' className='mb-1 text-gray-500'>
				{label}
			</CUIText>
			<StepperField
				label=''
				value={Number(current.toFixed(1))}
				step={step}
				min={min}
				onChange={(val: number | string) => {
					const parsed = parseToOneDecimal(val)
					if (parsed == null) return
					onChange(toPropLineHeight(parsed))
				}}
				placeholder='1,5'
			/>
		</div>
	)
}
