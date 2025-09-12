import { useEditor, useNode } from '@craftjs/core'
import React from 'react'

import type { MjmlButtonProps } from './MjmlButton.types'
import { MjmlButtonSettings } from './MjmlButtonSettings'

type CraftableFC<P> = React.FC<P> & {
	craft?: {
		props?: Partial<P>
		name?: string
		related?: Record<string, unknown>
		rules?: Record<string, unknown>
	}
}

function parsePx(v?: string): number | null {
	if (!v || v === 'auto') return null
	const m = /^(-?\d+(?:\.\d+)?)px$/i.exec(String(v).trim())
	if (!m) return null
	const n = Number(m[1])
	return Number.isFinite(n) ? Math.max(0, Math.round(n)) : null
}

const MjmlButtonBase: React.FC<MjmlButtonProps> = ({
	text,
	url,
	color,
	backgroundColor,
	borderRadius,
	width,
	height,
	align,
	paddingTop,
	paddingRight,
	paddingBottom,
	paddingLeft,
	...props
}) => {
	const {
		connectors: { connect, drag }
	} = useNode()
	const { enabled } = useEditor(state => ({ enabled: state.options.enabled }))

	const widthPx = parsePx(width)
	const heightPx = parsePx(height)
	const hasFixedHeight = heightPx != null

	const baseBtnStyles: React.CSSProperties = {
		display: 'inline-block',
		backgroundColor,
		color,
		border: 'none',
		borderRadius,
		fontFamily: 'Verdana, sans-serif',
		fontSize: '16px',
		textDecoration: 'none',
		boxSizing: 'border-box',
		// ширина
		width: widthPx != null ? `${widthPx}px` : undefined,
		// высота/линия
		height: hasFixedHeight ? `${heightPx}px` : undefined,
		lineHeight: hasFixedHeight ? `${heightPx}px` : undefined,
		// паддинги
		padding: hasFixedHeight ? '0 16px' : '10px 16px',
		cursor: !enabled && url ? 'pointer' : 'default',
		textAlign: 'center'
	}

	const handleClick: React.MouseEventHandler<HTMLElement> | undefined = enabled
		? e => {
				e.preventDefault()
				e.stopPropagation()
			}
		: undefined

	const handleMouseDown: React.MouseEventHandler<HTMLElement> = e => {
		e.stopPropagation()
	}

	const setHostRef = React.useCallback(
		(node: HTMLDivElement | null) => {
			if (node) connect(drag(node))
		},
		[connect, drag]
	)

	// В режиме просмотра делаем <a>, чтобы поведение совпадало с HTML-генератором
	const interactiveEl =
		!enabled && url ? (
			<a
				href={url}
				target='_blank'
				rel='noopener noreferrer'
				style={baseBtnStyles}
				onClick={handleClick}
				onMouseDown={handleMouseDown}
				// чтобы читалось как кнопка
				role='button'
				aria-label={text}
			>
				{text}
			</a>
		) : (
			<button
				type='button'
				{...props}
				style={baseBtnStyles}
				onClick={handleClick}
				onMouseDown={handleMouseDown}
			>
				{text}
			</button>
		)

	return (
		<div
			ref={setHostRef}
			style={{
				textAlign: align,
				paddingTop,
				paddingRight,
				paddingBottom,
				paddingLeft
			}}
		>
			{interactiveEl}
		</div>
	)
}

export const MjmlButton = MjmlButtonBase as CraftableFC<MjmlButtonProps>

MjmlButton.craft = {
	props: {
		text: 'Click me',
		url: '',
		backgroundColor: '#007bff',
		color: '#ffffff',
		borderRadius: '3px',
		width: 'auto',
		height: 'auto',
		align: 'center',
		paddingTop: '0px',
		paddingRight: '0px',
		paddingBottom: '0px',
		paddingLeft: '0px'
	},
	name: 'Кнопка',
	related: {
		settings: MjmlButtonSettings
	}
}
