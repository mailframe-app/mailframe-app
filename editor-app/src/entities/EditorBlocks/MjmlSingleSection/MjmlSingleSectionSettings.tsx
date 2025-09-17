import { useEditor, useNode } from '@craftjs/core'
import React from 'react'

import type { SelectedFileData } from '@/shared/types'
import { BackgroundControl, BgImageControl, PaddingsControl, RadiusField } from '@/shared/ui'

/** Свойства единственного блока, которыми управляет Секция */
type BlockVisualProps = {
	background?: string
	hasBgImage?: boolean
	bgImageUrl?: string | null
	bgSize?: 'cover' | 'contain' | 'auto' | string
	bgRepeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y' | string
	bgPosition?: string
	borderRadius?: string
	paddingTop?: string
	paddingRight?: string
	paddingBottom?: string
	paddingLeft?: string
}

interface SectionSettingsProps {
	/** Колбэк выбора файла (тип как у BgImageControl) */
	startFileSelection?: (cb: (file: SelectedFileData) => void) => void
}

export const MjmlSingleSectionSettings: React.FC<SectionSettingsProps> = ({
	startFileSelection
}) => {
	const { childNodes } = useNode(node => ({
		childNodes: node.data.nodes || []
	}))
	const { actions, query } = useEditor()

	const blockId = React.useMemo(() => {
		const ids = (childNodes as string[]) || []
		return ids.length ? String(ids[0]) : null
	}, [childNodes])

	const blockProps: BlockVisualProps = React.useMemo(() => {
		if (!blockId) return {} as BlockVisualProps
		const n = query.node(blockId).get()
		return (n?.data?.props as BlockVisualProps) ?? ({} as BlockVisualProps)
	}, [blockId, query])

	const setBlockProp = <K extends keyof BlockVisualProps>(key: K, value: BlockVisualProps[K]) => {
		if (!blockId) return
		actions.setProp(blockId, (p: unknown) => {
			;(p as BlockVisualProps)[key] = value
		})
	}

	const {
		background = 'transparent',
		hasBgImage = false,
		bgImageUrl = null,
		// bgSize = 'cover',
		// bgRepeat = 'no-repeat',
		// bgPosition = 'center',
		borderRadius = '0px',
		paddingTop = '0px',
		paddingRight = '0px',
		paddingBottom = '0px',
		paddingLeft = '0px'
	} = blockProps

	return (
		<div className='space-y-5'>
			{/* Фон блока */}
			<BackgroundControl value={background} onChange={v => setBlockProp('background', v)} />

			{/* Фоновое изображение блока */}
			<BgImageControl
				hasBgImage={!!hasBgImage}
				bgImageUrl={bgImageUrl ?? null}
				onToggle={checked => {
					setBlockProp('hasBgImage', checked)
					if (!checked) setBlockProp('bgImageUrl', null)
				}}
				onChangeUrl={url => {
					setBlockProp('hasBgImage', true)
					setBlockProp('bgImageUrl', url)
				}}
				onReset={() => {
					setBlockProp('hasBgImage', false)
					setBlockProp('bgImageUrl', null)
				}}
				startFileSelection={startFileSelection}
				// при необходимости добавьте контролы для size/repeat/position:
				// bgSize={bgSize} onChangeSize={...} и т.д.
			/>

			{/* Радиус скругления блока */}
			<RadiusField
				label='Радиус скругления'
				value={borderRadius}
				allowAuto={true}
				onChange={next => setBlockProp('borderRadius', next)}
				className='mb-3'
			/>

			{/* Внутренние отступы блока */}
			<PaddingsControl
				value={{ paddingTop, paddingRight, paddingBottom, paddingLeft }}
				onChange={pad => {
					setBlockProp('paddingTop', pad.paddingTop)
					setBlockProp('paddingRight', pad.paddingRight)
					setBlockProp('paddingBottom', pad.paddingBottom)
					setBlockProp('paddingLeft', pad.paddingLeft)
				}}
			/>
		</div>
	)
}
