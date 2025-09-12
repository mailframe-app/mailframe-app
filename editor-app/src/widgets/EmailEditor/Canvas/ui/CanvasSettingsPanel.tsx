import { Text } from '@consta/uikit/Text'
import { type Node, type NodeId, useEditor } from '@craftjs/core'
import React, { useEffect, useState } from 'react'

import type { SelectedFileData } from '@/shared/types'
import { BackgroundControl, BgImageControl, PaddingsControl, StepperField } from '@/shared/ui'

const MIN_WIDTH = 320
const MAX_WIDTH = 600

type Padding = { top: number; right: number; bottom: number; left: number }

interface ContainerProps {
	background?: string
	hasBgImage?: boolean
	bgImage?: File | null
	bgImageUrl?: string | null
	emailWidth?: number
	padding?: Padding
}

interface CanvasSettingsPanelProps {
	startFileSelection?: (callback: (file: SelectedFileData) => void) => void
}

export const CanvasSettingsPanel: React.FC<CanvasSettingsPanelProps> = ({ startFileSelection }) => {
	const { rootNode } = useEditor(state => {
		const entry = Object.entries(state.nodes).find(
			([, node]) => (node as Node).data?.name === 'Container' && !(node as Node).data?.parent
		)
		return { rootNode: entry ? (entry[1] as Node) : undefined }
	})

	const [widthInput, setWidthInput] = useState('600')

	const { actions } = useEditor()
	const props: ContainerProps = rootNode?.data?.props || {}
	const background = props.background || '#FFFFFF'
	const hasBgImage = props.hasBgImage || false
	const bgImage = props.bgImage || null
	const bgImageUrl = props.bgImageUrl || null
	const emailWidth = props.emailWidth || 600
	const padding: Padding = props.padding || { top: 0, right: 0, bottom: 0, left: 0 }

	useEffect(() => setWidthInput(String(emailWidth)), [emailWidth])

	const updateProps = (partial: Partial<ContainerProps>) => {
		if (!rootNode?.id) return
		actions.setProp(rootNode.id as NodeId, (props: ContainerProps) => {
			Object.assign(props, partial)
		})
	}

	const handleSetBackground = (value: string) => updateProps({ background: value })

	const handleWidthInput = (n: number) => {
		const value = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, n))
		updateProps({ emailWidth: value })
	}
	const handleWidthInputRaw = (v: string | number) => setWidthInput(String(v))
	const handleWidthBlur = () => {
		const n = parseInt(widthInput, 10)
		if (!isNaN(n) && n >= MIN_WIDTH && n <= MAX_WIDTH) {
			updateProps({ emailWidth: n })
		} else {
			setWidthInput(String(emailWidth))
		}
	}
	const handleWidthInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') handleWidthBlur()
	}

	const handleSetPadding = (next: {
		paddingTop: string
		paddingRight: string
		paddingBottom: string
		paddingLeft: string
	}) => {
		updateProps({
			padding: {
				top: parseInt(next.paddingTop) || 0,
				right: parseInt(next.paddingRight) || 0,
				bottom: parseInt(next.paddingBottom) || 0,
				left: parseInt(next.paddingLeft) || 0
			}
		})
	}

	const handleToggleBg = (checked: boolean) => {
		if (checked) updateProps({ hasBgImage: true })
		else updateProps({ hasBgImage: false, bgImage: null, bgImageUrl: null })
	}
	const handleChangeBgUrl = (url: string) => {
		updateProps({ bgImageUrl: url, hasBgImage: true, bgImage: null })
	}
	const handleResetBg = () => {
		updateProps({ hasBgImage: false, bgImage: null, bgImageUrl: null })
	}

	if (!rootNode) return <div>Canvas не найден</div>

	return (
		<div className='flex flex-col gap-6'>
			{/* Цвет фона через BackgroundControl */}
			<BackgroundControl value={background} onChange={handleSetBackground} />

			{/* Фоновое изображение */}
			<BgImageControl
				hasBgImage={hasBgImage}
				bgImageUrl={bgImageUrl}
				bgImageFile={bgImage ?? undefined}
				onToggle={handleToggleBg}
				onChangeUrl={handleChangeBgUrl}
				onReset={handleResetBg}
				startFileSelection={startFileSelection}
			/>

			{/* Ширина письма */}
			<div>
				<Text size='s' view='primary' weight='light' className='mb-1'>
					Ширина письма
				</Text>
				<StepperField
					value={widthInput}
					min={MIN_WIDTH}
					max={MAX_WIDTH}
					step={10}
					onChange={handleWidthInput}
					onChangeRaw={handleWidthInputRaw}
					onBlur={handleWidthBlur}
					onKeyDown={handleWidthInputKeyDown}
					className='w-24'
				/>
				<div className='mt-1 text-xs text-gray-400'>
					от {MIN_WIDTH} до {MAX_WIDTH}
				</div>
			</div>

			{/* Внутренние отступы */}
			<PaddingsControl
				value={{
					paddingTop: String(padding.top) + 'px',
					paddingRight: String(padding.right) + 'px',
					paddingBottom: String(padding.bottom) + 'px',
					paddingLeft: String(padding.left) + 'px'
				}}
				onChange={handleSetPadding}
			/>
		</div>
	)
}
