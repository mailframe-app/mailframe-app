import { IconAdd } from '@consta/icons/IconAdd'
import { IconTrash } from '@consta/icons/IconTrash'
import { Button } from '@consta/uikit/Button'
import { Text } from '@consta/uikit/Text'
import { Element, type Node, useEditor, useNode } from '@craftjs/core'
import React from 'react'

import type { SelectedFileData } from '@/shared/types'
import {
	BackgroundControl,
	BgImageControl,
	PaddingsControl,
	RadiusField,
	StepperField
} from '@/shared/ui'

import { MjmlBlock } from '../MjmlBlock'

import type { MjmlSectionProps } from './MjmlSection.types'
import {
	getAvailableWidth as calcAvailableWidth,
	getCurrentPercents,
	percentToPx,
	proportionalResize,
	pxToPercent,
	toPx
} from './sectionLayout'

// Пропсы дочернего блока
interface MjmlBlockProps {
	widthPercent?: number
}

interface ContainerNodeProps {
	emailWidth?: number
}

interface SectionSettingsProps {
	startFileSelection?: (cb: (file: SelectedFileData) => void) => void
}

/** Ширина письма из корневого Container */
function useEmailWidth(): number {
	const { rootNode } = useEditor(state => {
		const entry = Object.entries(state.nodes).find(([, node]) => {
			const n = node as Node
			return n.data?.name === 'Container' && !n.data?.parent
		})
		return { rootNode: entry ? (entry[1] as Node) : undefined }
	})
	const containerProps = (rootNode?.data?.props as Partial<ContainerNodeProps>) ?? {}
	return containerProps.emailWidth ?? 600
}

