import { useNode } from '@craftjs/core'
import { Upload } from 'lucide-react'
import React, { useLayoutEffect, useRef, useState } from 'react'

import { MjmlSection } from '../MjmlSection'

import type { MjmlBlockProps } from './MjmlBlock.types'
import { MjmlBlockSettings } from './MjmlBlockSettings'

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))

const toPx = (v?: string | number): number => {
	if (v == null) return 0
	if (typeof v === 'number') return Math.max(0, Math.round(v))
	const m = /([\d.]+)/.exec(String(v))
	return m ? Math.max(0, Math.round(parseFloat(m[1]))) : 0
}

export const MjmlBlock = ({
	children,
	style = {},
	background,
	widthPercent,
	height,
	align = 'left',
	paddingTop,
	paddingRight,
	paddingBottom,
	paddingLeft,
	borderRadius,
	hasBgImage = false,
	bgImageUrl = null,
	bgSize = 'cover',
	bgRepeat = 'no-repeat',
	bgPosition = 'center',
	...rest
}: MjmlBlockProps) => {
	const {
		connectors: { connect, drag }
	} = useNode()

	const outerRef = useRef<HTMLDivElement | null>(null)
	const innerRef = useRef<HTMLDivElement | null>(null)
	const contentRef = useRef<HTMLDivElement | null>(null)

	const [autoMinHeight, setAutoMinHeight] = useState<number>(40)
	const [blockWidth, setBlockWidth] = useState<number>(0)

	const widthPct = clamp(widthPercent ?? 100, 0, 100)

	const isEmpty = !children || (Array.isArray(children) && children.length === 0)

	// логика выравнивания (отрицательный левый отступ только при protrude)
	const alignMargins: Pick<React.CSSProperties, 'marginLeft' | 'marginRight'> =
		align === 'center'
			? { marginLeft: 'auto', marginRight: 'auto' }
			: align === 'right'
				? { marginLeft: 'auto', marginRight: '0px' }
				: { marginLeft: '0px', marginRight: 'auto' }

	const ptNum = toPx(paddingTop ?? (style.paddingTop as string | number | undefined))
	const pbNum = toPx(paddingBottom ?? (style.paddingBottom as string | number | undefined))
	const verticalPadding = ptNum + pbNum

	const desiredMinH = Math.max(
		toPx(height ?? (style.height as string | number | undefined)),
		toPx(style.minHeight as string | number | undefined),
		40
	)

	const minHeightPx = Math.max(desiredMinH, autoMinHeight)

	useLayoutEffect(() => {
		const el = contentRef.current
		if (!el) return

		let raf = 0
		const measure = () => {
			raf = 0
			const contentH = Math.ceil(el.getBoundingClientRect().height)
			const totalH = Math.max(0, contentH + verticalPadding)
			setAutoMinHeight(prev => (prev !== totalH ? totalH : prev))
		}

		measure()

		const ro = new ResizeObserver(() => {
			if (raf) cancelAnimationFrame(raf)
			raf = requestAnimationFrame(measure)
		})
		ro.observe(el)

		return () => {
			ro.disconnect()
			if (raf) cancelAnimationFrame(raf)
		}
	}, [verticalPadding, children])

	useLayoutEffect(() => {
		const el = innerRef.current
		if (!el) return

		let raf = 0
		const ro = new ResizeObserver(([entry]) => {
			if (entry) {
				if (raf) cancelAnimationFrame(raf)
				raf = requestAnimationFrame(() => {
					setBlockWidth(entry.contentRect.width)
				})
			}
		})

		ro.observe(el)

		return () => {
			ro.disconnect()
			if (raf) cancelAnimationFrame(raf)
		}
	}, [])

	const outerStyle: React.CSSProperties = {
		...style,
		background: 'transparent',
		width: `${widthPct}%`,
		height: 'auto',
		minHeight: `${minHeightPx}px`,
		...alignMargins,
		paddingTop: '0px',
		paddingRight: paddingRight ?? (style.paddingRight as string | number | undefined),
		paddingBottom: '0px',
		paddingLeft: paddingLeft ?? (style.paddingLeft as string | number | undefined)
	}

	const innerStyle: React.CSSProperties = {
		width: '100%',
		minHeight: minHeightPx,
		boxSizing: 'border-box',
		background: background ?? (style.background as string) ?? 'transparent',
		backgroundImage: hasBgImage && bgImageUrl ? `url(${bgImageUrl})` : undefined,
		backgroundSize: bgSize,
		backgroundRepeat: bgRepeat,
		backgroundPosition: bgPosition,
		paddingTop: paddingTop ?? (style.paddingTop as string) ?? '0px',
		paddingBottom: paddingBottom ?? (style.paddingBottom as string) ?? '0px',
		paddingLeft: 0,
		paddingRight: 0,
		borderRadius: borderRadius ?? (style.borderRadius as string) ?? '0px',
		display: 'flow-root',
		position: 'relative',
		border: isEmpty ? '1px dashed var(--accent)' : 'none',
		padding: '10px' // Добавляем постоянный внутренний отступ
	}

	return (
		<div
			{...rest}
			ref={node => {
				outerRef.current = node
				if (node) connect(drag(node))
			}}
			style={outerStyle}
		>
			<div style={innerStyle} ref={innerRef}>
				<div
					ref={contentRef}
					data-craft-component='MjmlBlock'
					data-craft-canvas='true'
					style={{
						width: '100%',
						minHeight: isEmpty ? 0 : '20px', // Минимальная высота для drop-зоны
						boxSizing: 'border-box',
						display: 'flow-root'
					}}
				>
					{isEmpty ? (
						<div
							style={{
								position: 'absolute',
								left: 0,
								right: 0,
								top: '50%',
								transform: 'translateY(-50%)',
								pointerEvents: 'none',
								userSelect: 'none'
							}}
						>
							<div // фон
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									right: 0,
									bottom: 0,
									backgroundColor: 'var(--accent)',
									opacity: 0.05 // Делаем фон чуть заметнее
								}}
							/>
							<div // контент
								style={{
									position: 'relative',
									opacity: 0.6,
									color: 'var(--accent)',
									textAlign: 'center',
									fontSize: 14,
									fontWeight: 400,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: 10,
									padding: 10
								}}
							>
								<Upload size={16} />
								{blockWidth > 200 && <span>Перетащите сюда элемент</span>}
							</div>
						</div>
					) : (
						children
					)}
				</div>
			</div>
		</div>
	)
}

MjmlBlock.displayName = 'MjmlBlock'

MjmlBlock.craft = {
	props: {
		background: 'transparent',
		widthPercent: 100,
		height: 'auto',
		align: 'left',
		paddingTop: '0px',
		paddingRight: '0px',
		paddingBottom: '0px',
		paddingLeft: '0px',
		borderRadius: '0px',

		hasBgImage: false,
		bgImageUrl: null,
		bgSize: 'cover',
		bgRepeat: 'no-repeat',
		bgPosition: 'center',
		style: {}
	},
	name: 'Блок',
	related: { settings: MjmlBlockSettings },
	rules: {
		canMoveIn: (incoming: unknown | unknown[]) => {
			type RuleNode = { data?: { type?: unknown; displayName?: string } }
			const isForbidden = (n: RuleNode) => {
				const dn = n?.data?.displayName
				const t = n?.data?.type
				return (
					dn === 'Блок' ||
					t === MjmlBlock ||
					dn === 'Сетки' ||
					t === MjmlSection ||
					dn === 'Container'
				)
			}
			const items: RuleNode[] = Array.isArray(incoming)
				? (incoming as RuleNode[])
				: [incoming as RuleNode]
			return items.every(n => !isForbidden(n))
		}
	}
}
