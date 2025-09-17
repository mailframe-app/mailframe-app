import { Element, type Node, useEditor, useNode } from '@craftjs/core'
import React, { useEffect } from 'react'

import { MjmlBlock } from '../MjmlBlock'

import type { MjmlSingleSectionProps } from './MjmlSingleSection.types'
import { MjmlSingleSectionSettings } from './MjmlSingleSectionSettings'

type CraftRules = { canMoveIn?: (incoming: unknown) => boolean }
type CraftConfig = {
	name: string
	props?: Record<string, unknown>
	related?: Record<string, unknown>
	rules?: CraftRules
}

interface RuleNodeShape {
	data?: {
		type?: unknown
		displayName?: string
	}
}

/** Проверка «это блок?» для rules.canMoveIn */
const isBlockNodeLike = (n: RuleNodeShape): boolean => {
	const byType = n.data?.type === MjmlBlock
	const byName = n.data?.displayName === 'Блок' || n.data?.displayName === 'MjmlBlock'
	return Boolean(byType || byName)
}

export const MjmlSingleSection: React.FC<MjmlSingleSectionProps> & {
	craft?: CraftConfig
} = ({ children }) => {
	const {
		id,
		connectors: { connect }
	} = useNode(node => ({ id: node.id }))

	const { actions, query } = useEditor()

	// Гарантируем, что внутри секции ровно 1 блок
	useEffect(() => {
		const self = query.node(id).get() as Node
		const childIds: string[] = Array.isArray(self.data.nodes) ? (self.data.nodes as string[]) : []

		// Если пусто — создаём единственный блок
		if (childIds.length === 0) {
			const blockTree = query.createNode(<Element is={MjmlBlock} canvas />)
			actions.add(blockTree, id) // добавить в конец
			return
		}

		// Если по ошибке детей > 1 — схлопываем в первый блок
		if (childIds.length > 1) {
			const [first, ...rest] = childIds
			const firstNode = query.node(first).get() as Node
			const firstIsBlock =
				firstNode.data?.type === MjmlBlock || firstNode.data?.displayName === 'Блок'

			if (!firstIsBlock) {
				// Первый — не блок: создаём блок и переносим ВСЕх детей внутрь него
				const newBlock = query.createNode(<Element is={MjmlBlock} canvas />)
				actions.add(newBlock, id, 0) // по индексу 0
				const newBlockId = String(newBlock.id)
				rest.concat(first).forEach(childId => {
					const targetIndex = (query.node(newBlockId).get() as Node).data.nodes.length
					actions.move(childId, newBlockId, targetIndex)
				})
				return
			}

			// Первый — блок: переносим остальных внутрь него
			rest.forEach(childId => {
				const n = query.node(childId).get() as Node
				const isBlock = n.data?.type === MjmlBlock || n.data?.displayName === 'Блок'

				if (isBlock) {
					// если это блок — переносим его детей внутрь первого, затем удаляем блок
					const grandchildren: string[] = Array.isArray(n.data.nodes)
						? (n.data.nodes as string[])
						: []
					grandchildren.forEach(grandChildId => {
						const targetIndex = (query.node(first).get() as Node).data.nodes.length
						actions.move(grandChildId, first, targetIndex)
					})
					actions.delete(childId)
				} else {
					// иначе просто перемещаем узел внутрь первого блока
					const targetIndex = (query.node(first).get() as Node).data.nodes.length
					actions.move(childId, first, targetIndex)
				}
			})
		}
	}, [id, actions, query])

	return (
		<div
			ref={ref => {
				if (ref) connect(ref)
			}}
			data-craft-component='MjmlSingleSection'
			data-craft-canvas='true'
			style={{ display: 'block', boxSizing: 'border-box', width: '100%' }}
		>
			{children}
		</div>
	)
}

MjmlSingleSection.craft = {
	name: 'Секция',
	props: {},
	related: { settings: MjmlSingleSectionSettings },
	rules: {
		// На уровень секции допускаем только один MjmlBlock (любой контент — внутрь блока)
		canMoveIn: (incoming: unknown) => {
			const items: RuleNodeShape[] = Array.isArray(incoming)
				? (incoming as RuleNodeShape[])
				: [incoming as RuleNodeShape]
			return items.every(isBlockNodeLike)
		}
	}
} as CraftConfig
