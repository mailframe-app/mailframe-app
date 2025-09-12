import { Text } from '@consta/uikit/Text'
import React from 'react'

type TBackgroundValue = string // '#RRGGBB' | 'transparent'

export interface BackgroundControlProps {
	value: TBackgroundValue
	onChange: (value: TBackgroundValue) => void
	label?: string
	transparentLabel?: string
	defaultColor?: string
	className?: string
}

const isHex6 = (s: string) => /^#[0-9a-fA-F]{6}$/.test(s)

export const BackgroundControl: React.FC<BackgroundControlProps> = ({
	value,
	onChange,
	label = 'Фон блока',
	transparentLabel = 'Прозрачный фон',
	defaultColor = '#FFFFFF',
	className
}) => {
	const isTransparent = value === 'transparent'
	const initialColor = !isTransparent ? value : defaultColor

	const [lastColor, setLastColor] = React.useState<string>(initialColor)
	const [textValue, setTextValue] = React.useState<string>(initialColor)

	// Синхронизация при внешних изменениях
	React.useEffect(() => {
		if (value === 'transparent') {
			setTextValue(lastColor || defaultColor)
		} else {
			setLastColor(value)
			setTextValue(value)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value])

	const applyHexIfValid = (hex: string) => {
		if (isHex6(hex)) {
			setLastColor(hex)
			onChange(hex)
			return true
		}
		return false
	}

	const handleTextChange = (hex: string) => {
		setTextValue(hex)
		applyHexIfValid(hex)
	}

	const handleTextBlur = () => {
		if (!isHex6(textValue)) {
			const fallback = value === 'transparent' ? lastColor || defaultColor : value
			setTextValue(fallback)
		}
	}

	const handleColorPicker = (hex: string) => {
		setTextValue(hex)
		setLastColor(hex)
		onChange(hex)
	}

	const handleTransparentToggle = (checked: boolean) => {
		if (checked) {
			onChange('transparent')
		} else {
			onChange(lastColor || defaultColor)
		}
	}

	return (
		<div className={className}>
			<div className='flex items-center justify-between'>
				<Text size='s' weight='light' className='mb-2 text-gray-500'>
					{label}
				</Text>

				<div className='mb-1 flex items-center gap-2 rounded-lg bg-[#F3F5F7] px-3 py-2'>
					<input
						type='color'
						value={isTransparent ? lastColor || defaultColor : textValue}
						onChange={e => handleColorPicker(e.target.value)}
						className='h-6 w-6 rounded border-none bg-transparent p-0'
						disabled={isTransparent}
					/>
					<input
						type='text'
						value={textValue}
						onChange={e => handleTextChange(e.target.value)}
						onBlur={handleTextBlur}
						placeholder={isTransparent ? 'transparent' : '#RRGGBB'}
						className={`w-24 border-none bg-transparent text-sm font-medium text-[#23272F] focus:outline-none ${
							textValue && !isHex6(textValue) ? 'outline outline-[#F33]' : ''
						}`}
						maxLength={7}
					/>
				</div>
			</div>

			<label className='flex cursor-pointer items-center justify-end gap-2 text-sm text-gray-500'>
				<input
					type='checkbox'
					checked={isTransparent}
					onChange={e => handleTransparentToggle(e.target.checked)}
				/>
				{transparentLabel}
			</label>
		</div>
	)
}