export const MjmlSectionSettings: React.FC<SectionSettingsProps> = ({ startFileSelection }) => {
	const emailWidth = useEmailWidth()

	const { id, childNodes, props, hasBgImage, bgImageUrl } = useNode(node => ({
		id: node.id,
		childNodes: node.data.nodes || [],
		props: node.data.props as MjmlSectionProps,
		hasBgImage: node.data.props.hasBgImage,
		bgImageUrl: node.data.props.bgImageUrl
	}))
	const { actions, query } = useEditor()

	const bootstrappedRef = React.useRef(false)

	const maxCols = 4
	const minCols = 1
	const canAdd = childNodes.length < maxCols
	const canRemove = childNodes.length > minCols

	const gap = props.gap ?? 20
	const paddingTop = props.paddingTop ?? '20px'
	const paddingRight = props.paddingRight ?? '0px'
	const paddingBottom = props.paddingBottom ?? '20px'
	const paddingLeft = props.paddingLeft ?? '0px'
	const borderRadius = props.borderRadius ?? '0px'
	const containersBackground = props.containersBackground ?? 'transparent'
	// const hasBgImage = !!props.hasBgImage

	/** Доступная ширина под колонки */
	const getAvailableWidth = React.useCallback(() => {
		return calcAvailableWidth(
			emailWidth,
			paddingLeft,
			paddingRight,
			Number(gap),
			Math.max(1, childNodes.length)
		)
	}, [emailWidth, paddingLeft, paddingRight, gap, childNodes.length])

	/** Чтение процента конкретной колонки (может быть undefined, тогда равномерно) */
	const readPercent = React.useCallback(
		(id: string): number | undefined => {
			const n = query.node(id).get() as Node
			const val = (n.data.props as Partial<MjmlBlockProps>)?.widthPercent
			return typeof val === 'number' && isFinite(val) ? val : undefined
		},
		[query]
	)

	React.useEffect(() => {
		if (bootstrappedRef.current) return

		const ids = childNodes.map(String)
		if (ids.length === 0) return

		// ширина считается «не заданной», если:
		// - значение undefined/null ИЛИ
		// - значение 100%, но колонок больше одной (дефолт MjmlBlock)
		const widths = ids.map(id => readPercent(id))
		const allUnset = ids.length > 1 && widths.every(v => v == null || v === 100)

		if (allUnset) {
			redistributeEven(ids)
		}

		bootstrappedRef.current = true
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [childNodes])

	/** Текущая ширина колонки в px (из % относительно доступной ширины) */
	const getChildWidthPx = (childId: string): number => {
		const av = getAvailableWidth()
		if (av <= 0) return 0

		const ids = childNodes.map(String)
		const percents = getCurrentPercents(ids, readPercent)
		const idx = ids.findIndex(id => id === String(childId))
		const pct = percents[idx] ?? 100 / Math.max(1, ids.length)

		return percentToPx(pct, av)
	}

	/** Установить ширину колонки в px: считаем новый % и пропорционально масштабируем остальных */
	const setChildWidthPx = (childId: string, px: number) => {
		const av = getAvailableWidth()
		if (av <= 0) return
		const newPct = pxToPercent(px, av)

		// получаем новые проценты для всех колонок
		const nextPercents = proportionalResize(
			childNodes.map(String),
			String(childId),
			newPct,
			readPercent
		)

		// применяем к craft-нодам
		childNodes.forEach((cid, i) => {
			actions.setProp(String(cid), (p: unknown) => {
				;(p as MjmlBlockProps).widthPercent = nextPercents[i]
			})
		})
	}

	/** Равномерно распределить ширины */
	const redistributeEven = (ids: string[]) => {
		if (!ids.length) return
		const each = 100 / ids.length
		const eachPct = Number(each.toFixed(4))
		ids.forEach(cid =>
			actions.setProp(cid, (p: unknown) => {
				;(p as MjmlBlockProps).widthPercent = eachPct
			})
		)
	}

	/** Добавить колонку */
	const handleAddColumn = () => {
		if (!canAdd) return
		const newNode = query.createNode(<Element is={MjmlBlock} canvas />)
		actions.add(newNode, id)
		const afterIds = [...childNodes.map(String), newNode.id as string]
		redistributeEven(afterIds)
	}

	/** Удалить колонку */
	const handleRemoveColumn = (cid: string) => {
		if (!canRemove) return
		actions.delete(cid)
		const afterIds = childNodes.filter(id0 => id0 !== cid).map(String)
		if (afterIds.length) redistributeEven(afterIds)
	}

	const handleToggleBg = (checked: boolean) => {
		actions.setProp(id, (p: MjmlSectionProps) => {
			p.hasBgImage = checked
			if (!checked) p.bgImageUrl = null
		})
	}
	const handleChangeBgUrl = (url: string) => {
		actions.setProp(id, (p: MjmlSectionProps) => {
			p.hasBgImage = true
			p.bgImageUrl = url
		})
	}
	const handleResetBg = () => {
		actions.setProp(id, (p: MjmlSectionProps) => {
			p.hasBgImage = false
			p.bgImageUrl = null
		})
	}

	const availableWidth = getAvailableWidth()

	return (
		<div className='space-y-5'>
			{/* Заголовок и счётчик колонок */}
			<div className='flex items-center justify-between gap-4'>
				{[...Array(childNodes.length)].map((_, i) => (
					<div
						key={i}
						className='text-m w-full rounded-md bg-[var(--color-bg-stripe)] py-1 text-center text-[var(--color-typo-secondary)]'
					>
						{i + 1}
					</div>
				))}
				<Button
					size='s'
					view='ghost'
					iconLeft={IconAdd}
					onClick={handleAddColumn}
					disabled={!canAdd}
					title='Добавить контейнер'
				/>
			</div>

			{/* Список контейнеров */}
			<div className='space-y-3'>
				{childNodes.map((cid, idx) => (
					<div key={cid} className='flex items-center justify-between gap-3'>
						<div className='flex items-center gap-3'>
							<span className='text-[var(--color-typo-secondary)]'>⋮</span>
							<Text size='s' view='primary'>
								Контейнер {idx + 1}
							</Text>
							<Button
								view='ghost'
								size='xs'
								iconLeft={IconTrash}
								onClick={() => handleRemoveColumn(String(cid))}
								disabled={!canRemove}
								title='Удалить контейнер'
							/>
						</div>
						<div className='flex items-center gap-2'>
							<StepperField
								value={String(getChildWidthPx(String(cid)))}
								min={0}
								max={availableWidth}
								step={10}
								onChange={(n: number) => setChildWidthPx(String(cid), n)}
							/>
						</div>
					</div>
				))}
			</div>

			{/* Отступы между контейнерами */}
			<div className='flex items-center justify-between'>
				<Text size='s' view='primary'>
					Отступы между контейнерами
				</Text>
				<div className='flex items-center gap-2'>
					<StepperField
						value={String(gap)}
						min={0}
						max={200}
						step={1}
						onChange={(n: number) =>
							actions.setProp(id, (p: MjmlSectionProps) => {
								p.gap = n
							})
						}
					/>
				</div>
			</div>

			{/* Цвет фона */}
			<BackgroundControl
				value={containersBackground}
				onChange={v =>
					actions.setProp(id, (props: MjmlSectionProps) => {
						props.containersBackground = v
					})
				}
			/>

			{/* Фоновое изображение*/}
			<BgImageControl
				hasBgImage={hasBgImage}
				bgImageUrl={bgImageUrl}
				onToggle={handleToggleBg}
				onChangeUrl={handleChangeBgUrl}
				onReset={handleResetBg}
				startFileSelection={startFileSelection}
			/>

			{/* Радиус скругления */}
			<RadiusField
				label='Радиус скругления'
				value={borderRadius}
				allowAuto={true}
				onChange={next =>
					actions.setProp(id, (props: MjmlSectionProps) => {
						props.borderRadius = next
					})
				}
				className='mb-3'
			/>

			{/* Внешние отступы */}
			<div>
				<PaddingsControl
					value={{ paddingTop, paddingRight, paddingBottom, paddingLeft }}
					onChange={pad =>
						actions.setProp(id, (p: MjmlSectionProps) => {
							p.paddingTop = pad.paddingTop
							p.paddingRight = pad.paddingRight
							p.paddingBottom = pad.paddingBottom
							p.paddingLeft = pad.paddingLeft
						})
					}
				/>
			</div>

			{/* Подсказка */}
			<div className='text-xs text-gray-400'>
				Доступная ширина: {availableWidth}px = письмо ({emailWidth}px) − л/п паддинги (
				{toPx(paddingLeft)}px, {toPx(paddingRight)}px) − отступы между контейнерами (
				{Math.max(0, childNodes.length - 1)} × {gap}px).
			</div>
		</div>
	)
}
