import { Text as CUIText } from '@consta/uikit/Text'
import React from 'react'

type ColorControlProps = {
	label: string
	value?: string
	onChange: (value: string) => void
	fallback?: string
	className?: string
}

const isHex6 = (s: string) => /^#[0-9a-fA-F]{6}$/.test(s)

function normalizeColorInput(raw: string): string | null {
	const s = raw.trim().toLowerCase()

	const hex6 = /^#?[0-9a-f]{6}$/
	if (hex6.test(s)) return s.startsWith('#') ? s : `#${s}`

	const hex3 = /^#?([0-9a-f]{3})$/.exec(s)
	if (hex3) {
		const [r, g, b] = hex3[1].split('')
		return `#${r}${r}${g}${g}${b}${b}`
	}

	const rgb = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+)?\s*\)$/.exec(s)
	if (rgb) {
		const clamp = (n: number) => Math.max(0, Math.min(255, n))
		const to2 = (n: number) => clamp(n).toString(16).padStart(2, '0')
		const r = to2(Number(rgb[1]))
		const g = to2(Number(rgb[2]))
		const b = to2(Number(rgb[3]))
		return `#${r}${g}${b}`
	}

	return null
}

export const ColorControl: React.FC<ColorControlProps> = ({
	label,
	value,
	onChange,
	fallback = '#000000',
	className
}) => {
	const initial = value || fallback
	const [lastColor, setLastColor] = React.useState<string>(initial)
	const [textValue, setTextValue] = React.useState<string>(initial)

	React.useEffect(() => {
		const v = value || fallback
		setLastColor(v)
		setTextValue(v)
	}, [value, fallback])

	const applyIfValid = (input: string) => {
		const norm = normalizeColorInput(input)
		if (norm && isHex6(norm)) {
			setLastColor(norm)
			onChange(norm)
			return true
		}
		return false
	}

	const handleTextChange = (v: string) => {
		setTextValue(v)
		applyIfValid(v)
	}

	const handleTextBlur = () => {
		if (!isHex6(normalizeColorInput(textValue) || '')) {
			setTextValue(lastColor || fallback)
		}
	}

	const handlePaste: React.ClipboardEventHandler<HTMLInputElement> = e => {
		const clip = e.clipboardData.getData('text')
		const norm = normalizeColorInput(clip)
		if (norm) {
			e.preventDefault()
			setTextValue(norm)
			setLastColor(norm)
			onChange(norm)
		}
	}

	const handleColorPicker = (hex: string) => {
		setTextValue(hex)
		setLastColor(hex)
		onChange(hex)
	}

	const current = value || lastColor || fallback
	const invalid = textValue.length > 0 && !isHex6(normalizeColorInput(textValue) || '')

	return (
		<div className={className}>
			<div className='flex items-center justify-between'>
				<CUIText size='s' weight='light' className='mb-2 text-gray-500'>
					{label}
				</CUIText>

				<div className='mb-1 flex items-center gap-2 rounded-lg bg-[#F3F5F7] px-3 py-2'>
					<input
						type='color'
						value={normalizeColorInput(current) || fallback}
						onChange={e => handleColorPicker(e.target.value)}
						className='h-6 w-6 rounded border-none bg-transparent p-0'
					/>
					<input
						type='text'
						value={textValue}
						onChange={e => handleTextChange(e.target.value)}
						onBlur={handleTextBlur}
						onPaste={handlePaste}
						placeholder='#RRGGBB'
						className={`w-24 border-none bg-transparent text-sm font-medium text-[#23272F] focus:outline-none ${
							invalid ? 'outline outline-[#F33]' : ''
						}`}
						maxLength={32}
					/>
				</div>
			</div>
		</div>
	)
}
