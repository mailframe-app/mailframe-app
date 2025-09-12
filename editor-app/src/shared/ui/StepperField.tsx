import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import React from 'react'

interface StepperFieldProps {
	label?: string
	value: string | number
	min?: number
	max?: number
	step?: number
	onChange: (value: number) => void
	onChangeRaw?: (value: string) => void
	onBlur?: React.FocusEventHandler<HTMLInputElement>
	onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
	className?: string
	disabled?: boolean
	placeholder?: string
}

export const StepperField: React.FC<StepperFieldProps> = ({
	label,
	value,
	min = 0,
	max = 9999,
	step = 1,
	onChange,
	onChangeRaw,
	onBlur,
	onKeyDown,
	className,
	disabled = false,
	placeholder
}) => {
	const numericValue = Number(value) || 0

	const handleChange = (v: string | null) => {
		if (onChangeRaw) onChangeRaw(v ?? '')
		let n = parseInt((v ?? '').replace(/[^\d]/g, ''), 10) || 0
		if (n < min) n = min
		if (n > max) n = max
		if (onChange) onChange(n)
	}

	return (
		<div className={`flex flex-col items-start ${className || ''}`}>
			{label && (
				<Text view='secondary' size='xs' className='mb-1'>
					{label}
				</Text>
			)}
			<div className='flex items-center rounded-[6px] border border-gray-100'>
				<Button
					size='s'
					label='−'
					view='ghost'
					disabled={numericValue <= min || disabled}
					onClick={() => onChange(Math.max(numericValue - step, min))}
				/>
				<input
					type='text'
					value={value}
					onChange={e => handleChange(e.target.value)}
					onBlur={onBlur}
					onKeyDown={onKeyDown}
					disabled={disabled}
					placeholder={placeholder}
					style={{ width: '56px', textAlign: 'center' }}
					className='stepper-input-center'
				/>
				<Button
					size='s'
					label='+'
					view='ghost'
					disabled={numericValue >= max || disabled}
					onClick={() => onChange(Math.min(numericValue + step, max))}
				/>
			</div>
		</div>
	)
}
