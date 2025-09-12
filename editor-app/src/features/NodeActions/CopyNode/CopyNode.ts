import type { Node, NodeId, SerializedNode } from '@craftjs/core'

import type { CopyNodeActions, CopyNodeQuery } from './types'

export const copyNode = (actions: CopyNodeActions, query: CopyNodeQuery, id: NodeId) => {
	if (id === 'ROOT') return

	const allNodes = query.getSerializedNodes()

	const findDescendants = (nodeId: string, collectedIds = new Set<string>()): Set<string> => {
		if (!nodeId || collectedIds.has(nodeId)) {
			return collectedIds
		}
		collectedIds.add(nodeId)
		const node = allNodes[nodeId]
		if (!node) return collectedIds

		if (node.nodes && node.nodes.length > 0) {
			for (const childId of node.nodes) {
				findDescendants(childId, collectedIds)
			}
		}
		if (node.linkedNodes && Object.keys(node.linkedNodes).length > 0) {
			for (const linkId of Object.values(node.linkedNodes)) {
				findDescendants(linkId as string, collectedIds)
			}
		}
		return collectedIds
	}

	const nodeIdsToCopy = findDescendants(id)
	const idMap = new Map<string, string>()
	const generateId = () => {
		const timestamp = Date.now().toString(36)
		const random = Math.random().toString(36).substring(2, 8)
		return `${timestamp}-${random}`
	}

	nodeIdsToCopy.forEach(oldId => {
		idMap.set(oldId, generateId())
	})

	const newNodes: Record<string, Node> = {}

	nodeIdsToCopy.forEach(oldId => {
		const node = JSON.parse(JSON.stringify(allNodes[oldId]))
		const newId = idMap.get(oldId)!

		if (node.parent) {
			node.parent = idMap.get(node.parent) || node.parent
		}
		if (node.nodes) {
			node.nodes = node.nodes.map((childId: string) => idMap.get(childId) || childId)
		}
		if (node.linkedNodes) {
			const newLinkedNodes: Record<string, string> = {}
			for (const key in node.linkedNodes) {
				const value = node.linkedNodes[key]
				newLinkedNodes[key] = idMap.get(value) || value
			}
			node.linkedNodes = newLinkedNodes
		}

		newNodes[newId] = node
	})

	const originalNode = allNodes[id]
	if (!originalNode || !originalNode.parent) return

	const parentNode = allNodes[originalNode.parent]
	if (!parentNode) return

	const indexInParent = parentNode.nodes.indexOf(id)
	const newRootId = idMap.get(id)!
	const newParentNodes = [...parentNode.nodes]
	newParentNodes.splice(indexInParent + 1, 0, newRootId)

	const finalNodes = {
		...allNodes,
		...newNodes,
		[originalNode.parent]: {
			...parentNode,
			nodes: newParentNodes
		}
	} as Record<string, SerializedNode>

	actions.deserialize(finalNodes)
}
