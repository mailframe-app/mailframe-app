import { Text } from '@consta/uikit/Text'
import { useNode } from '@craftjs/core'
import React from 'react'

import type { SelectedFileData } from '@/shared/types'
import {
	AlignButtons,
	BackgroundControl,
	BgImageControl,
	PaddingsControl,
	RadiusField,
	StepperField
} from '@/shared/ui'

import { ALIGN_OPTIONS } from '../constants.editor'

import type { MjmlBlockProps } from './MjmlBlock.types'

type BlockSettingsProps = {
	startFileSelection?: (cb: (file: SelectedFileData) => void) => void
}

export const MjmlBlockSettings: React.FC<BlockSettingsProps> = ({ startFileSelection }) => {
	const {
		actions: { setProp },
		background = 'transparent',
		widthPercent = 100,
		height = 'auto',
		align = 'left',
		paddingTop = '0px',
		paddingRight = '0px',
		paddingBottom = '0px',
		paddingLeft = '0px',
		borderRadius = '0px',
		hasBgImage = false,
		bgImageUrl = null
	} = useNode<MjmlBlockProps>(node => ({
		background: node.data.props.background,
		widthPercent: node.data.props.widthPercent,
		height: node.data.props.height,
		align: node.data.props.align,
		paddingTop: node.data.props.paddingTop,
		paddingRight: node.data.props.paddingRight,
		paddingBottom: node.data.props.paddingBottom,
		paddingLeft: node.data.props.paddingLeft,
		borderRadius: node.data.props.borderRadius,
		hasBgImage: node.data.props.hasBgImage,
		bgImageUrl: node.data.props.bgImageUrl
	}))

	const handleWidthPercentChange = (n: number) => {
		const clamped = Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0))
		const rounded = Math.round(clamped)
		setProp((p: MjmlBlockProps) => {
			p.widthPercent = rounded
		})
	}

	// если извне пришёл дробный, показываем округлённый
	const displayWidth = Math.round(Number(widthPercent ?? 0))

	const [heightInput, setHeightInput] = React.useState(
		height === 'auto' ? '' : String(height).replace(/px$/, '')
	)
	React.useEffect(() => {
		setHeightInput(height === 'auto' ? '' : String(height).replace(/px$/, ''))
	}, [height])

	const handleHeightChange = (n: number) => {
		const v = Math.max(0, Math.min(2000, Number.isFinite(n) ? n : 0))
		setProp((p: MjmlBlockProps) => {
			p.height = `${v}px`
		})
	}
	const handleHeightChangeRaw = (v: string | number) => setHeightInput(String(v ?? ''))
	const handleHeightBlur = () => {
		if (heightInput.trim() === '') {
			setProp((p: MjmlBlockProps) => {
				p.height = 'auto'
			})
			return
		}
		const n = parseInt(heightInput, 10)
		if (!isNaN(n) && n >= 0 && n <= 2000) {
			setProp((p: MjmlBlockProps) => {
				p.height = `${n}px`
			})
		} else {
			setHeightInput(height === 'auto' ? '' : String(height).replace(/px$/, ''))
		}
	}
	const handleHeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') handleHeightBlur()
	}

	const handleToggleBg = (checked: boolean) => {
		setProp((p: MjmlBlockProps) => {
			p.hasBgImage = checked
			if (!checked) p.bgImageUrl = null
		})
	}
	const handleChangeBgUrl = (url: string) => {
		setProp((p: MjmlBlockProps) => {
			p.hasBgImage = true
			p.bgImageUrl = url
		})
	}
	const handleResetBg = () => {
		setProp((p: MjmlBlockProps) => {
			p.hasBgImage = false
			p.bgImageUrl = null
		})
	}

	return (
		<div className='flex flex-col gap-6'>
			{/* Фон блока */}
			<BackgroundControl
				value={background}
				onChange={v =>
					setProp((p: MjmlBlockProps) => {
						p.background = v
					})
				}
			/>

			{/* Фоновое изображение */}
			<BgImageControl
				hasBgImage={hasBgImage}
				bgImageUrl={bgImageUrl}
				onToggle={handleToggleBg}
				onChangeUrl={handleChangeBgUrl}
				onReset={handleResetBg}
				startFileSelection={startFileSelection}
			/>

			{/* Ширина блока (в процентах) */}
			<div className='flex items-center justify-between'>
				<div>
					<Text size='s' weight='light' className='mb-1' view='primary'>
						Ширина блока, %
					</Text>
					<span className='text-xs text-[var(--color-typo-secondary)]'>0–100%</span>
				</div>

				<div className='flex items-center gap-2'>
					<StepperField
						value={String(displayWidth)}
						min={0}
						max={100}
						step={1}
						onChange={handleWidthPercentChange}
					/>
				</div>
			</div>

			{/* Высота блока */}
			<div className='flex items-center justify-between'>
				<div>
					<Text size='s' weight='light' view='primary' className='mb-1'>
						Высота блока
					</Text>
					<div className='mt-1 text-xs text-[var(--color-typo-secondary)]'>от 40px до 400px</div>
				</div>

				<StepperField
					value={heightInput}
					min={0}
					max={400}
					step={10}
					onChange={handleHeightChange}
					onChangeRaw={handleHeightChangeRaw}
					onBlur={handleHeightBlur}
					onKeyDown={handleHeightKeyDown}
					placeholder='auto'
				/>
			</div>
			{/* Скругление */}
			<RadiusField
				label='Скругление углов'
				value={borderRadius}
				allowAuto={false}
				onChange={next =>
					setProp((p: MjmlBlockProps) => {
						p.borderRadius = next
					})
				}
			/>
			{/* Выравнивание */}
			<div className='flex items-center justify-between'>
				<Text size='s' weight='light' className='mb-1' view='primary'>
					Выравнивание
				</Text>
				<AlignButtons
					options={ALIGN_OPTIONS}
					value={align}
					onChange={val =>
						setProp((p: MjmlBlockProps) => {
							p.align = val
						})
					}
				/>
			</div>
			{/* Внешние отступы */}
			<PaddingsControl
				value={{
					paddingTop,
					paddingRight,
					paddingBottom,
					paddingLeft
				}}
				onChange={p => {
					setProp((props: MjmlBlockProps) => {
						props.paddingTop = p.paddingTop
						props.paddingRight = p.paddingRight
						props.paddingBottom = p.paddingBottom
						props.paddingLeft = p.paddingLeft
					})
				}}
			/>
		</div>
	)
}
