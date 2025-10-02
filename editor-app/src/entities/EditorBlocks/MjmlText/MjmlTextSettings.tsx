import { Button } from '@consta/uikit/Button'
import { Select } from '@consta/uikit/Select'
import { Text as CUIText } from '@consta/uikit/Text'
import { useNode } from '@craftjs/core'
import React from 'react'

import { ColorControl, PaddingsControl, StepperField } from '@/shared/ui'

import { ALIGN_OPTIONS_TEXT } from '../constants.editor'

import { LinkInsert } from './LinkInsert'
import type { MjmlTextProps } from './MjmlText.types'
import { LineHeightControl } from '@/entities/EditorBlocks/MjmlText/ui/LineHeightControl'

const textStyleOptions: {
	key: keyof Pick<MjmlTextProps, 'fontWeight' | 'fontStyle' | 'textDecoration'>
	isActive: (props: MjmlTextProps) => boolean
	toggle: (props: MjmlTextProps) => void
	label: string
}[] = [
	{
		key: 'fontWeight',
		isActive: props => props.fontWeight === 'bold',
		toggle: props => {
			props.fontWeight = props.fontWeight === 'bold' ? 'normal' : 'bold'
		},
		label: 'B'
	},
	{
		key: 'fontStyle',
		isActive: props => props.fontStyle === 'italic',
		toggle: props => {
			props.fontStyle = props.fontStyle === 'italic' ? 'normal' : 'italic'
		},
		label: 'I'
	},
	{
		key: 'textDecoration',
		isActive: props => props.textDecoration === 'underline',
		toggle: props => {
			props.textDecoration = props.textDecoration === 'underline' ? 'none' : 'underline'
		},
		label: 'U'
	}
]

export const MjmlTextSettings: React.FC = () => {
	const {
		actions: { setProp },
		props
	} = useNode(node => ({
		props: node.data.props as MjmlTextProps
	}))

	const { paddingTop, paddingRight, paddingBottom, paddingLeft } = props

	const fontOptions = [
		{ label: 'Arial', value: 'Arial' },
		{ label: 'Helvetica', value: 'Helvetica' },
		{ label: 'Verdana', value: 'Verdana' },
		{ label: 'Tahoma', value: 'Tahoma' },
		{ label: 'Courier New', value: 'Courier New' }
	]

	return (
		<div className='space-y-4'>
			{/* Стиль текста */}
			<div>
				<CUIText size='s' weight='light' className='mb-4' view='primary'>
					Стиль текста
				</CUIText>
				<div className='flex gap-2'>
					{[
						{ tag: 'h1', label: 'H1', defaultSize: 32 },
						{ tag: 'h2', label: 'H2', defaultSize: 24 },
						{ tag: 'h3', label: 'H3', defaultSize: 18 },
						{ tag: 'h4', label: 'H4', defaultSize: 16 },
						{ tag: 'p', label: 'Aa', defaultSize: 14 }
					].map(({ tag, label, defaultSize }) => (
						<Button
							key={tag}
							view={props.tag === tag ? 'primary' : 'ghost'}
							size='xs'
							onClick={() =>
								setProp((props: { tag: string; fontSize: string }) => {
									props.tag = tag
									props.fontSize = `${defaultSize}px`
								})
							}
							label={label}
							className='!p-0'
							style={{ width: '32px', height: '32px' }}
						/>
					))}
				</div>
			</div>
			{/* ВСТАВКА ССЫЛКИ */}
			<LinkInsert
				text={props.text || ''}
				onTextUpdate={newText =>
					setProp((p: { text: string }) => {
						p.text = newText
					})
				}
			/>

			{/* Шрифт */}
			<div className='flex items-center justify-between'>
				<CUIText size='s' weight='light' className='mb-1' view='primary'>
					Шрифт
				</CUIText>
				<div className='w-full py-2 pl-3'>
					<Select
						items={fontOptions}
						value={fontOptions.find(f => f.value === props.fontFamily)}
						onChange={value =>
							setProp((props: { fontFamily: string | undefined }) => {
								props.fontFamily = value?.value
							})
						}
						getItemKey={item => item.value}
						getItemLabel={item => item.label}
						size='s'
						className='w-full'
					/>
				</div>
			</div>
			{/* Размер шрифта */}
			<div className='flex items-center justify-between'>
				<CUIText size='s' weight='light' className='mb-1' view='primary'>
					Размер шрифта
				</CUIText>
				<StepperField
					label=''
					value={props.fontSize === 'auto' ? '' : String(props.fontSize).replace(/px$/, '')}
					onChange={n =>
						setProp((props: { fontSize: string }) => {
							props.fontSize = n ? `${n}px` : 'auto'
						})
					}
					placeholder='auto'
				/>
			</div>
			{/* Начертание */}
			<div className='flex items-center justify-between'>
				<CUIText size='s' weight='light' className='mb-1' view='primary'>
					Начертание
				</CUIText>
				<div className='flex gap-3.5'>
					{textStyleOptions.map(option => (
						<Button
							key={option.key}
							view={option.isActive(props) ? 'primary' : 'ghost'}
							size='s'
							className='!p-0'
							style={{ width: '32px', height: '32px' }}
							onClick={() => setProp(option.toggle)}
							label={option.label}
						/>
					))}
				</div>
			</div>
			{/* Выравнивание */}
			<div className='flex items-center justify-between'>
				<CUIText size='s' weight='light' className='mb-1' view='primary'>
					Выравнивание
				</CUIText>
				<div className='flex w-fit gap-3.5'>
					{ALIGN_OPTIONS_TEXT.map(align => (
						<Button
							key={align.value}
							view={props.textAlign === align.value ? 'primary' : 'ghost'}
							size='s'
							className='!p-0'
							style={{ width: '32px', height: '32px' }}
							onClick={() =>
								setProp((props: { textAlign: string }) => {
									props.textAlign = align.value
								})
							}
							iconLeft={align.Icon}
							label=''
							title={align.title}
						/>
					))}
				</div>
			</div>

			{/* Интервал (межстрочное расстояние) */}
			<LineHeightControl
				value={props.lineHeight}
				fontSize={props.fontSize}
				onChange={next =>
					setProp((p: { lineHeight: string }) => {
						p.lineHeight = next
					})
				}
			/>

			{/* Цвет текста */}
			<ColorControl
				label='Цвет текста'
				value={props.color}
				fallback='#33363C'
				onChange={val =>
					setProp((p: { color: string }) => {
						p.color = val
					})
				}
			/>
			{/* Внешние отступы */}
			<PaddingsControl
				value={{
					paddingTop,
					paddingRight,
					paddingBottom,
					paddingLeft
				}}
				onChange={paddings => {
					setProp(
						(p: {
							paddingTop: string
							paddingRight: string
							paddingBottom: string
							paddingLeft: string
						}) => {
							p.paddingTop = paddings.paddingTop
							p.paddingRight = paddings.paddingRight
							p.paddingBottom = paddings.paddingBottom
							p.paddingLeft = paddings.paddingLeft
						}
					)
				}}
			/>
		</div>
	)
}
