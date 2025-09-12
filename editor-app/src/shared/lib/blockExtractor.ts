import type { NodeId, SerializedNode } from '@craftjs/core'

const getNodeWithDescendants = (
	nodeId: NodeId,
	allNodes: Record<NodeId, SerializedNode>
): Record<NodeId, SerializedNode> => {
	const result: Record<NodeId, SerializedNode> = {}
	const visited = new Set<NodeId>()

	const traverse = (id: NodeId) => {
		if (visited.has(id) || !allNodes[id]) return

		visited.add(id)
		result[id] = { ...allNodes[id] }

		// Обходим дочерние узлы
		if (allNodes[id].nodes) {
			allNodes[id].nodes.forEach((childId: NodeId) => traverse(childId))
		}

		// Обходим связанные узлы
		if (allNodes[id].linkedNodes) {
			Object.values(allNodes[id].linkedNodes).forEach((linkId: NodeId) => traverse(linkId))
		}
	}

	traverse(nodeId)
	return result
}

export const extractBlockWithChildren = (
	nodeId: NodeId,
	allNodes: Record<NodeId, SerializedNode>
): Record<string, SerializedNode> => {
	// 1. Извлекаем узел и всех его потомков
	const blockNodes = getNodeWithDescendants(nodeId, allNodes)

	if (Object.keys(blockNodes).length === 0) {
		return {}
	}

	// 2. Создаем изолированное дерево
	const isolatedNodes: Record<string, SerializedNode> = { ...blockNodes }

	// 3. Устанавливаем извлеченный узел как дочерний для нового ROOT
	if (isolatedNodes[nodeId]) {
		isolatedNodes[nodeId] = {
			...isolatedNodes[nodeId],
			parent: 'ROOT'
		}
	}

	// 4. Создаем новый ROOT узел
	isolatedNodes['ROOT'] = {
		type: { resolvedName: 'MjmlWrapper' },
		isCanvas: true,
		props: {},
		displayName: 'MjmlWrapper',
		custom: {},
		hidden: false,
		nodes: [nodeId],
		linkedNodes: {},
		parent: ''
	}

	return isolatedNodes
}
