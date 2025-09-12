import { Text as CUIText } from '@consta/uikit/Text'
import React from 'react'

import { StepperField } from '@/shared/ui/StepperField'

type RadiusFieldProps = {
	value?: string | number
	onChange: (next: string) => void
	label?: string
	min?: number
	max?: number
	step?: number
	allowAuto?: boolean
	className?: string
}

const toInputValue = (v?: string | number): string => {
	if (v == null) return ''
	if (typeof v === 'number') return String(v)
	const s = String(v)
	if (s.trim() === 'auto') return ''
	const m = s.match(/^-?\d+(\.\d+)?/)
	return m ? m[0] : ''
}

const toCssPx = (raw: string, allowAuto: boolean): string => {
	const trimmed = raw.trim()
	if (allowAuto && trimmed === '') return 'auto'
	const n = Number(trimmed)
	if (!Number.isFinite(n)) return allowAuto ? 'auto' : '0px'
	return `${n}px`
}

export const RadiusField: React.FC<RadiusFieldProps> = ({
	value,
	onChange,
	label = 'Скругление углов',
	min = 0,
	max = 1000,
	step = 1,
	allowAuto = true,
	className
}) => {
	const [input, setInput] = React.useState<string>(toInputValue(value))

	React.useEffect(() => {
		setInput(toInputValue(value))
	}, [value])

	const handleChange = (n: number) => {
		const clamped = Math.max(min, Math.min(max, n))
		setInput(String(clamped))
		onChange(`${clamped}px`)
	}

	const handleChangeRaw = (v: string | number) => setInput(String(v ?? ''))

	const handleBlur = () => {
		onChange(toCssPx(input, allowAuto))
	}

	const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = e => {
		if (e.key === 'Enter') handleBlur()
	}

	return (
		<div className={`flex items-center justify-between ${className ?? ''}`}>
			<CUIText size='s' weight='light' className='w-[160px] truncate text-gray-500'>
				{label}
			</CUIText>
			<StepperField
				value={input}
				min={min}
				max={max}
				step={step}
				onChange={handleChange}
				onChangeRaw={handleChangeRaw}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
				placeholder={allowAuto ? 'auto' : undefined}
			/>
		</div>
	)
}
