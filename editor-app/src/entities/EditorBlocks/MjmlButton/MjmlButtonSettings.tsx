import { Text as CUIText } from '@consta/uikit/Text'
import { TextField } from '@consta/uikit/TextField'
import { useNode } from '@craftjs/core'
import React from 'react'

import { BackgroundControl, ColorControl } from '@/shared/ui'
import { AlignButtons } from '@/shared/ui/AlignButtons/AlignButtons'
import { PaddingsControl } from '@/shared/ui/PaddingControl'
import { RadiusField } from '@/shared/ui/RadiusField'
import { StepperField } from '@/shared/ui/StepperField'

import { ALIGN_OPTIONS } from '../constants.editor'

import type { MjmlButtonProps } from './MjmlButton.types'

export const MjmlButtonSettings: React.FC = () => {
	const {
		actions: { setProp },
		props
	} = useNode(node => ({
		props: node.data.props
	}))

	const [widthInput, setWidthInput] = React.useState(
		props.width === 'auto' ? '' : String(props.width || '').replace(/px$/, '')
	)
	const [heightInput, setHeightInput] = React.useState(
		props.height === 'auto' ? '' : String(props.height || '').replace(/px$/, '')
	)

	return (
		<div className='space-y-4'>
			{/* Текст кнопки */}
			<div className='flex items-center justify-between'>
				<CUIText
					size='s'
					weight='light'
					view='primary'
					className='w-[150px] truncate text-gray-500'
				>
					Текст кнопки
				</CUIText>
				<TextField
					value={props.text}
					onChange={value => setProp((p: MjmlButtonProps) => (p.text = value || ''))}
					size='s'
					view='clear'
					className='rounded-lg bg-[#F3F5F7] pl-[15px] text-gray-500'
				/>
			</div>

			{/* URL */}
			<div className='flex items-center justify-between'>
				<CUIText size='s' view='primary' weight='light' className='w-[80px] truncate text-gray-500'>
					URL <span className='text-red-500'>*</span>
				</CUIText>
				<TextField
					value={props.url}
					onChange={value => setProp((p: MjmlButtonProps) => (p.url = value || ''))}
					size='s'
					view='clear'
					className='rounded-lg bg-[#F3F5F7] pl-[15px]'
					placeholder='Введите ссылку'
				/>
			</div>

			{/* Цвет текста */}
			<ColorControl
				label='Цвет текста'
				value={props.color || '#ffffff'}
				fallback='#ffffff'
				onChange={val =>
					setProp((p: MjmlButtonProps) => {
						p.color = val
					})
				}
			/>

			{/* Цвет фона */}
			<BackgroundControl
				value={props.backgroundColor || '#007bff'}
				onChange={val =>
					setProp((p: MjmlButtonProps) => {
						p.backgroundColor = val
					})
				}
				label='Цвет фона'
				transparentLabel='Прозрачный фон'
				defaultColor='#007bff'
			/>

			{/* Скругление углов */}
			<RadiusField
				value={props.borderRadius}
				allowAuto={false}
				onChange={next =>
					setProp((p: MjmlButtonProps) => {
						p.borderRadius = next
					})
				}
			/>

			{/* Размер кнопки */}
			<div className='space-y-3'>
				<CUIText
					size='s'
					weight='light'
					view='primary'
					className='w-[160px] truncate text-gray-500'
				>
					Размер кнопки
				</CUIText>
				<div className='flex items-center justify-between'>
					<div className='flex flex-col items-start gap-2'>
						<CUIText size='s' view='primary' weight='light' className='truncate text-gray-500'>
							Ширина
						</CUIText>
						<StepperField
							value={widthInput}
							onChange={n => {
								setWidthInput(String(n))
								setProp((p: MjmlButtonProps) => (p.width = n ? `${n}px` : 'auto'))
							}}
							placeholder='auto'
						/>
					</div>
					<div className='flex flex-col items-start gap-2'>
						<CUIText size='s' view='primary' weight='light' className='truncate text-gray-500'>
							Высота
						</CUIText>
						<StepperField
							value={heightInput}
							onChange={n => {
								setHeightInput(String(n))
								setProp((p: MjmlButtonProps) => (p.height = n ? `${n}px` : 'auto'))
							}}
							placeholder='auto'
						/>
					</div>
				</div>
			</div>

			{/* Выравнивание */}
			<div className='flex justify-between gap-2'>
				<CUIText size='s' view='primary' weight='light' className='truncate text-gray-500'>
					Выравнивание
				</CUIText>
				<AlignButtons
					options={ALIGN_OPTIONS}
					value={props.align}
					onChange={newValue =>
						setProp((p: MjmlButtonProps) => {
							p.align = newValue
						})
					}
				/>
			</div>

			{/* Внешние отступы */}
			<PaddingsControl
				value={{
					paddingTop: props.paddingTop,
					paddingRight: props.paddingRight,
					paddingBottom: props.paddingBottom,
					paddingLeft: props.paddingLeft
				}}
				onChange={paddings => {
					setProp((p: MjmlButtonProps) => {
						p.paddingTop = paddings.paddingTop
						p.paddingRight = paddings.paddingRight
						p.paddingBottom = paddings.paddingBottom
						p.paddingLeft = paddings.paddingLeft
					})
				}}
			/>
		</div>
	)
}
