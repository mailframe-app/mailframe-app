import type { FolderTree } from '../../api/types'

export type FolderOption = {
	id: string | null
	label: string
	ancestorHasSibling: boolean[]
	isLast: boolean
}

export const flattenTreeForDisplay = (
	nodes: FolderTree[],
	parentLineage: boolean[] = [],
	includeRoot = true
): FolderOption[] => {
	let options: FolderOption[] = includeRoot
		? [{ id: null, label: 'В корневую папку', ancestorHasSibling: [], isLast: true }]
		: []

	nodes.forEach((node, index) => {
		const isLast = index === nodes.length - 1
		options.push({
			id: node.id,
			label: node.name,
			ancestorHasSibling: parentLineage,
			isLast: isLast
		})

		if (node.children && node.children.length > 0) {
			const nextLineage = [...parentLineage, !isLast]
			options = options.concat(flattenTreeForDisplay(node.children, nextLineage, false))
		}
	})

	return options
}
