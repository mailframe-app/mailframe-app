import { Text as CUIText } from '@consta/uikit/Text'
import React from 'react'

import { StepperField } from './StepperField'

export type PaddingsType = {
	paddingTop: string
	paddingRight: string
	paddingBottom: string
	paddingLeft: string
}

type PaddingsControlProps = {
	value: Partial<PaddingsType>
	onChange: (value: PaddingsType) => void
}

const SIDES: { side: keyof PaddingsType; label: string }[] = [
	{ side: 'paddingTop', label: 'Верх' },
	{ side: 'paddingRight', label: 'Правая' },
	{ side: 'paddingBottom', label: 'Низ' },
	{ side: 'paddingLeft', label: 'Левая' }
]

export const PaddingsControl: React.FC<PaddingsControlProps> = ({ value, onChange }) => {
	const getSafePaddings = (v: Partial<PaddingsType>): PaddingsType => ({
		paddingTop: v.paddingTop ?? '0px',
		paddingRight: v.paddingRight ?? '0px',
		paddingBottom: v.paddingBottom ?? '0px',
		paddingLeft: v.paddingLeft ?? '0px'
	})

	const handleChange = (side: keyof PaddingsType, newValue: string | number) => {
		const numeric = Number(newValue) || 0
		onChange({
			...getSafePaddings(value),
			[side]: `${numeric}px`
		})
	}

	const safeValue = getSafePaddings(value)

	return (
		<div className='space-y-3'>
			<CUIText size='s' weight='light' className='truncate text-gray-500'>
				Отступы
			</CUIText>
			<div className='grid w-full grid-cols-2 gap-x-4 gap-y-2 text-xs'>
				{SIDES.map(({ side, label }) => (
					<div className='flex flex-col items-start gap-2' key={side}>
						<CUIText size='s' weight='light' className='w-full text-gray-500'>
							{label}
						</CUIText>
						<StepperField
							value={String(parseInt(safeValue[side]) || 0)}
							onChange={val => handleChange(side, val)}
							className='w-16 text-center'
						/>
					</div>
				))}
			</div>
		</div>
	)
}
