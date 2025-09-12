import { Text as CUIText } from '@consta/uikit/Text'
import React from 'react'

import { StepperField } from './StepperField'

export type MarginsType = {
	marginTop: string
	marginRight: string
	marginBottom: string
	marginLeft: string
}

type MarginsControlProps = {
	value: Partial<MarginsType>
	onChange: (value: MarginsType) => void
}

const SIDES: { side: keyof MarginsType; label: string }[] = [
	{ side: 'marginTop', label: 'Верх' },
	{ side: 'marginRight', label: 'Правая' },
	{ side: 'marginBottom', label: 'Низ' },
	{ side: 'marginLeft', label: 'Левая' }
]

export const MarginsControl: React.FC<MarginsControlProps> = ({ value, onChange }) => {
	// Возвращает объект с заполненными всеми полями
	const getSafeMargins = (v: Partial<MarginsType>): MarginsType => ({
		marginTop: v.marginTop ?? '0px',
		marginRight: v.marginRight ?? '0px',
		marginBottom: v.marginBottom ?? '0px',
		marginLeft: v.marginLeft ?? '0px'
	})

	const handleChange = (side: keyof MarginsType, newValue: string | number) => {
		const numeric = Number(newValue) || 0
		onChange({
			...getSafeMargins(value),
			[side]: `${numeric}px`
		})
	}

	const safeValue = getSafeMargins(value)

	return (
		<div className='space-y-3'>
			<CUIText size='s' view='primary' weight='light' className='truncate'>
				Внешние отступы
			</CUIText>
			<div className='grid w-full grid-cols-2 gap-x-4 gap-y-2 text-xs'>
				{SIDES.map(({ side, label }) => (
					<div className='flex flex-col items-start gap-2' key={side}>
						<CUIText size='s' view='primary' weight='light' className='w-8'>
							{label}
						</CUIText>{' '}
						<StepperField
							value={String(parseInt(safeValue[side]) || 0)}
							onChange={val => handleChange(side, val)}
							className='w-12 text-center'
						/>
					</div>
				))}
			</div>
		</div>
	)
}
