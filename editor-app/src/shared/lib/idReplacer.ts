import type { NodeId, SerializedNode } from '@craftjs/core'

const generateUniqueId = (): string => {
	return Math.random().toString(36).substring(2, 12)
}

export const replaceAllIds = (
	nodes: Record<NodeId, SerializedNode>
): Record<string, SerializedNode> => {
	// 1. Создаем карту замен старых ID на новые
	const idMap = new Map<NodeId, string>()

	// Генерируем новые ID для всех существующих узлов
	Object.keys(nodes).forEach(oldId => {
		idMap.set(oldId, generateUniqueId())
	})

	// 2. Создаем новый объект с обновленными узлами
	const newNodes: Record<string, SerializedNode> = {}

	Object.entries(nodes).forEach(([oldId, node]) => {
		const newId = idMap.get(oldId)!

		// Создаем копию узла с обновленными ссылками
		const updatedNode: SerializedNode = {
			...node,
			// Обновляем parent ID
			parent: node.parent ? idMap.get(node.parent) || node.parent : node.parent,
			// Обновляем дочерние узлы
			nodes: node.nodes.map((childId: NodeId) => idMap.get(childId) || childId),
			// Обновляем связанные узлы
			linkedNodes: node.linkedNodes
				? Object.fromEntries(
						Object.entries(node.linkedNodes).map(([key, linkedId]) => [
							key,
							idMap.get(linkedId as NodeId) || linkedId
						])
					)
				: node.linkedNodes
		}

		// Добавляем узел с новым ID
		newNodes[newId] = updatedNode
	})

	return newNodes
}

export const replaceAllIdsExceptRoot = (
	nodes: Record<NodeId, SerializedNode>
): Record<string, SerializedNode> => {
	// Создаем карту замен, исключая ROOT
	const idMap = new Map<NodeId, string>()

	Object.keys(nodes).forEach(oldId => {
		if (oldId === 'ROOT') {
			idMap.set(oldId, 'ROOT') // ROOT остается ROOT
		} else {
			idMap.set(oldId, generateUniqueId())
		}
	})

	// Создаем новый объект с обновленными узлами
	const newNodes: Record<string, SerializedNode> = {}

	Object.entries(nodes).forEach(([oldId, node]) => {
		const newId = idMap.get(oldId)!

		const updatedNode: SerializedNode = {
			...node,
			parent: node.parent ? idMap.get(node.parent) || node.parent : node.parent,
			nodes: node.nodes.map((childId: NodeId) => idMap.get(childId) || childId),
			linkedNodes: node.linkedNodes
				? Object.fromEntries(
						Object.entries(node.linkedNodes).map(([key, linkedId]) => [
							key,
							idMap.get(linkedId as NodeId) || linkedId
						])
					)
				: node.linkedNodes
		}

		newNodes[newId] = updatedNode
	})

	return newNodes
}
