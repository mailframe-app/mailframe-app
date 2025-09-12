import type { SerializedNode, SerializedNodes } from '@craftjs/core'
import { useEditor } from '@craftjs/core'
import React, { useEffect, useRef } from 'react'

import { replaceAllIdsExceptRoot } from '@/shared/lib'

import { useReusableBlocksStore } from '@/entities/ReusableBlocks'

export const AddModuleToCanvas: React.FC = () => {
	const processedRef = useRef<Set<string>>(new Set())

	const { actions, query, nodes } = useEditor(state => ({ nodes: state.nodes }))
	const { fetchBlockContent } = useReusableBlocksStore()

	useEffect(() => {
		const serialized: SerializedNodes = query.getSerializedNodes()

		const getModuleIdFromNode = (node: SerializedNode): string | null => {
			const rawProps = (node as unknown as { props?: unknown }).props
			if (
				rawProps &&
				typeof rawProps === 'object' &&
				'__moduleId' in (rawProps as Record<string, unknown>)
			) {
				const value = (rawProps as { __moduleId?: unknown }).__moduleId
				return typeof value === 'string' ? value : null
			}
			return null
		}

		Object.entries(serialized).forEach(([nodeId, node]) => {
			const moduleId = getModuleIdFromNode(node as SerializedNode)
			if (!moduleId) return
			if (processedRef.current.has(nodeId)) return

			processedRef.current.add(nodeId)
			;(async () => {
				try {
					const content = await fetchBlockContent(moduleId)
					if (!content || !content.content) {
						actions.delete(nodeId)
						return
					}

					const rawNodes =
						typeof content.content === 'string' ? JSON.parse(content.content) : content.content
					const nodesWithNewIds = replaceAllIdsExceptRoot(rawNodes)
					const savedRoot = nodesWithNewIds.ROOT
					if (!savedRoot || !savedRoot.nodes || savedRoot.nodes.length === 0) {
						actions.delete(nodeId)
						return
					}

					const newChildIds: string[] = savedRoot.nodes

					// Build nodesToAdd and set parent for top-level children to placeholder's parent
					const currentState = query.getSerializedNodes() as SerializedNodes
					const placeholderNode = currentState[nodeId]
					const parentId = placeholderNode?.parent
					if (!parentId) {
						actions.delete(nodeId)
						return
					}
					const nodesToAdd: SerializedNodes = {}
					Object.entries(nodesWithNewIds).forEach(([id, n]) => {
						if (id !== 'ROOT') nodesToAdd[id] = { ...n }
					})
					newChildIds.forEach(id => {
						if (nodesToAdd[id]) nodesToAdd[id].parent = parentId
					})

					const parent = currentState[parentId]
					const updatedParentNodes = [...(parent.nodes || [])]
					const idx = updatedParentNodes.indexOf(nodeId)
					if (idx === -1) {
						// If somehow placeholder not found, append
						updatedParentNodes.push(...newChildIds)
					} else {
						updatedParentNodes.splice(idx, 1, ...newChildIds)
					}

					// Build final state: merge nodes, update parent, remove placeholder
					const finalNodes: SerializedNodes = {
						...currentState,
						...nodesToAdd,
						[parentId]: {
							...parent,
							nodes: updatedParentNodes
						}
					}
					delete finalNodes[nodeId]

					actions.deserialize(finalNodes)
				} catch {
					try {
						actions.delete(nodeId)
					} catch {
						// ignore
					}
				}
			})()
		})
	}, [actions, query, fetchBlockContent, nodes])

	return null
}
