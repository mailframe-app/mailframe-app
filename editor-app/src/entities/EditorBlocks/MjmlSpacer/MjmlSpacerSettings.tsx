// import { IconMaxHeight } from '@consta/icons/IconMaxHeight'
import { Button } from '@consta/uikit/Button'
import { Text as CUIText } from '@consta/uikit/Text'
import { useNode } from '@craftjs/core'
import React from 'react'

import { AlignButtons, PaddingsControl, StepperField } from '@/shared/ui'
import { BackgroundControl } from '@/shared/ui/BackgroundControl'

import { ALIGN_OPTIONS_TEXT, LINE_STYLE_OPTIONS } from '../constants.editor'

import type { MjmlSpacerProps } from './MjmlSpacer.types'

export const MjmlSpacerSettings: React.FC = () => {
	const {
		actions: { setProp },
		// mode = 'space',
		thickness,
		width = '100%',
		lineStyle,
		color,
		align = 'left',
		background = 'transparent',
		paddingTop = '10px',
		paddingRight = '0px',
		paddingBottom = '10px',
		paddingLeft = '0px'
	} = useNode(node => ({
		mode: node.data.props.mode,
		thickness: node.data.props.thickness,
		width: node.data.props.width,
		lineStyle: node.data.props.lineStyle,
		color: node.data.props.color,
		align: node.data.props.align,
		background: node.data.props.background,
		paddingTop: node.data.props.paddingTop,
		paddingRight: node.data.props.paddingRight,
		paddingBottom: node.data.props.paddingBottom,
		paddingLeft: node.data.props.paddingLeft
	}))

	return (
		<div className='space-y-4'>
			{/* Цвет фона */}
			<BackgroundControl
				value={background}
				onChange={v =>
					setProp((p: MjmlSpacerProps) => {
						p.background = v
					})
				}
			/>

			{/* Переключатель режима */}
			{/* <div className='flex flex-col gap-1'> */}
			{/* <div className='flex items-center justify-between'>
					<CUIText size='s' weight='light' className='mb-4 text-gray-500'>
						Режим разделения:
					</CUIText>
					<div className='flex gap-3.5'>
						<Button
							iconLeft={IconLine}
							view={mode === 'line' ? 'primary' : 'ghost'}
							size='s'
							onClick={() =>
								setProp((props: MjmlSpacerProps) => {
									props.mode = 'line'
								})
							}
						/>
						<Button
							iconLeft={IconMaxHeight}
							view={mode === 'space' ? 'primary' : 'ghost'}
							size='s'
							onClick={() =>
								setProp((props: MjmlSpacerProps) => {
									props.mode = 'space'
								})
							}
						/>
					</div>
				</div> */}

			{/* Название активного режима */}
			{/* <CUIText size='s' weight='light' className='-mt-4 text-gray-500'>
					{mode === 'space' ? 'отступ' : 'линия'}
				</CUIText> */}
			{/* </div> */}

			{/* Режим: Отступ */}
			{/* {mode === 'space' && (
				<div className='flex items-center justify-between'>
					<CUIText size='s' weight='light' className='text-gray-500'>
						Высота
					</CUIText>
					<StepperField
						label=''
						value={thickness && thickness !== 'auto' ? String(thickness).replace(/px$/, '') : ''}
						onChange={n =>
							setProp((p: MjmlSpacerProps) => {
								p.thickness = n ? `${n}px` : 'auto'
							})
						}
						placeholder='auto'
						min={0}
						max={200}
						step={1}
					/>
				</div>
			)} */}

			{/* Режим: Линия */}
			{/* {mode === 'line' && ( */}
			<>
				{/* Ширина линии (используем thickness как width) */}
				<div className='flex items-center justify-between'>
					<CUIText size='s' weight='light' className='text-gray-500'>
						Толщина
					</CUIText>
					<StepperField
						label=''
						value={thickness && thickness !== 'auto' ? String(thickness).replace(/px$/, '') : ''}
						onChange={n =>
							setProp((p: MjmlSpacerProps) => {
								p.thickness = n ? `${n}px` : 'auto'
							})
						}
						placeholder='auto'
						min={0}
						max={200}
						step={1}
					/>
				</div>
				{/* Ширина линии */}
				<div className='flex items-center justify-between'>
					<CUIText size='s' weight='light' className='text-gray-500'>
						Ширина
					</CUIText>
					<StepperField
						label=''
						value={width && width !== 'auto' ? String(width).replace(/px$/, '') : ''}
						onChange={n =>
							setProp((p: MjmlSpacerProps) => {
								p.width = n ? `${n}px` : 'auto'
							})
						}
						placeholder='auto'
						min={0}
						max={1000}
						step={1}
					/>
				</div>

				{/* Тип линии */}
				<div className='flex items-center justify-between'>
					<CUIText size='s' weight='light' className='text-gray-500'>
						Тип линии
					</CUIText>
					<div className='flex gap-3.5'>
						{LINE_STYLE_OPTIONS.map(opt => (
							<Button
								key={opt.value}
								iconLeft={opt.icon}
								view={lineStyle?.value === opt.value ? 'primary' : 'ghost'}
								size='s'
								onClick={() =>
									setProp((p: MjmlSpacerProps) => {
										p.lineStyle = {
											label: '',
											value: opt.value
										}
									})
								}
							/>
						))}
					</div>
				</div>

				{/* Цвет линии */}
				{/* <div className='flex items-center justify-between'>
					<CUIText size='s' weight='light' className='text-gray-500'>
						Цвет линии
					</CUIText>
					<div className='flex items-center gap-2 rounded-lg bg-[#F3F5F7] px-3 py-2'>
						<input
							type='color'
							value={color}
							onChange={e =>
								setProp((p: MjmlSpacerProps) => {
									p.color = e.target.value
								})
							}
							className='h-6 w-6 rounded border-none bg-transparent p-0'
						/>
						<input
							type='text'
							value={color}
							readOnly
							className='w-25 border-none bg-transparent text-sm font-medium text-[#23272F] focus:outline-none'
							maxLength={7}
						/>
					</div>
				</div> */}
				<BackgroundControl
					label='Цвет линии'
					value={color}
					onChange={v =>
						setProp((p: MjmlSpacerProps) => {
							p.color = v
						})
					}
				/>

				{/* Выравнивание */}
				<div className='flex items-center justify-between'>
					<CUIText size='s' weight='light' className='text-gray-500'>
						Выравнивание
					</CUIText>
					<AlignButtons
						options={ALIGN_OPTIONS_TEXT}
						value={align}
						onChange={val =>
							setProp((p: MjmlSpacerProps) => {
								p.align = val
							})
						}
					/>
				</div>
				<hr className='my-2 border-t border-[#e5e7eb]' />
				{/* Внешние отступы */}
				<div>
					<PaddingsControl
						value={{
							paddingTop: paddingTop ?? '10px',
							paddingRight: paddingRight ?? '0px',
							paddingBottom: paddingBottom ?? '10px',
							paddingLeft: paddingLeft ?? '0px'
						}}
						onChange={paddings =>
							setProp((p: MjmlSpacerProps) => {
								p.paddingTop = paddings.paddingTop
								p.paddingRight = paddings.paddingRight
								p.paddingBottom = paddings.paddingBottom
								p.paddingLeft = paddings.paddingLeft
							})
						}
					/>
				</div>
			</>
			{/* )} */}
		</div>
	)
}
